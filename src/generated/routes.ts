// 🚀 NOHR Generated Routes
// ⚠️  ATTENTION: This file is auto-generated. Do not modify manually!
// Generated on: 2025-07-27T00:25:21.959Z

import { ComponentType } from 'react';

import Page0 from '../../app/(pages)/page';
import Page1 from '../../app/(pages)/about/page';
import Page2 from '../../app/(pages)/dashboard/page';
import Page3 from '../../app/(pages)/users/page';
import Page4 from '../../app/(pages)/users/[id]/page';

import Layout0 from '../../app/(pages)/layout';
import Layout1 from '../../app/(pages)/dashboard/layout';

export interface RouteConfig {
  path: string;
  component: ComponentType<any>;
  layouts: ComponentType<any>[];
  importPath: string;
  filePath: string;
  layoutPaths: string[];
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    component: Page0,
    layouts: [Layout0],
    importPath: '../../app/(pages)/page',
    filePath: 'page.tsx',
    layoutPaths: ["../../app/(pages)/layout"]
  },
  {
    path: '/about',
    component: Page1,
    layouts: [Layout0],
    importPath: '../../app/(pages)/about/page',
    filePath: 'about\page.tsx',
    layoutPaths: ["../../app/(pages)/layout"]
  },
  {
    path: '/dashboard',
    component: Page2,
    layouts: [Layout0, Layout1],
    importPath: '../../app/(pages)/dashboard/page',
    filePath: 'dashboard\page.tsx',
    layoutPaths: ["../../app/(pages)/layout","../../app/(pages)/dashboard/layout"]
  },
  {
    path: '/users',
    component: Page3,
    layouts: [Layout0],
    importPath: '../../app/(pages)/users/page',
    filePath: 'users\page.tsx',
    layoutPaths: ["../../app/(pages)/layout"]
  },
  {
    path: '/users/:id',
    component: Page4,
    layouts: [Layout0],
    importPath: '../../app/(pages)/users/[id]/page',
    filePath: 'users\[id]\page.tsx',
    layoutPaths: ["../../app/(pages)/layout"]
  }
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
    generatedAt: '2025-07-27T00:25:21.961Z'
  };
}

// Debug helper
export function debugRoutes() {
  console.log('🚀 NOHR Routes:');
  routes.forEach(route => {
    console.log(`  ${route.path} -> ${route.filePath}`);
  });
  console.log(`📊 Stats: ${getRouteStats().totalRoutes} total, ${getRouteStats().staticRoutes} static, ${getRouteStats().dynamicRoutes} dynamic`);
}
