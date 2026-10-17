import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Loadingpage from "./Loaderpage";

// Shows the branded loader for a moment each time the page changes.
function RouteLoader({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // loader duration

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return loading ? <Loadingpage message="Opening page…" /> : children;
}

export default RouteLoader;
