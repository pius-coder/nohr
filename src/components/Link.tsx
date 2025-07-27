// 🚀 NOHR Link Component - Client-Side Navigation
// Prevents full page reloads and enables SPA-like navigation

import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
  replace?: boolean; // Use replaceState instead of pushState
  prefetch?: boolean; // Future: prefetch the route
}

export function Link({ 
  to, 
  children, 
  replace = false, 
  prefetch = false,
  onClick,
  ...props 
}: LinkProps) {
  
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Call custom onClick if provided
    if (onClick) {
      onClick(e);
    }

    // Don't prevent default if event was already prevented
    if (e.defaultPrevented) {
      return;
    }

    // Don't handle if it's a modified click (ctrl, shift, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }

    // Don't handle if it's a right click
    if (e.button !== 0) {
      return;
    }

    // Don't handle external links
    if (isExternalLink(to)) {
      return;
    }

    // Don't handle if target is specified
    if (props.target && props.target !== '_self') {
      return;
    }

    // Prevent the default browser navigation
    e.preventDefault();

    // Don't navigate if we're already on this page
    if (to === window.location.pathname) {
      return;
    }

    // Perform client-side navigation
    navigateToRoute(to, replace);
  };

  // Add prefetch logic in the future
  const handleMouseEnter = prefetch ? () => {
    // TODO: Implement route prefetching
    console.log(`[NOHR] Prefetching route: ${to}`);
  } : undefined;

  return (
    <a 
      href={to} 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </a>
  );
}

// Check if a URL is external
function isExternalLink(url: string): boolean {
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.origin !== window.location.origin;
  } catch {
    // If URL parsing fails, assume it's internal
    return false;
  }
}

// Perform client-side navigation
function navigateToRoute(to: string, replace: boolean = false) {
  console.log(`[NOHR] Navigating to: ${to}`);
  
  // Update the browser URL
  if (replace) {
    window.history.replaceState({}, '', to);
  } else {
    window.history.pushState({}, '', to);
  }
  
  // Dispatch a custom event to notify the router
  window.dispatchEvent(new CustomEvent('nohr-navigate', {
    detail: { 
      pathname: to,
      replace 
    }
  }));
}

// Utility function for programmatic navigation
export function navigate(to: string, replace: boolean = false) {
  navigateToRoute(to, replace);
}

// Hook for getting current pathname (future enhancement)
export function usePathname(): string {
  const [pathname, setPathname] = React.useState(window.location.pathname);
  
  React.useEffect(() => {
    const handleNavigation = () => {
      setPathname(window.location.pathname);
    };
    
    // Listen for both browser navigation and our custom navigation
    window.addEventListener('popstate', handleNavigation);
    window.addEventListener('nohr-navigate', handleNavigation);
    
    return () => {
      window.removeEventListener('popstate', handleNavigation);
      window.removeEventListener('nohr-navigate', handleNavigation);
    };
  }, []);
  
  return pathname;
}

// Hook for getting route parameters (future enhancement)
export function useParams(): Record<string, string> {
  // This would need to be implemented with context from the Router
  return {};
}
