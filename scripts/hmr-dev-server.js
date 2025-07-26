import { spawn } from 'child_process';
import { context } from 'esbuild';
import chokidar from 'chokidar';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 🎨 Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// 📝 Enhanced logging function
function logHMR(status, message, details = '') {
  const timestamp = new Date().toLocaleTimeString();
  const statusColors = {
    start: colors.yellow,
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
    info: colors.blue,
    hmr: colors.magenta,
    build: colors.cyan,
  };

  const color = statusColors[status] || colors.reset;
  console.log(`${color}[${timestamp}] [HMR] ${message}${colors.reset}${details ? ` ${details}` : ''}`);
}

// 🔥 HMR WebSocket Server
class HMRServer {
  constructor(port = 3002) {
    this.port = port;
    this.clients = new Set();
    this.server = null;
    this.wss = null;
  }

  start() {
    this.server = createServer();
    this.wss = new WebSocketServer({ server: this.server });

    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      logHMR('info', `HMR client connected (${this.clients.size} total)`);

      ws.on('close', () => {
        this.clients.delete(ws);
        logHMR('info', `HMR client disconnected (${this.clients.size} total)`);
      });

      ws.on('error', (error) => {
        logHMR('error', 'HMR WebSocket error:', error.message);
        this.clients.delete(ws);
      });
    });

    this.server.listen(this.port, () => {
      logHMR('success', `HMR WebSocket server running on ws://localhost:${this.port}`);
    });
  }

  broadcast(message) {
    const data = JSON.stringify(message);
    this.clients.forEach((client) => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(data);
      }
    });
  }

  notifyUpdate(type, file) {
    this.broadcast({
      type: 'update',
      updateType: type,
      file: file,
      timestamp: Date.now(),
    });
    logHMR('hmr', `Sent ${type} update for ${file}`);
  }

  notifyError(error) {
    this.broadcast({
      type: 'error',
      error: error.message,
      timestamp: Date.now(),
    });
    logHMR('error', 'Sent error to clients:', error.message);
  }

  close() {
    if (this.wss) {
      this.wss.close();
    }
    if (this.server) {
      this.server.close();
    }
  }
}

// 🚀 Enhanced Development Server
class EnhancedDevServer {
  constructor() {
    this.serverProcess = null;
    this.clientContext = null;
    this.hmrServer = new HMRServer();
    this.isBuilding = false;
    this.buildQueue = [];
  }

  // 🔨 Client build configuration with HMR injection
  getClientBuildConfig() {
    return {
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
        "process.env.HMR_PORT": '"3002"',
      },
      banner: {
        js: `
// HMR Client Runtime
(function() {
  if (typeof window !== 'undefined') {
    const ws = new WebSocket('ws://localhost:3002');
    
    ws.onopen = () => console.log('[HMR] Connected');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'update') {
        console.log('[HMR] Update received:', data.updateType, data.file);
        
        if (data.updateType === 'client') {
          // Reload the page for client updates
          window.location.reload();
        } else if (data.updateType === 'css') {
          // Hot reload CSS
          const links = document.querySelectorAll('link[rel="stylesheet"]');
          links.forEach(link => {
            const href = link.href;
            link.href = href + '?t=' + Date.now();
          });
        }
      } else if (data.type === 'error') {
        console.error('[HMR] Build error:', data.error);
      }
    };
    
    ws.onclose = () => {
      console.log('[HMR] Disconnected, attempting to reconnect...');
      setTimeout(() => window.location.reload(), 1000);
    };
  }
})();
        `,
      },
    };
  }

  async buildClient() {
    if (this.isBuilding) {
      this.buildQueue.push('client');
      return;
    }

    this.isBuilding = true;
    logHMR('build', '🔨 Building client...');

    try {
      if (!this.clientContext) {
        this.clientContext = await context(this.getClientBuildConfig());
      }

      await this.clientContext.rebuild();
      logHMR('success', '✅ Client build completed');
      this.hmrServer.notifyUpdate('client', 'src/client.tsx');
    } catch (error) {
      logHMR('error', '❌ Client build failed:', error.message);
      this.hmrServer.notifyError(error);
    } finally {
      this.isBuilding = false;
      
      // Process queued builds
      if (this.buildQueue.length > 0) {
        const nextBuild = this.buildQueue.shift();
        setTimeout(() => this.buildClient(), 100);
      }
    }
  }

  async buildServer() {
    logHMR('build', '🔨 Building server...');

    try {
      const { spawn } = await import('child_process');
      const buildProcess = spawn('node', ['esbuild.hmr.config.js', 'server'], {
        stdio: 'pipe',
        cwd: projectRoot,
      });

      return new Promise((resolve, reject) => {
        let output = '';
        let errorOutput = '';

        buildProcess.stdout.on('data', (data) => {
          output += data.toString();
        });

        buildProcess.stderr.on('data', (data) => {
          errorOutput += data.toString();
        });

        buildProcess.on('close', (code) => {
          if (code === 0) {
            logHMR('success', '✅ Server build completed');
            resolve();
          } else {
            logHMR('error', '❌ Server build failed:', errorOutput);
            reject(new Error('Server build failed'));
          }
        });
      });
    } catch (error) {
      logHMR('error', '❌ Server build error:', error.message);
      throw error;
    }
  }

  async startServer() {
    if (this.serverProcess) {
      logHMR('info', '🔄 Stopping existing server...');
      this.serverProcess.kill();
      this.serverProcess = null;
    }

    // Build server first
    try {
      await this.buildServer();
    } catch (error) {
      logHMR('error', '❌ Failed to build server, cannot start');
      return;
    }

    logHMR('info', '🚀 Starting NOHR server with HMR...');

    try {
      this.serverProcess = spawn('node', ['dist/server.js'], {
        cwd: projectRoot,
        stdio: 'inherit',
        env: {
          ...process.env,
          NODE_ENV: 'development',
          NOHR_DEV_MODE: 'true',
          HMR_ENABLED: 'true',
        },
      });

      this.serverProcess.on('close', (code) => {
        if (code !== null && code !== 0) {
          logHMR('error', `❌ Server exited with code ${code}`);
        }
      });

      this.serverProcess.on('error', (error) => {
        logHMR('error', `❌ Server error: ${error.message}`);
      });

    } catch (error) {
      logHMR('error', `❌ Failed to start server: ${error.message}`);
    }
  }

  setupWatchers() {
    // Watch client files
    const clientWatcher = chokidar.watch([
      'src/client.tsx',
      'app',
    ], {
      ignored: ['node_modules/**', 'dist/**'],
      persistent: true,
      ignoreInitial: true,
    });

    clientWatcher.on('change', (filePath) => {
      const relativePath = path.relative(projectRoot, filePath);

      // Only process relevant file types
      if (!/\.(ts|tsx|js|jsx)$/.test(filePath)) {
        return;
      }

      logHMR('info', `📝 Client file changed: ${relativePath}`);
      this.buildClient();
    });

    // Watch server files
    const serverWatcher = chokidar.watch([
      'src/server.ts',
      'app',
      'package.json',
    ], {
      ignored: ['node_modules/**', 'dist/**'],
      persistent: true,
    });

    serverWatcher.on('change', async (filePath) => {
      const relativePath = path.relative(projectRoot, filePath);

      // Only process relevant files
      if (!/\.(ts|tsx|json)$/.test(filePath) && !filePath.includes('package.json')) {
        return;
      }

      logHMR('info', `📝 Server file changed: ${relativePath}`);
      logHMR('info', '🔄 Rebuilding and restarting server...');
      await this.startServer();
    });

    return { clientWatcher, serverWatcher };
  }

  async start() {
    console.log(`${colors.bright}${colors.magenta}🔥 NOHR HMR Development Server${colors.reset}`);
    console.log(`${colors.cyan}📁 Project: ${projectRoot}${colors.reset}`);
    console.log('');

    // Start HMR WebSocket server
    this.hmrServer.start();

    // Initial client build
    await this.buildClient();

    // Setup file watchers
    const { clientWatcher, serverWatcher } = this.setupWatchers();

    // Start server
    await this.startServer();

    logHMR('success', '✅ HMR Dev server ready!');
    logHMR('info', '🌐 Open http://localhost:3000 to view your app');
    logHMR('info', '🔥 HMR WebSocket: ws://localhost:3002');

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down HMR dev server...');
      
      if (this.serverProcess) {
        this.serverProcess.kill();
      }
      
      if (this.clientContext) {
        await this.clientContext.dispose();
      }
      
      this.hmrServer.close();
      clientWatcher.close();
      serverWatcher.close();
      
      console.log('✅ HMR Dev server stopped');
      process.exit(0);
    });
  }
}

// 🚀 Start the enhanced development server
const devServer = new EnhancedDevServer();
devServer.start().catch((error) => {
  console.error('Failed to start HMR dev server:', error);
  process.exit(1);
});
