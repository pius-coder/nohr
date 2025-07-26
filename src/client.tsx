import { hydrateRoot, createRoot } from "react-dom/client";
import { createElement } from "react";

// Import direct des pages pour éviter les problèmes d'hydratation
import HomePage from "../app/(pages)/page";
import AboutPage from "../app/(pages)/about/page";
import UsersPage from "../app/(pages)/users/page";
import UserPage from "../app/(pages)/users/[id]/page";

// 📊 Interface pour les métriques de performance
interface NOHRPerformance {
  navigationStart: number;
  buildId: string;
  route: string;
  framework: string;
  ssrRender?: number;
  hydrationStart?: number;
  hydrationEnd?: number;
  firstInteraction?: number;
}

declare global {
  interface Window {
    __NOHR_PERFORMANCE__: NOHRPerformance;
    gtag?: (...args: any[]) => void;
  }
}

// 🎯 Router côté client avec métriques
const getPageComponent = () => {
  const path = window.location.pathname;

  // Marquer la résolution de route
  performance.mark("nohr-route-resolve-start");

  let component;
  let props = {};

  // Router avec support des routes dynamiques
  if (path === "/") {
    component = HomePage;
  } else if (path === "/about") {
    component = AboutPage;
  } else if (path === "/users") {
    component = UsersPage;
  } else if (path.startsWith("/users/")) {
    // Route dynamique /users/:id
    const id = path.split("/users/")[1];
    if (id) {
      component = UserPage;
      props = { params: { id } };
    } else {
      console.warn(
        `Route utilisateur invalide: ${path}, fallback vers UsersPage`
      );
      component = UsersPage;
    }
  } else {
    console.warn(`Route non trouvée: ${path}, fallback vers HomePage`);
    component = HomePage;
  }

  performance.mark("nohr-route-resolve-end");
  performance.measure(
    "NOHR-Route-Resolve",
    "nohr-route-resolve-start",
    "nohr-route-resolve-end"
  );

  return { component, props };
};

// 📊 Fonction pour reporter les métriques de performance
const reportNOHRMetric = (name: string, value: number) => {
  // Console pour développement
  console.log(`📊 ${name}: ${value.toFixed(2)}ms`);

  // Google Analytics (si disponible)
  if (window.gtag) {
    window.gtag("event", "timing_complete", {
      name: name,
      value: Math.round(value),
    });
  }

  // Performance Observer API
  if ("PerformanceObserver" in window) {
    try {
      performance.mark(`nohr-${name.toLowerCase()}`);
    } catch (e) {
      // Ignore les erreurs de performance
    }
  }
};

// 🎯 Fonction principale d'hydratation
const hydrateApp = async () => {
  performance.mark("nohr-hydration-start");

  // Initialiser les métriques de performance
  if (!window.__NOHR_PERFORMANCE__) {
    window.__NOHR_PERFORMANCE__ = {
      navigationStart: performance.timeOrigin,
      buildId: "nohr-dev",
      route: window.location.pathname,
      framework: "NOHR",
    };
  }

  window.__NOHR_PERFORMANCE__.hydrationStart = performance.now();

  try {
    const { component: PageComponent, props } = getPageComponent();
    const rootElement = document.getElementById("root");

    if (!rootElement) {
      throw new Error("Element root non trouvé pour l'hydratation");
    }

    // Vérifier les attributs de données pour l'hydratation
    const isServerRendered = rootElement.dataset.serverRendered === "true";

    if (!rootElement.innerHTML.trim() || !isServerRendered) {
      console.warn("🔄 Rendu côté client au lieu d'hydratation");
      performance.mark("nohr-client-render-start");

      const root = createRoot(rootElement);
      root.render(createElement(PageComponent as any, props || {}));

      performance.mark("nohr-client-render-end");
      performance.measure(
        "NOHR-Client-Render",
        "nohr-client-render-start",
        "nohr-client-render-end"
      );

      const clientRenderMeasure =
        performance.getEntriesByName("NOHR-Client-Render")[0];
      if (clientRenderMeasure) {
        reportNOHRMetric("NOHR-Client-Render", clientRenderMeasure.duration);
      }
    } else {
      console.log("🎉 Hydratation SSR → Client");

      // Hydratation avec gestion d'erreurs
      hydrateRoot(
        rootElement,
        createElement(PageComponent as any, props || {}),
        {
          onRecoverableError: (error) => {
            console.warn("⚠️ Erreur récupérable lors de l'hydratation:", error);
          },
        }
      );
    }

    performance.mark("nohr-hydration-end");
    performance.measure(
      "NOHR-Hydration",
      "nohr-hydration-start",
      "nohr-hydration-end"
    );

    const hydrationMeasure = performance.getEntriesByName("NOHR-Hydration")[0];
    if (hydrationMeasure) {
      window.__NOHR_PERFORMANCE__.hydrationEnd = performance.now();
      reportNOHRMetric("NOHR-Hydration", hydrationMeasure.duration);
    }

    // Marquer la première interaction
    const markFirstInteraction = () => {
      if (!window.__NOHR_PERFORMANCE__.firstInteraction) {
        window.__NOHR_PERFORMANCE__.firstInteraction = performance.now();
        reportNOHRMetric(
          "NOHR-First-Interaction",
          window.__NOHR_PERFORMANCE__.firstInteraction
        );
      }
    };

    // Écouter les événements d'interaction
    ["click", "keydown", "touchstart"].forEach((event) => {
      document.addEventListener(event, markFirstInteraction, { once: true });
    });

    console.log("✅ Hydratation NOHR terminée avec succès");
  } catch (error) {
    console.error("❌ Erreur lors de l'hydratation:", error);

    // Fallback : essayer un rendu client simple
    try {
      const { component: PageComponent, props } = getPageComponent();
      const rootElement = document.getElementById("root");
      if (rootElement) {
        const root = createRoot(rootElement);
        root.render(createElement(PageComponent as any, props || {}));
        console.log("🔄 Fallback vers rendu client réussi");
      }
    } catch (fallbackError) {
      console.error("💥 Échec du fallback:", fallbackError);
    }
  }
};

// 🚀 Point d'entrée principal
if (typeof window !== "undefined") {
  // Attendre que le DOM soit prêt
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hydrateApp);
  } else {
    // DOM déjà prêt
    hydrateApp();
  }

  // Gestion des erreurs globales
  window.addEventListener("error", (event) => {
    console.error("🚨 Erreur globale capturée:", event.error);
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("🚨 Promise rejetée non gérée:", event.reason);
  });

  // Afficher les métriques finales au déchargement de la page
  window.addEventListener("beforeunload", () => {
    const perf = window.__NOHR_PERFORMANCE__;
    if (perf) {
      console.log("📊 Métriques finales NOHR:", perf);
    }
  });

  // Hot Module Replacement pour le développement (si disponible)
  if (typeof (import.meta as any).hot !== "undefined") {
    (import.meta as any).hot.accept(() => {
      console.log("🔄 Hot reload détecté, rechargement...");
      window.location.reload();
    });
  }
}

export default hydrateApp;
