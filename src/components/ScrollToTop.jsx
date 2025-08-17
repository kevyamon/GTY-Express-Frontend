import { useLayoutEffect } from 'react'; // --- MODIFICATION : On importe useLayoutEffect
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // --- MODIFICATION : On utilise useLayoutEffect pour une exécution prioritaire ---
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;