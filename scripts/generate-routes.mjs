// 🚀 NOHR Route Generator - Automatic File-System Based Routing
// Scans app/(pages) and generates src/generated/routes.ts

import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateRoutes() {
  console.log("🔄 Generating routes from file system...");

  const projectRoot = path.join(__dirname, "..");
  const pagesDir = path.join(projectRoot, "app", "(pages)");
  const outputDir = path.join(projectRoot, "src", "generated");
  const outputFile = path.join(outputDir, "routes.ts");

  try {
    // Scan for page files recursively
    const pageFiles = await scanForPageFiles(pagesDir);
    console.log(`📁 Found ${pageFiles.length} page files`);

    // Generate route configurations
    const routes = pageFiles.map((file) => {
      const relativePath = path.relative(pagesDir, file);
      let routePath =
        "/" + relativePath.replace(/\\/g, "/").replace("/page.tsx", "");

      // Handle root page (page.tsx in root becomes /)
      if (
        routePath === "/page" ||
        routePath === "" ||
        relativePath === "page.tsx"
      ) {
        routePath = "/";
      }

      // Handle dynamic routes [id] -> :id
      routePath = routePath.replace(/\[([^\]]+)\]/g, ":$1");

      // Clean up trailing slashes
      if (routePath !== "/" && routePath.endsWith("/")) {
        routePath = routePath.slice(0, -1);
      }

      // Generate import path (relative to src/generated/)
      const importPath =
        "../../app/(pages)/" +
        relativePath.replace(/\\/g, "/").replace(".tsx", "");

      // 🎨 NOUVEAU: Find applicable layouts
      const layoutPaths = [];
      let currentDir = path.dirname(path.join(pagesDir, relativePath));

      // Walk up the directory tree to find layouts
      while (currentDir.startsWith(pagesDir) || currentDir === pagesDir) {
        const layoutFile = path.join(currentDir, "layout.tsx");

        if (fsSync.existsSync(layoutFile)) {
          const layoutRelativePath = path.relative(pagesDir, layoutFile);
          const layoutImportPath =
            "../../app/(pages)/" +
            layoutRelativePath.replace(/\\/g, "/").replace(".tsx", "");
          layoutPaths.unshift(layoutImportPath); // Add to beginning (root first)
        }

        // Move up one directory
        const parentDir = path.dirname(currentDir);
        if (parentDir === currentDir) break; // Reached filesystem root
        currentDir = parentDir;
      }

      return {
        path: routePath,
        importPath,
        filePath: relativePath,
        layouts: layoutPaths, // 🎨 Add layouts array
      };
    });

    // Sort routes by specificity (static routes first, then dynamic)
    routes.sort((a, b) => {
      const aHasDynamic = a.path.includes(":");
      const bHasDynamic = b.path.includes(":");

      if (aHasDynamic && !bHasDynamic) return 1;
      if (!aHasDynamic && bHasDynamic) return -1;
      return a.path.localeCompare(b.path);
    });

    // Generate TypeScript content
    const content = generateRouteFileContent(routes);

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Write the routes file
    await fs.writeFile(outputFile, content, "utf-8");

    console.log("✅ Routes generated successfully!");
    console.log(`📄 Output: ${path.relative(projectRoot, outputFile)}`);

    // Log generated routes for debugging
    routes.forEach((route) => {
      console.log(`   ${route.path} -> ${route.filePath}`);
    });
  } catch (error) {
    console.error("❌ Failed to generate routes:", error);
    process.exit(1);
  }
}

// Recursively scan for page.tsx files
async function scanForPageFiles(dir) {
  const pageFiles = [];

  async function scan(currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);

        if (entry.isDirectory()) {
          await scan(fullPath);
        } else if (entry.name === "page.tsx") {
          pageFiles.push(fullPath);
        }
      }
    } catch (error) {
      // Directory might not exist, that's ok
      if (error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  await scan(dir);
  return pageFiles;
}

// Generate the TypeScript content for routes file
function generateRouteFileContent(routes) {
  // Generate imports for pages
  const pageImports = routes
    .map((route, index) => `import Page${index} from '${route.importPath}';`)
    .join("\n");

  // Generate imports for layouts (deduplicated)
  const allLayouts = [...new Set(routes.flatMap((route) => route.layouts))];
  const layoutImports = allLayouts
    .map((layoutPath, index) => `import Layout${index} from '${layoutPath}';`)
    .join("\n");

  const routeConfigs = routes
    .map((route, index) => {
      const layoutComponents = route.layouts.map((layoutPath) => {
        const layoutIndex = allLayouts.indexOf(layoutPath);
        return `Layout${layoutIndex}`;
      });

      return `  {
    path: '${route.path}',
    component: Page${index},
    layouts: [${layoutComponents.join(", ")}],
    importPath: '${route.importPath}',
    filePath: '${route.filePath}',
    layoutPaths: ${JSON.stringify(route.layouts)}
  }`;
    })
    .join(",\n");

  return `// 🚀 NOHR Generated Routes
// ⚠️  ATTENTION: This file is auto-generated. Do not modify manually!
// Generated on: ${new Date().toISOString()}

import { ComponentType } from 'react';

${pageImports}

${layoutImports}

export interface RouteConfig {
  path: string;
  component: ComponentType<any>;
  layouts: ComponentType<any>[];
  importPath: string;
  filePath: string;
  layoutPaths: string[];
}

export const routes: RouteConfig[] = [
${routeConfigs}
];

// Route matching utilities
export function matchRoute(pathname: string): { route: RouteConfig; params: Record<string, string> } | null {
  for (const route of routes) {
    const params = matchPath(route.path, pathname);
    if (params !== null) {
      return { route, params };
    }
  }
  return null;
}

// Simple path matching with parameter extraction
function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  // Convert pattern to regex
  const paramNames: string[] = [];
  const regexPattern = pattern.replace(/:([^/]+)/g, (_, paramName) => {
    paramNames.push(paramName);
    return '([^/]+)';
  });

  const regex = new RegExp('^' + regexPattern + '$');
  const match = pathname.match(regex);

  if (!match) {
    return null;
  }

  // Extract parameters
  const params: Record<string, string> = {};
  paramNames.forEach((name, index) => {
    params[name] = match[index + 1];
  });

  return params;
}

// Get route statistics
export function getRouteStats() {
  return {
    totalRoutes: routes.length,
    staticRoutes: routes.filter(r => !r.path.includes(':')).length,
    dynamicRoutes: routes.filter(r => r.path.includes(':')).length,
    generatedAt: '${new Date().toISOString()}'
  };
}

// Debug helper
export function debugRoutes() {
  console.log('🚀 NOHR Routes:');
  routes.forEach(route => {
    console.log(\`  \${route.path} -> \${route.filePath}\`);
  });
  console.log(\`📊 Stats: \${getRouteStats().totalRoutes} total, \${getRouteStats().staticRoutes} static, \${getRouteStats().dynamicRoutes} dynamic\`);
}
`;
}

// Run the generator
generateRoutes();
