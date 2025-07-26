import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/node'

export default defineConfig({
  plugins: [
    devServer({
      adapter,
      entry: 'src/server.ts',
    }),
  ],
  server: {
    port: 3001, // Different port to avoid conflicts
  },
  build: {
    target: 'esnext',
    minify: false,
    sourcemap: true,
  },
  esbuild: {
    target: 'es2020',
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
})
