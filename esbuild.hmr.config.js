import { build, context } from 'esbuild';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

// 🔥 HMR-Enhanced esbuild Configuration
// This configuration integrates esbuild with our HMR system

// Configuration pour le build client avec HMR
const clientHMRConfig = {
  entryPoints: ['src/client.tsx'],
  outdir: 'dist/public',
  bundle: true,
  format: 'esm',
  target: 'es2020',
  platform: 'browser',
  minify: false, // Disabled for better debugging in development
  sourcemap: true,
  treeShaking: true,
  splitting: false,
  jsx: 'automatic',
  jsxImportSource: 'react',
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.HMR_PORT': JSON.stringify(process.env.HMR_PORT || '3002'),
    'process.env.HMR_ENABLED': JSON.stringify('true'),
  },
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
    '.jsx': 'jsx',
    '.js': 'js',
    '.css': 'css',
    '.png': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.gif': 'file',
    '.svg': 'file',
  },
  resolveExtensions: ['.tsx', '.ts', '.jsx', '.js'],
  external: [], // Bundle everything for client
  metafile: true, // Enable metafile for analysis
  banner: {
    js: `
// 🔥 HMR Runtime Injection
console.log('[HMR] Client bundle loaded with HMR support');
    `,
  },
  plugins: [
    // HMR Plugin for esbuild
    {
      name: 'hmr-plugin',
      setup(build) {
        build.onStart(() => {
          console.log('[HMR] 🔨 Building client bundle...');
        });

        build.onEnd((result) => {
          if (result.errors.length > 0) {
            console.error('[HMR] ❌ Client build failed:', result.errors);
          } else {
            console.log('[HMR] ✅ Client build completed');
            
            // Log bundle analysis if metafile is available
            if (result.metafile) {
              const outputs = Object.keys(result.metafile.outputs);
              console.log('[HMR] 📦 Generated files:', outputs);
            }
          }
        });

        // Watch for file changes and trigger rebuilds
        build.onResolve({ filter: /.*/ }, (args) => {
          // Track resolved files for HMR
          if (args.path.includes('/app/') || args.path.includes('/src/')) {
            // This file is part of our application
            return null; // Let esbuild handle it normally
          }
          return null;
        });
      },
    },

    // React Fast Refresh Plugin (simplified)
    {
      name: 'react-fast-refresh',
      setup(build) {
        build.onLoad({ filter: /\.(tsx|jsx)$/ }, async (args) => {
          // For React components, we could inject Fast Refresh runtime
          // This is a simplified version - a full implementation would be more complex
          
          if (args.path.includes('/app/') && !args.path.includes('node_modules')) {
            // This is likely a React component in our app
            const fs = require('fs');
            const contents = await fs.promises.readFile(args.path, 'utf8');
            
            // Check if this looks like a React component
            const isReactComponent = /export\s+default\s+function|export\s+default\s+\w+|function\s+\w+.*\{.*return.*</.test(contents);
            
            if (isReactComponent) {
              // Inject HMR acceptance code
              const hmrCode = `
// HMR acceptance for React component
if (typeof window !== 'undefined' && window.__HMR_RUNTIME__ && process.env.NODE_ENV === 'development') {
  window.__HMR_RUNTIME__.accept('${args.path}', () => {
    console.log('[HMR] Component ${args.path} updated');
  });
}
              `;
              
              return {
                contents: contents + hmrCode,
                loader: 'tsx',
              };
            }
          }
          
          return null; // Let esbuild handle normally
        });
      },
    },
  ],
};

// Configuration pour le build serveur avec support Node.js amélioré
const serverConfig = {
  entryPoints: ['src/server.ts'],
  outdir: 'dist',
  bundle: true,
  format: 'esm',
  target: 'node18',
  platform: 'node',
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV === 'development',
  jsx: 'automatic',
  jsxImportSource: 'react',
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
  },
  resolveExtensions: ['.tsx', '.ts', '.jsx', '.js'],
  external: [
    '@hono/node-server',
    'react',
    'react-dom',
    'react-dom/server',
    // Node.js built-ins
    'util',
    'fs',
    'path',
    'url',
    'crypto',
    'stream',
    'buffer',
    'events',
    'os',
    'http',
    'https',
    'zlib',
  ],
};

// 🔨 Build functions
export async function buildClientHMR() {
  try {
    console.log('🔥 Building client with HMR support...');
    const result = await build(clientHMRConfig);
    
    if (result.metafile) {
      // Analyze bundle
      const outputs = Object.entries(result.metafile.outputs);
      outputs.forEach(([file, info]) => {
        const size = (info.bytes / 1024).toFixed(2);
        console.log(`📦 ${file}: ${size} KB`);
      });
    }
    
    console.log('✅ Client HMR build completed');
    return result;
  } catch (error) {
    console.error('❌ Client HMR build failed:', error);
    throw error;
  }
}

export async function buildServer() {
  try {
    console.log('🔨 Building server...');
    const result = await build(serverConfig);
    console.log('✅ Server build completed');
    return result;
  } catch (error) {
    console.error('❌ Server build failed:', error);
    throw error;
  }
}

export async function createClientHMRContext() {
  try {
    console.log('🔥 Creating client HMR context...');
    const ctx = await context(clientHMRConfig);
    console.log('✅ Client HMR context created');
    return ctx;
  } catch (error) {
    console.error('❌ Failed to create client HMR context:', error);
    throw error;
  }
}

// Si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  switch (command) {
    case 'client-hmr':
      await buildClientHMR();
      break;
    case 'server':
      await buildServer();
      break;
    case 'all-hmr':
      await buildClientHMR();
      await buildServer();
      break;
    default:
      console.log('Usage: node esbuild.hmr.config.js [client-hmr|server|all-hmr]');
      process.exit(1);
  }
}
