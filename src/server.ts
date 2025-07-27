import { Hono } from "hono";
import { serveStatic } from "@hono/node-server/serve-static";
import { compress } from "hono/compress";
// 🚀 AMÉLIORATION: SSR optimisé avec routage centralisé
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { serve } from "@hono/node-server";
// 🎯 AMÉLIORATION: Routage centralisé avec layouts
import { matchRoute } from "./generated/routes";
import { apiRoutes, debugApiRoutes } from "./generated/api-routes";

// 🎯 Template HTML simple et fonctionnel
function createHtmlTemplate(
  content: string,
  title: string,
  description: string,
  data: any
): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="preload" href="/client.js" as="script">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 0; }
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .loading { text-align: center; padding: 2rem; }
  </style>
</head>
<body>
  <div id="root">${content}</div>
  <script id="__NOHR_DATA__" type="application/json">
    ${JSON.stringify(data)}
  </script>
  <script type="module" src="/client.js" async></script>
</body>
</html>`;
}

// 🧠 Fonctions utilitaires pour les métadonnées
function getPageTitle(
  pathname: string,
  params: Record<string, string>
): string {
  switch (pathname) {
    case "/":
      return "NOHR Framework - Accueil";
    case "/about":
      return "NOHR Framework - À propos";
    case "/users":
      return "NOHR Framework - Utilisateurs";
    default:
      if (pathname.startsWith("/users/")) {
        return `NOHR Framework - Utilisateur ${params.id}`;
      }
      return "NOHR Framework";
  }
}

function getPageDescription(
  pathname: string,
  params: Record<string, string>
): string {
  switch (pathname) {
    case "/":
      return "Architecture unifiée Node.js + Hono + React avec SSR optimisé";
    case "/about":
      return "Découvrez l'architecture NOHR et ses avantages";
    case "/users":
      return "Liste des utilisateurs de l'application NOHR";
    default:
      if (pathname.startsWith("/users/")) {
        return `Profil de l'utilisateur ${params.id}`;
      }
      return "Framework NOHR - Architecture moderne";
  }
}

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

  // 🔗 IMPORTANT: Routes API D'ABORD (avant le catch-all des pages)
  setupApiRoutes();

  // 📄 Routes de pages avec SSR (catch-all en dernier)
  setupPageRoutes();

  console.log("✅ All manual routes configured");
}

// � AMÉLIORATION: Configuration des routes avec système centralisé et Streaming SSR
function setupPageRoutes() {
  // Gestionnaire de route unique et dynamique
  app.get("*", async (c) => {
    const pathname = c.req.path;

    // Ignorer les routes API et les assets
    if (
      pathname.startsWith("/api/") ||
      pathname.startsWith("/public/") ||
      pathname.includes(".")
    ) {
      return c.notFound();
    }

    // Trouver la route correspondante
    const match = matchRoute(pathname);

    if (!match) {
      // 404 - Page non trouvée
      return c.html(
        `
        <html>
          <head><title>404 - Page non trouvée</title></head>
          <body>
            <h1>404 - Page non trouvée</h1>
            <p>La page "${pathname}" n'existe pas.</p>
            <a href="/">Retour à l'accueil</a>
          </body>
        </html>
      `,
        404
      );
    }

    const { route, params } = match;

    try {
      // 🎨 AMÉLIORATION: Utiliser le nouveau système de routes avec layouts
      const PageComponent = route.component;
      const layoutComponents = route.layouts || [];

      // 🎯 AMÉLIORATION: Récupération de données côté serveur si disponible
      let pageData = null;
      try {
        // Construire le chemin absolu pour l'import
        const absolutePath = route.importPath.startsWith("../../")
          ? route.importPath.replace("../../", "../")
          : route.importPath;

        const PageModule = await import(absolutePath);
        if (typeof PageModule.loadData === "function") {
          console.log(`[SSR] 📊 Loading data for ${pathname}`);
          const startTime = performance.now();

          try {
            pageData = await PageModule.loadData({ params, pathname });
            const loadTime = performance.now() - startTime;
            console.log(`[SSR] ✅ Data loaded in ${loadTime.toFixed(2)}ms`);
          } catch (error) {
            console.error(
              `[SSR] ❌ Data loading failed for ${pathname}:`,
              error
            );
            // Continue without data - client can handle fallback
          }
        }
      } catch (importError) {
        // Silencieux - c'est normal si la page n'a pas de loadData
        console.log(`[SSR] 📄 No loadData function for ${pathname}`);
      }

      // Préparer les props pour le composant
      const props = {
        params,
        pathname,
        ...(pageData || {}),
      };

      // 🎨 CORRECTION: Séparation serveur/client pour éviter la duplication
      const pageElement = createElement(PageComponent, props);

      // Rendu optimisé avec mesure de performance
      const renderStart = performance.now();

      if (layoutComponents.length > 0) {
        // SERVEUR: Rendre les layouts complets avec la page à l'intérieur
        const fullLayoutElement = layoutComponents.reduceRight(
          (children, Layout) => createElement(Layout, {}, children),
          pageElement
        );

        const fullHtml = renderToString(fullLayoutElement);
        const renderTime = performance.now() - renderStart;

        console.log(
          `[SSR] 🚀 Rendered ${pathname} with ${
            layoutComponents.length
          } layouts in ${renderTime.toFixed(2)}ms (${fullHtml.length} chars)`
        );

        // Injecter les données NOHR dans le script existant
        const htmlWithData = fullHtml.replace(
          '{"framework":"NOHR","version":"1.0.0"}',
          JSON.stringify({
            framework: "NOHR",
            version: "1.0.0",
            route: pathname,
            data: pageData,
            timestamp: Date.now(),
          })
        );

        return c.html(htmlWithData, 200, {
          "Cache-Control": "no-cache",
          "Content-Type": "text/html; charset=utf-8",
        });
      } else {
        // Fallback: utiliser notre template HTML si pas de layout racine
        const pageContent = renderToString(pageElement);
        const renderTime = performance.now() - renderStart;

        const html = createHtmlTemplate(
          pageContent,
          getPageTitle(pathname, params),
          getPageDescription(pathname, params),
          { route: pathname, data: pageData, timestamp: Date.now() }
        );

        console.log(
          `[SSR] 🚀 Rendered ${pathname} without layouts in ${renderTime.toFixed(
            2
          )}ms (${html.length} chars)`
        );

        return c.html(html, 200, {
          "Cache-Control": "no-cache", // Pour le développement
          "Content-Type": "text/html; charset=utf-8",
        });
      }
    } catch (error) {
      console.error(`[SSR] ❌ Route handling error for ${pathname}:`, error);
      return c.html(
        `
        <html>
          <head><title>Erreur 500</title></head>
          <body>
            <h1>Erreur de serveur</h1>
            <p>Une erreur est survenue lors du traitement de la route.</p>
            <pre>${error instanceof Error ? error.message : String(error)}</pre>
          </body>
        </html>
      `,
        500
      );
    }
  });
}

// � AMÉLIORATION: Configuration automatique des routes API
function setupApiRoutes() {
  console.log("🔧 Setting up API routes...");

  // Debug: Afficher les routes API générées
  debugApiRoutes();

  // Enregistrer automatiquement toutes les routes API
  for (const route of apiRoutes) {
    for (const method of route.methods) {
      const handler = route.module[method];

      if (typeof handler === "function") {
        console.log(`   -> Registering [${method}] ${route.path}`);

        // Utiliser la méthode .on() de Hono pour enregistrer dynamiquement
        app.on(method, route.path, handler);
      } else {
        console.warn(
          `   ⚠️  Handler for [${method}] ${route.path} is not a function`
        );
      }
    }
  }

  // 🎯 Routes API Hello (legacy - Hono app)
  app.route("/api/hello", helloRouteApp);

  // 🎯 Routes API Users (legacy - exports nommés)
  if (usersRoute.GET) app.get("/api/users-legacy", usersRoute.GET);
  if (usersRoute.POST) app.post("/api/users-legacy", usersRoute.POST);
  if (usersRoute.PUT) app.put("/api/users-legacy", usersRoute.PUT);
  if (usersRoute.DELETE) app.delete("/api/users-legacy", usersRoute.DELETE);

  // 🎯 Routes API Users par ID (legacy - exports nommés)
  if (userByIdRoute.GET) app.get("/api/users-legacy/:id", userByIdRoute.GET);
  if (userByIdRoute.PUT) app.put("/api/users-legacy/:id", userByIdRoute.PUT);
  if (userByIdRoute.DELETE)
    app.delete("/api/users-legacy/:id", userByIdRoute.DELETE);
  if (userByIdRoute.PATCH)
    app.patch("/api/users-legacy/:id", userByIdRoute.PATCH);

  // Route API de test
  app.get("/api/test", (c) => {
    return c.json({
      message: "API NOHR fonctionne !",
      timestamp: new Date().toISOString(),
      framework: "Node.js + Hono + React",
      autoRoutes: apiRoutes.length,
      legacyRoutes: 3,
    });
  });

  console.log(
    `✅ ${apiRoutes.length} auto-generated API routes + 3 legacy routes configured`
  );
}

// 🚀 Initialisation du serveur NOHR
const port = 3000;
console.log(`🚀 Serveur NOHR démarré sur http://localhost:${port}`);
console.log(`📁 Architecture unifiée : Node.js + Hono + React SSR`);

// 🚀 AMÉLIORATION: Configurer les fichiers statiques AVANT les routes
console.log("🔧 Setting up static file serving...");

// Servir client.js directement (le plus important)
app.use("/client.js", serveStatic({ path: "./dist/public/client.js" }));

// Servir tous les fichiers depuis /public/*
app.use("/public/*", serveStatic({ root: "./dist" }));

// Servir le favicon
app.use("/favicon.ico", serveStatic({ path: "./dist/public/favicon.ico" }));

console.log("✅ Static files configured");

// Configurer les routes APRÈS les fichiers statiques
setupRoutes();

console.log(`✅ Serveur prêt et en écoute sur le port ${port}`);

// Démarrage du serveur Node.js
const server = serve({
  fetch: app.fetch,
  port,
});

console.log(`🚀 NOHR Server running on http://localhost:${port}`);

// Gestion gracieuse de l'arrêt
process.on("SIGTERM", () => {
  console.log("🔄 Graceful shutdown...");
  server.close(() => {
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("🔄 Graceful shutdown...");
  server.close(() => {
    process.exit(0);
  });
});

// Exports pour le file router
export { htmlTemplate };

// Export default
export default app;
