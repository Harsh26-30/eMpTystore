import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Loadingpage from "./Loaderpage"; 

function RouteLoader({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // loader duration

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return loading ? <Loadingpage /> : children;
}

export default RouteLoader;