// 🚀 NOHR API Route Generator - Automatic File-System Based API Routing
// Scans app/api and generates src/generated/api-routes.ts

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Liste des méthodes HTTP valides
const VALID_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

async function generateApiRoutes() {
  console.log('🔄 Generating API routes from file system...');
  
  const projectRoot = path.join(__dirname, '..');
  const apiDir = path.join(projectRoot, 'app', 'api');
  const outputDir = path.join(projectRoot, 'src', 'generated');
  const outputFile = path.join(outputDir, 'api-routes.ts');

  try {
    // Scan for route.ts files recursively
    const routeFiles = await scanForRouteFiles(apiDir);
    console.log(`📁 Found ${routeFiles.length} API route files`);

    const apiRoutes = [];

    for (const file of routeFiles) {
      const relativePath = path.relative(apiDir, file);
      
      // Transformer le chemin du fichier en chemin d'URL
      let routePath = '/api/' + relativePath.replace(/\\/g, '/').replace('/route.ts', '');
      
      // Gérer les routes dynamiques [id] -> :id
      routePath = routePath.replace(/\[([^\]]+)\]/g, ':$1');
      
      // Clean up trailing slashes
      if (routePath !== '/api' && routePath.endsWith('/')) {
        routePath = routePath.slice(0, -1);
      }

      // Generate import path
      const importPath = '../../app/api/' + relativePath.replace(/\\/g, '/').replace('.ts', '');

      // Try to analyze the file to detect exported methods
      const methods = await detectExportedMethods(file);

      if (methods.length > 0) {
        apiRoutes.push({
          path: routePath,
          importPath,
          filePath: relativePath,
          methods
        });
      }
    }

    // Sort routes by specificity (static routes first, then dynamic)
    apiRoutes.sort((a, b) => {
      const aHasDynamic = a.path.includes(':');
      const bHasDynamic = b.path.includes(':');
      
      if (aHasDynamic && !bHasDynamic) return 1;
      if (!aHasDynamic && bHasDynamic) return -1;
      return a.path.localeCompare(b.path);
    });

    // Generate TypeScript content
    const content = generateApiRouteFileContent(apiRoutes);

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Write the API routes file
    await fs.writeFile(outputFile, content, 'utf-8');

    console.log('✅ API routes generated successfully!');
    console.log(`📄 Output: ${path.relative(projectRoot, outputFile)}`);
    
    // Log generated routes for debugging
    apiRoutes.forEach(route => {
      console.log(`   [${route.methods.join(', ')}] ${route.path} -> ${route.filePath}`);
    });

  } catch (error) {
    console.error('❌ Failed to generate API routes:', error);
    process.exit(1);
  }
}

// Recursively scan for route.ts files
async function scanForRouteFiles(dir) {
  const routeFiles = [];
  
  async function scan(currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory()) {
          await scan(fullPath);
        } else if (entry.name === 'route.ts') {
          routeFiles.push(fullPath);
        }
      }
    } catch (error) {
      // Directory might not exist, that's ok
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }
  }
  
  await scan(dir);
  return routeFiles;
}

// Detect exported HTTP methods in a route file
async function detectExportedMethods(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const methods = [];
    
    // Simple regex to detect exported functions
    for (const method of VALID_METHODS) {
      const exportRegex = new RegExp(`export\\s+(async\\s+)?function\\s+${method}\\s*\\(`, 'g');
      const namedExportRegex = new RegExp(`export\\s*{[^}]*\\b${method}\\b[^}]*}`, 'g');
      
      if (exportRegex.test(content) || namedExportRegex.test(content)) {
        methods.push(method);
      }
    }
    
    return methods;
  } catch (error) {
    console.warn(`⚠️ Could not analyze file ${filePath}:`, error.message);
    return [];
  }
}

// Generate the TypeScript content for API routes file
function generateApiRouteFileContent(apiRoutes) {
  const imports = apiRoutes.map((route, index) => 
    `import * as ApiRoute${index} from '${route.importPath}';`
  ).join('\n');

  const routeConfigs = apiRoutes.map((route, index) => `  {
    path: '${route.path}',
    module: ApiRoute${index},
    importPath: '${route.importPath}',
    filePath: '${route.filePath}',
    methods: ${JSON.stringify(route.methods)}
  }`).join(',\n');

  return `// 🚀 NOHR Generated API Routes
// ⚠️  ATTENTION: This file is auto-generated. Do not modify manually!
// Generated on: ${new Date().toISOString()}

import { Context } from 'hono';

${imports}

export interface ApiRouteConfig {
  path: string;
  module: any;
  importPath: string;
  filePath: string;
  methods: string[];
}

export const apiRoutes: ApiRouteConfig[] = [
${routeConfigs}
];

// Get API route statistics
export function getApiRouteStats() {
  const totalMethods = apiRoutes.reduce((sum, route) => sum + route.methods.length, 0);
  
  return {
    totalRoutes: apiRoutes.length,
    totalMethods,
    staticRoutes: apiRoutes.filter(r => !r.path.includes(':')).length,
    dynamicRoutes: apiRoutes.filter(r => r.path.includes(':')).length,
    generatedAt: '${new Date().toISOString()}'
  };
}

// Debug helper
export function debugApiRoutes() {
  console.log('🚀 NOHR API Routes:');
  apiRoutes.forEach(route => {
    console.log(\`  [\${route.methods.join(', ')}] \${route.path} -> \${route.filePath}\`);
  });
  const stats = getApiRouteStats();
  console.log(\`📊 Stats: \${stats.totalRoutes} routes, \${stats.totalMethods} methods, \${stats.staticRoutes} static, \${stats.dynamicRoutes} dynamic\`);
}
`;
}

// Run the generator
generateApiRoutes();
