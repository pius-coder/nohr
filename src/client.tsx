// 🚀 NOHR Client - Simple Router-Based Hydration
import { hydrateRoot } from "react-dom/client";
import React from "react";
import { matchRoute } from "./generated/routes";
import { RouterDebug } from "./components/SimpleRouter";

// 🎯 Simple hydration with Router component
const hydrateApp = () => {
  performance.mark("nohr-hydration-start");

  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      throw new Error("Root element not found");
    }

    console.log("[NOHR] 🔄 Starting hydration with Router...");

    // 🎨 CORRECTION: Hydrater seulement le contenu de la page (sans les layouts)
    // Les layouts sont déjà rendus côté serveur dans le HTML complet

    // Récupérer les données initiales du serveur
    const dataScript = document.getElementById("__NOHR_DATA__");
    const initialData = dataScript
      ? JSON.parse(dataScript.textContent || "{}")
      : {};

    // Trouver la route actuelle immédiatement (pas de state)
    const pathname = window.location.pathname;
    const match = matchRoute(pathname);

    if (!match) {
      console.error("[NOHR] ❌ No route found for", pathname);
      hydrateRoot(rootElement, <div>Route not found: {pathname}</div>);
      return;
    }

    // Créer l'élément de page avec les données du serveur
    const PageComponent = match.route.component;
    const pageElement = React.createElement(PageComponent, {
      params: match.params,
      pathname: pathname,
      ...(initialData.data || {}),
    });

    // IMPORTANT: Hydrater seulement la page, pas les layouts
    hydrateRoot(rootElement, pageElement);

    performance.mark("nohr-hydration-end");

    // 🔧 CORRECTION: performance.measure() retourne un objet, pas un nombre
    const measure = performance.measure(
      "NOHR Hydration",
      "nohr-hydration-start",
      "nohr-hydration-end"
    );
    const hydrationTime = measure.duration;

    // Mark as hydrated
    rootElement.classList.remove("hydrating");
    rootElement.classList.add("hydrated");

    console.log(
      `[NOHR] ✅ Hydration completed in ${hydrationTime.toFixed(2)}ms`
    );

    // Add debug component in development
    if (process.env.NODE_ENV === "development") {
      const debugContainer = document.createElement("div");
      document.body.appendChild(debugContainer);
      hydrateRoot(debugContainer, <RouterDebug />);
    }
  } catch (error) {
    console.error("[NOHR] ❌ Hydration failed:", error);

    // Fallback: Show error message
    const rootElement = document.getElementById("root");
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 2rem; text-align: center; background: #fee; border: 1px solid #fcc; border-radius: 8px; margin: 2rem;">
          <h1>❌ Hydration Error</h1>
          <p>Failed to initialize the NOHR application.</p>
          <button onclick="window.location.reload()">🔄 Reload Page</button>
        </div>
      `;
    }
  }
};

// 🚀 Initialize the application
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", hydrateApp);
} else {
  hydrateApp();
}

export { hydrateApp };
