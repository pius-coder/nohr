// 🚀 NOHR Router Component - Client-Side Routing Engine
// Handles route matching, component rendering, and navigation

import React, { useState, useEffect, Suspense } from "react";
import { routes, matchRoute, type RouteConfig } from "../generated/routes";

interface RouterState {
  currentRoute: RouteConfig | null;
  params: Record<string, string>;
  pathname: string;
  isLoading: boolean;
  error: string | null;
}

export function Router() {
  const [state, setState] = useState<RouterState>(() => {
    // 🔧 CORRECTION: Initialisation simple pour éviter les erreurs d'hydratation
    return {
      currentRoute: null,
      params: {},
      pathname: typeof window !== "undefined" ? window.location.pathname : "/",
      isLoading: true,
      error: null,
    };
  });

  // Handle navigation events
  useEffect(() => {
    const handleNavigation = async (event?: CustomEvent | PopStateEvent) => {
      const pathname = window.location.pathname;

      console.log(`[NOHR Router] Navigating to: ${pathname}`);

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const match = matchRoute(pathname);

        if (!match) {
          setState((prev) => ({
            ...prev,
            currentRoute: null,
            params: {},
            pathname,
            isLoading: false,
            error: `Route not found: ${pathname}`,
          }));
          return;
        }

        // TODO: Handle data loading for the new route
        // This is where we would call loadData if the component has it

        setState({
          currentRoute: match.route,
          params: match.params,
          pathname,
          isLoading: false,
          error: null,
        });

        console.log(`[NOHR Router] ✅ Route loaded: ${pathname}`, match.params);
      } catch (error) {
        console.error("[NOHR Router] Navigation error:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Navigation failed",
        }));
      }
    };

    // Listen for navigation events
    window.addEventListener("nohr-navigate", handleNavigation as EventListener);
    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener(
        "nohr-navigate",
        handleNavigation as EventListener
      );
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);

  // Render loading state
  if (state.isLoading) {
    return (
      <div className="nohr-loading">
        <h2>🔄 Loading...</h2>
        <p>Navigating to {state.pathname}</p>
      </div>
    );
  }

  // Render error state
  if (state.error) {
    return (
      <div className="nohr-error">
        <h1>❌ Navigation Error</h1>
        <p>{state.error}</p>
        <button onClick={() => (window.location.href = "/")}>🏠 Go Home</button>
        <style jsx>{`
          .nohr-error {
            padding: 2rem;
            text-align: center;
            background: #fee;
            border: 1px solid #fcc;
            border-radius: 8px;
            margin: 2rem;
          }
        `}</style>
      </div>
    );
  }

  // Render 404 if no route found
  if (!state.currentRoute) {
    return (
      <div className="nohr-404">
        <h1>404 - Page Not Found</h1>
        <p>The page "{state.pathname}" does not exist.</p>
        <a href="/">← Go Home</a>
        <style jsx>{`
          .nohr-404 {
            padding: 2rem;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  // Render the matched route component
  const { component: Component } = state.currentRoute;

  return (
    <Suspense
      fallback={
        <div className="nohr-suspense">
          <h2>⏳ Loading Component...</h2>
          <p>Please wait while we load the page.</p>
        </div>
      }
    >
      <Component params={state.params} pathname={state.pathname} />
    </Suspense>
  );
}

// Context for sharing router state (future enhancement)
export const RouterContext = React.createContext<{
  pathname: string;
  params: Record<string, string>;
  navigate: (to: string, replace?: boolean) => void;
} | null>(null);

// Hook to access router context
export function useRouter() {
  const context = React.useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a Router");
  }
  return context;
}

// Debug component to show current route info
export function RouterDebug() {
  const [pathname, setPathname] = useState(window.location.pathname);

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
