import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { compress } from "hono/compress";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { serve } from "@hono/node-server";

// 🚀 Import des pages React
import HomePage from "@/app/(pages)/page";
import AboutPage from "@/app/(pages)/about/page";
import UsersPage from "@/app/(pages)/users/page";
import UserPage from "@/app/(pages)/users/[id]/page";

// Import des routes API (mixte : default export + named exports)
import helloRouteApp from "@/app/api/hello/route";
import * as usersRoute from "@/app/api/users/route";
import * as userByIdRoute from "@/app/api/users/[id]/route";

// 🎯 Initialisation de l'application Hono
const app = new Hono();

// 🗜️ Middleware de compression intelligent
app.use(
  "*",
  compress({
    encoding: "gzip",
    threshold: 1024, // Compresser seulement les réponses > 1KB
  })
);

// 🎨 Template HTML optimisé
function htmlTemplate(content: string, title: string, route: string): string {
  const timestamp = Date.now();
  const buildId = `nohr-${timestamp}`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="NOHR Framework - Ultra-fast full-stack with Node.js + Hono + React">
  <meta name="generator" content="NOHR Framework">
  <meta name="build-id" content="${buildId}">
  <meta name="route" content="${route}">
  
  <!-- Preload critical resources -->
  <link rel="preload" href="/client.js" as="script">
  <link rel="dns-prefetch" href="//localhost">
  
  <!-- Critical CSS inlined -->
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { 
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6; 
      color: #333;
      background: #fff;
    }
    .loading { opacity: 0; transition: opacity 0.3s ease; }
    .loaded { opacity: 1; }
  </style>
</head>
<body>
  <div id="root" class="loading">${content}</div>
  
  <!-- Performance metrics -->
  <script>
    window.__NOHR_PERFORMANCE__ = {
      ssrRender: ${Date.now() - timestamp},
      buildId: '${buildId}',
      route: '${route}',
      timestamp: ${timestamp}
    };
    
    // Mark as loaded when hydrated
    document.addEventListener('DOMContentLoaded', () => {
      document.getElementById('root').classList.add('loaded');
      document.getElementById('root').classList.remove('loading');
    });
  </script>
  
  <!-- Client-side hydration -->
  <script type="module" src="/client.js" defer></script>
</body>
</html>`;
}

// 🚀 Configuration des routes manuelles
function setupRoutes() {
  console.log("🔧 Setting up manual routes...");

  // 📄 Routes de pages avec SSR
  setupPageRoutes();

  // 🔗 Routes API
  setupApiRoutes();

  console.log("✅ All manual routes configured");
}

// 📄 Configuration des routes de pages
function setupPageRoutes() {
  // Page d'accueil
  app.get("/", async (c) => {
    const pageElement = createElement(HomePage);
    const content = renderToString(pageElement);
    const html = htmlTemplate(content, "NOHR Framework - Home", "/");
    return c.html(html);
  });

  // Page à propos
  app.get("/about", async (c) => {
    const pageElement = createElement(AboutPage);
    const content = renderToString(pageElement);
    const html = htmlTemplate(content, "NOHR Framework - About", "/about");
    return c.html(html);
  });

  // Page utilisateurs
  app.get("/users", async (c) => {
    const pageElement = createElement(UsersPage);
    const content = renderToString(pageElement);
    const html = htmlTemplate(content, "NOHR Framework - Users", "/users");
    return c.html(html);
  });

  // Page utilisateur dynamique
  app.get("/users/:id", async (c) => {
    const id = c.req.param("id");
    const pageElement = createElement(UserPage, { params: { id } });
    const content = renderToString(pageElement);
    const html = htmlTemplate(
      content,
      `NOHR Framework - User ${id}`,
      `/users/${id}`
    );
    return c.html(html);
  });
}

// 🔗 Configuration des routes API
function setupApiRoutes() {
  // 🎯 Routes API Hello (Hono app)
  app.route("/api/hello", helloRouteApp);

  // 🎯 Routes API Users (exports nommés)
  if (usersRoute.GET) app.get("/api/users", usersRoute.GET);
  if (usersRoute.POST) app.post("/api/users", usersRoute.POST);
  if (usersRoute.PUT) app.put("/api/users", usersRoute.PUT);
  if (usersRoute.DELETE) app.delete("/api/users", usersRoute.DELETE);

  // 🎯 Routes API Users par ID (exports nommés)
  if (userByIdRoute.GET) app.get("/api/users/:id", userByIdRoute.GET);
  if (userByIdRoute.PUT) app.put("/api/users/:id", userByIdRoute.PUT);
  if (userByIdRoute.DELETE) app.delete("/api/users/:id", userByIdRoute.DELETE);
  if (userByIdRoute.PATCH) app.patch("/api/users/:id", userByIdRoute.PATCH);

  console.log("🔗 API routes configured:");
  console.log("  - /api/hello/* (Hono app with GET, POST, /health)");
  console.log("  - /api/users (GET, POST, PUT, DELETE)");
  console.log("  - /api/users/:id (GET, PUT, DELETE, PATCH)");
}

// 🚀 Initialisation du serveur NOHR
const port = 3000;
console.log(`🚀 Serveur NOHR démarré sur http://localhost:${port}`);
console.log(`📁 Architecture unifiée : Node.js + Hono + React SSR`);

// Configurer les routes manuelles
setupRoutes();

// 📊 Middleware pour les fichiers statiques (priorité basse)
app.use(
  "/*",
  serveStatic({
    root: "./dist/public",
    onNotFound: (path: string) => {
      console.log(`Static file not found: ${path}`);
      return undefined; // Continue to next middleware
    },
  })
);

app.use("/favicon.ico", serveStatic({ path: "./public/favicon.ico" }));

console.log(`✅ Serveur prêt et en écoute sur le port ${port}`);

// Démarrage du serveur Node.js
serve({
  fetch: app.fetch,
  port,
});

console.log(`🚀 NOHR Server running on http://localhost:${port}`);

// Exports pour le file router
export { htmlTemplate };
