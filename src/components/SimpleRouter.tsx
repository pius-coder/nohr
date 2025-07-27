// 🚀 NOHR Simple Router - Évite les erreurs d'hydratation
import React, { useState, useEffect } from "react";
import { matchRoute, type RouteConfig } from "../generated/routes";

export function SimpleRouter() {
  const [currentRoute, setCurrentRoute] = useState<RouteConfig | null>(null);
  const [params, setParams] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Initialiser après l'hydratation
  useEffect(() => {
    const pathname = window.location.pathname;
    const match = matchRoute(pathname);

    if (match) {
      setCurrentRoute(match.route);
      setParams(match.params);
      console.log(`[NOHR Router] ✅ Route loaded: ${pathname}`, match.params);
    } else {
      console.error(`[NOHR Router] ❌ No route found for: ${pathname}`);
    }

    setIsLoading(false);
  }, []);

  // Gérer la navigation
  useEffect(() => {
    const handleNavigation = () => {
      const pathname = window.location.pathname;
      const match = matchRoute(pathname);

      if (match) {
        setCurrentRoute(match.route);
        setParams(match.params);
        console.log(`[NOHR Router] ✅ Navigated to: ${pathname}`, match.params);
      }
    };

    window.addEventListener("nohr-navigate", handleNavigation);
    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("nohr-navigate", handleNavigation);
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);

  if (isLoading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h2>🔄 Loading...</h2>
        <p>Initializing NOHR Router...</p>
      </div>
    );
  }

  if (!currentRoute) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>404 - Page Not Found</h1>
        <p>The page "{window.location.pathname}" does not exist.</p>
        <a href="/">← Go Home</a>
      </div>
    );
  }

  // 🎨 CORRECTION: Rendre seulement le composant de page (layouts déjà dans le DOM)
  const Component = currentRoute.component;

  // IMPORTANT: Ne pas rendre les layouts côté client !
  // Les layouts sont déjà dans le DOM, rendus par le serveur
  // On rend seulement la page qui sera injectée dans #root
  return <Component params={params} pathname={window.location.pathname} />;
}

// Debug component
export function RouterDebug() {
  const [pathname, setPathname] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  useEffect(() => {
    const handleNavigation = () => {
      setPathname(window.location.pathname);
    };

    window.addEventListener("nohr-navigate", handleNavigation);
    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("nohr-navigate", handleNavigation);
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);

  const match = matchRoute(pathname);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        background: "#333",
        color: "white",
        padding: "10px",
        borderRadius: "4px",
        fontSize: "12px",
        fontFamily: "monospace",
        zIndex: 9999,
      }}
    >
      <div>
        <strong>NOHR Router Debug</strong>
      </div>
      <div>Path: {pathname}</div>
      <div>Route: {match?.route.path || "No match"}</div>
      <div>Params: {JSON.stringify(match?.params || {})}</div>
    </div>
  );
}
