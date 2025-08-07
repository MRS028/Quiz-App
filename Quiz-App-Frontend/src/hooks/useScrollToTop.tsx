// src/hooks/useScrollToTop.tsx

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Custom hook to scroll the window to top on route change.
 */
const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // use "auto" if you don't want smooth scrolling
    });
  }, [pathname]);
};

export default useScrollToTop;
