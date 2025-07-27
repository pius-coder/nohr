// 🚀 NOHR Generated API Routes
// ⚠️  ATTENTION: This file is auto-generated. Do not modify manually!
// Generated on: 2025-07-27T00:25:22.875Z

import { Context } from 'hono';

import * as ApiRoute0 from '../../app/api/products/route';
import * as ApiRoute1 from '../../app/api/users/route';
import * as ApiRoute2 from '../../app/api/products/[id]/route';

export interface ApiRouteConfig {
  path: string;
  module: any;
  importPath: string;
  filePath: string;
  methods: string[];
}

export const apiRoutes: ApiRouteConfig[] = [
  {
    path: '/api/products',
    module: ApiRoute0,
    importPath: '../../app/api/products/route',
    filePath: 'products\route.ts',
    methods: ["GET","POST","DELETE"]
  },
  {
    path: '/api/users',
    module: ApiRoute1,
    importPath: '../../app/api/users/route',
    filePath: 'users\route.ts',
    methods: ["GET","POST","PUT","DELETE"]
  },
  {
    path: '/api/products/:id',
    module: ApiRoute2,
    importPath: '../../app/api/products/[id]/route',
    filePath: 'products\[id]\route.ts',
    methods: ["GET","PUT","DELETE","PATCH"]
  }
];

// Get API route statistics
export function getApiRouteStats() {
  const totalMethods = apiRoutes.reduce((sum, route) => sum + route.methods.length, 0);
  
  return {
    totalRoutes: apiRoutes.length,
    totalMethods,
    staticRoutes: apiRoutes.filter(r => !r.path.includes(':')).length,
    dynamicRoutes: apiRoutes.filter(r => r.path.includes(':')).length,
    generatedAt: '2025-07-27T00:25:22.878Z'
  };
}

// Debug helper
export function debugApiRoutes() {
  console.log('🚀 NOHR API Routes:');
  apiRoutes.forEach(route => {
    console.log(`  [${route.methods.join(', ')}] ${route.path} -> ${route.filePath}`);
  });
  const stats = getApiRouteStats();
  console.log(`📊 Stats: ${stats.totalRoutes} routes, ${stats.totalMethods} methods, ${stats.staticRoutes} static, ${stats.dynamicRoutes} dynamic`);
}
