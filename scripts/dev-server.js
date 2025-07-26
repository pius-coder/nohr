import { context } from "esbuild";
import { spawn } from "child_process";
import chokidar from "chokidar";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// 🎨 Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// 📝 Simple logging function
function logBuildStatus(status, message) {
  const timestamp = new Date().toLocaleTimeString();
  const statusColors = {
    start: colors.yellow,
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
    info: colors.blue,
  };

  const color = statusColors[status] || colors.reset;
  console.log(`${color}[${timestamp}] ${message}${colors.reset}`);
}

let serverProcess = null;

// 🔨 Client build configuration
const clientBuildConfig = {
  entryPoints: ["src/client.tsx"],
  outfile: "dist/public/client.js",
  bundle: true,
  format: "esm",
  target: "es2020",
  platform: "browser",
  minify: false,
  sourcemap: true,
  jsx: "automatic",
  jsxImportSource: "react",
  define: {
    "process.env.NODE_ENV": '"development"',
  },
};

// 🚀 Start server process
function startServer() {
  if (serverProcess) {
    logBuildStatus("info", "🔄 Stopping existing server...");
    serverProcess.kill();
    serverProcess = null;
  }

  logBuildStatus("info", "🚀 Starting NOHR server...");

  const isWindows = process.platform === "win32";
  const scriptPath = path.join(__dirname, isWindows ? "start-server.bat" : "start-server.sh");

  try {
    if (isWindows) {
      serverProcess = spawn(scriptPath, [], {
        cwd: projectRoot,
        stdio: "inherit",
        shell: true,
        env: {
          ...process.env,
          NODE_ENV: "development",
          NOHR_DEV_MODE: "true",
        },
      });
    } else {
      serverProcess = spawn("bash", [scriptPath], {
        cwd: projectRoot,
        stdio: "inherit",
        env: {
          ...process.env,
          NODE_ENV: "development",
          NOHR_DEV_MODE: "true",
        },
      });
    }

    serverProcess.on("close", (code) => {
      if (code !== null && code !== 0) {
        logBuildStatus("error", `❌ Server exited with code ${code}`);
      }
    });

    serverProcess.on("error", (error) => {
      logBuildStatus("error", `❌ Server error: ${error.message}`);
    });

  } catch (error) {
    logBuildStatus("error", `❌ Failed to start server: ${error.message}`);
  }
}

// 🚀 Start development server
async function startDevServer() {
  console.log(`${colors.bright}${colors.magenta}🚀 NOHR Development Server${colors.reset}`);
  console.log(`${colors.cyan}📁 Project: ${projectRoot}${colors.reset}`);
  console.log("");

  logBuildStatus("info", "🏗️ Starting initial build...");

  try {
    // Build client with watch mode
    const ctx = await context(clientBuildConfig);

    ctx.onStart(() => {
      logBuildStatus("start", "🔨 Building client...");
    });

    ctx.onEnd((result) => {
      const duration = Date.now();
      if (result.errors.length > 0) {
        logBuildStatus("error", `❌ Client build failed with ${result.errors.length} errors`);
        result.errors.forEach(error => console.error(error));
      } else {
        logBuildStatus("success", `✅ Client build completed`);
      }
    });

    // Watch for changes
    logBuildStatus("info", "👀 Watching for file changes...");
    await ctx.watch();

    // Watch server files for restart
    const serverWatcher = chokidar.watch([
      'src/server.ts',
      'app/**/*.{ts,tsx}',
      'package.json'
    ], {
      ignored: ['node_modules/**', 'dist/**'],
      persistent: true
    });

    serverWatcher.on('change', (filePath) => {
      const relativePath = path.relative(projectRoot, filePath);
      logBuildStatus("info", `📝 Server file changed: ${relativePath}`);
      logBuildStatus("info", "🔄 Restarting server...");
      startServer();
    });

    // Start initial server
    startServer();

    logBuildStatus("success", "✅ Dev server ready!");
    logBuildStatus("info", "🌐 Open http://localhost:3000 to view your app");

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down dev server...');
      
      if (serverProcess) {
        serverProcess.kill();
      }
      
      await ctx.dispose();
      serverWatcher.close();
      
      console.log('✅ Dev server stopped');
      process.exit(0);
    });

  } catch (error) {
    logBuildStatus("error", `❌ Failed to start dev server: ${error.message}`);
    process.exit(1);
  }
}

// 🎯 Start the development server
startDevServer().catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
