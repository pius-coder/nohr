// 🚀 NOHR Centralized Router - Single Source of Truth
// Eliminates route duplication between server and client

export interface RouteConfig {
  path: string;
  component: () => Promise<{ default: React.ComponentType<any>; loadData?: (context: any) => Promise<any> }>;
  exact?: boolean;
}

// 🎯 AMÉLIORATION: Routage centralisé pour éviter la duplication
export const routes: RouteConfig[] = [
  {
    path: "/",
    component: () => import("../app/(pages)/page"),
    exact: true
  },
  {
    path: "/about",
    component: () => import("../app/(pages)/about/page"),
    exact: true
  },
  {
    path: "/users",
    component: () => import("../app/(pages)/users/page"),
    exact: true
  },
  {
    path: "/users/:id",
    component: () => import("../app/(pages)/users/[id]/page"),
    exact: true
  }
];

// 🧠 Route matching logic (shared between server and client)
export function matchRoute(pathname: string): { route: RouteConfig; params: Record<string, string> } | null {
  for (const route of routes) {
    const params = matchPath(route.path, pathname);
    if (params !== null) {
      return { route, params };
    }
  }
  return null;
}

// 🔍 Path matching with parameter extraction
function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  // Convert pattern to regex
  const paramNames: string[] = [];
  const regexPattern = pattern.replace(/:([^/]+)/g, (_, paramName) => {
    paramNames.push(paramName);
    return '([^/]+)';
  });

  const regex = new RegExp(`^${regexPattern}$`);
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

// 🎯 Generate route manifest for client-side code splitting
export function generateRouteManifest() {
  return routes.reduce((manifest, route) => {
    manifest[route.path] = {
      chunk: route.path === "/" ? "index" : route.path.replace(/[/:]/g, "_"),
      exact: route.exact
    };
    return manifest;
  }, {} as Record<string, { chunk: string; exact?: boolean }>);
}

// 🔧 Utility to get route by path
export function getRouteByPath(pathname: string): RouteConfig | null {
  const match = matchRoute(pathname);
  return match ? match.route : null;
}

// 📊 Route analytics helper
export function getRouteStats() {
  return {
    totalRoutes: routes.length,
    dynamicRoutes: routes.filter(r => r.path.includes(':')).length,
    staticRoutes: routes.filter(r => !r.path.includes(':')).length
  };
}
