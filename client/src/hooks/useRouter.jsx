import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
} from "react";

/**
 * Simple client-side router for SPA navigation
 * Can be replaced with React Router for more complex needs
 */

const RouterContext = createContext(null);

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
}

export function RouterProvider({ children }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [searchParams, setSearchParams] = useState(
    new URLSearchParams(window.location.search),
  );
  const [routeKey, setRouteKey] = useState(0); // Force re-render on navigation

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSearchParams(new URLSearchParams(window.location.search));
      setRouteKey((k) => k + 1);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = useCallback((path, params = {}) => {
    // Handle paths with query strings already embedded
    let url;
    if (path.includes("?")) {
      url = new URL(path, window.location.origin);
      // Merge additional params
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, value);
        }
      });
    } else {
      url = new URL(path, window.location.origin);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.set(key, value);
        }
      });
    }

    window.history.pushState({}, "", url.toString());
    setCurrentPath(url.pathname);
    setSearchParams(url.searchParams);
    setRouteKey((k) => k + 1); // Force re-render

    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const getParam = useCallback(
    (key) => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  const getAllParams = useCallback(() => {
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  const value = {
    currentPath,
    searchParams,
    navigate,
    getParam,
    getAllParams,
    routeKey, // Expose for components that need to react to route changes
  };

  return (
    <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
  );
}

// Link component for navigation
export function Link({ href, children, className = "", onClick, ...props }) {
  const { navigate } = useRouter();

  const handleClick = (e) => {
    // Allow opening in new tab
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;

    e.preventDefault();
    if (onClick) onClick(e);
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...props}>
      {children}
    </a>
  );
}
