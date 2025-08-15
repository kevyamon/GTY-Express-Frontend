import { useState, useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Header from './components/Header';
import Footer from './components/Footer';
import ChatTrigger from './components/ChatTrigger';
import WarningDisplay from './components/WarningDisplay';
import WelcomeTransition from './components/WelcomeTransition';
import LogoTransition from './components/LogoTransition';
import ScrollToTop from './components/ScrollToTop';
import GlobalLoader from './components/GlobalLoader';
import { clearWelcome } from './slices/authSlice';
import './App.css';
import bgImage from '../background.jpg';

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo, showWelcome } = useSelector((state) => state.auth);

  // --- LOGIQUE DE TRANSITION CORRIGÉE ---
  const [showLogo, setShowLogo] = useState(true);
  // On utilise une "clé" pour forcer le composant à se réinitialiser à chaque fois
  const [logoKey, setLogoKey] = useState(Date.now());
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Ne pas jouer l'animation courte lors du tout premier chargement
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    
    // À chaque changement de page :
    // 1. On change la clé pour forcer le redémarrage de l'animation
    setLogoKey(Date.now());
    // 2. On affiche la transition
    setShowLogo(true);

    // 3. On définit une durée plus courte (1.5 secondes) pour la cacher
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 1500); // Durée plus courte pour la navigation

    return () => clearTimeout(timer);
  }, [location.pathname]); // Se déclenche à chaque changement d'URL
  
  const handleWelcomeEnd = () => {
    dispatch(clearWelcome());
    // Après la bienvenue, on force aussi le redémarrage de l'animation du logo
    setLogoKey(Date.now());
    setShowLogo(true);
  };

  const handleLogoEnd = () => {
    // Cette fonction est appelée par le composant lui-même à la fin de son animation CSS.
    // C'est parfait pour les animations longues (chargement initial, après bienvenue).
    setShowLogo(false);
  };
  // --- FIN DE LA CORRECTION ---

  const appStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };

  return (
    <div style={appStyle}>
      <GlobalLoader />
      
      {showWelcome && <WelcomeTransition onTransitionEnd={handleWelcomeEnd} />}
      
      {/* La clé "key" est l'élément crucial qui force l'animation à se rejouer */}
      <LogoTransition 
        key={logoKey} 
        show={showLogo} 
        onTransitionEnd={handleLogoEnd} 
      />
      
      <ScrollToTop />
      <Header />
      <main className="py-3">
        <TransitionGroup component={null}>
          <CSSTransition key={location.key} timeout={300} classNames="fade">
            <Outlet />
          </CSSTransition>
        </TransitionGroup>
      </main>
      <Footer />
      {userInfo && !userInfo.isAdmin && <ChatTrigger />}
      {userInfo && <WarningDisplay />}
      <ToastContainer />
    </div>
  );
};

export default App;