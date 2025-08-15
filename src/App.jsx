import { useState, useEffect, useRef } from 'react'; // useRef est ajouté
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
import LogoTransition from './components/LogoTransition'; // NOUVEL IMPORT
import ScrollToTop from './components/ScrollToTop';
import GlobalLoader from './components/GlobalLoader';
import { clearWelcome } from './slices/authSlice';
import './App.css';
import bgImage from '../background.jpg';

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo, showWelcome } = useSelector((state) => state.auth);

  // --- NOUVELLE LOGIQUE POUR LA TRANSITION DU LOGO ---
  const [showLogo, setShowLogo] = useState(true); // Affiche au premier chargement
  const isInitialLoad = useRef(true); // Pour différencier le premier chargement des navigations

  useEffect(() => {
    // Gère la transition courte entre les pages
    if (isInitialLoad.current) {
      isInitialLoad.current = false; // Le premier chargement est passé
      return;
    }
    
    // Affiche la transition courte (3s) à chaque changement de page
    setShowLogo(true);
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 3000); // Durée de 3 secondes

    return () => clearTimeout(timer);
  }, [location.pathname]); // Se déclenche à chaque changement d'URL
  
  const handleWelcomeEnd = () => {
    dispatch(clearWelcome());
    setShowLogo(true); // Déclenche l'animation du logo juste après celle de bienvenue
  };

  const handleLogoEnd = () => {
    setShowLogo(false); // Cache l'animation du logo quand elle est finie
  };
  // --- FIN DE LA NOUVELLE LOGIQUE ---

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
      
      {/* Les deux transitions sont maintenant présentes */}
      {showWelcome && <WelcomeTransition onTransitionEnd={handleWelcomeEnd} />}
      <LogoTransition show={showLogo} onTransitionEnd={handleLogoEnd} />
      
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