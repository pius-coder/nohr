import { build } from 'esbuild';

// Configuration pour le build client
const clientConfig = {
  entryPoints: ['src/client.tsx'],
  outdir: 'dist/public',
  bundle: true,
  format: 'esm',
  target: 'es2020',
  platform: 'browser',
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV === 'development',
  treeShaking: true,
  splitting: false, // Désactivé pour éviter les problèmes de modules
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
  external: [], // Ne pas externaliser les dépendances
};

// Configuration pour le build serveur
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
  external: ['@hono/node-server'], // Garder les dépendances Node.js externes
};

// Fonction pour build le client
export async function buildClient() {
  try {
    console.log('🔨 Building client...');
    await build(clientConfig);
    console.log('✅ Client build completed');
  } catch (error) {
    console.error('❌ Client build failed:', error);
    process.exit(1);
  }
}

// Fonction pour build le serveur
export async function buildServer() {
  try {
    console.log('🔨 Building server...');
    await build(serverConfig);
    console.log('✅ Server build completed');
  } catch (error) {
    console.error('❌ Server build failed:', error);
    process.exit(1);
  }
}

// Si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  
  switch (command) {
    case 'client':
      await buildClient();
      break;
    case 'server':
      await buildServer();
      break;
    case 'all':
      await buildClient();
      await buildServer();
      break;
    default:
      console.log('Usage: node esbuild.config.js [client|server|all]');
      process.exit(1);
  }
}
