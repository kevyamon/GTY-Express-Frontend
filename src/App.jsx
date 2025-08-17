import { useState, useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import InstallPwaModal from './components/InstallPwaModal';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatTrigger from './components/ChatTrigger';
import WarningDisplay from './components/WarningDisplay';
import WelcomeTransition from './components/WelcomeTransition';
import LogoTransition from './components/LogoTransition';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import GlobalLoader from './components/GlobalLoader';
import { clearWelcome } from './slices/authSlice';
import SuggestionModal from './components/SuggestionModal';
import GlobalMessageDisplay from './components/GlobalMessageDisplay';
import UpdateCompleteModal from './components/UpdateCompleteModal';
import './App.css';
import bgImage from './assets/background.jpg'; // On importe la bonne image de fond

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo, showWelcome } = useSelector((state) => state.auth);
  
  const isLandingPage = location.pathname === '/';
  const isBannedPage = location.pathname === '/banned';
  
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  
  const [showUpdateComplete, setShowUpdateComplete] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('updateCompleted')) {
      setShowUpdateComplete(true);
      sessionStorage.removeItem('updateCompleted');
    }
  }, []);

  const handleShowInstallModal = () => setShowInstallModal(true);
  const handleCloseInstallModal = () => setShowInstallModal(false);
  const handleShowSuggestionModal = () => setShowSuggestionModal(true);

  // CORRECTION : Simplification de la logique de l'animation du logo
  const [showLogo, setShowLogo] = useState(true);
  const isInitialLoad = useRef(true); // Pour savoir si c'est le 1er chargement

  useEffect(() => {
    // Ce code ne s'exécute qu'une seule fois au montage de l'application
    if (isInitialLoad.current) {
      const timer = setTimeout(() => {
        setShowLogo(false);
        isInitialLoad.current = false;
      }, 1500); // L'animation dure 1.5s
      return () => clearTimeout(timer);
    }
  }, []); // Le tableau de dépendances est vide pour ne s'exécuter qu'une fois
  
  const handleWelcomeEnd = () => {
    dispatch(clearWelcome());
    // On ne relance plus l'animation du logo après le message de bienvenue
    setShowLogo(false);
  };

  const handleLogoEnd = () => {
    setShowLogo(false);
  };

  const baseAppStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  const appStyle = !isLandingPage ? {
    ...baseAppStyle,
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
  } : baseAppStyle;

  return (
    <div style={appStyle}>
      <GlobalLoader />
      
      {showWelcome && <WelcomeTransition onTransitionEnd={handleWelcomeEnd} />}
      
      {/* On affiche l'animation du logo seulement si `showLogo` est vrai */}
      <LogoTransition 
        show={showLogo} 
        onTransitionEnd={handleLogoEnd} 
      />
      
      <ScrollToTop />

      {!isBannedPage && <Header handleShowInstallModal={handleShowInstallModal} handleShowSuggestionModal={handleShowSuggestionModal} />}
      
      <main className={!isLandingPage ? "py-3" : ""}>
        <Container fluid>
          <TransitionGroup component={null}>
            <CSSTransition key={location.key} timeout={300} classNames="fade">
                <Outlet />
            </CSSTransition>
          </TransitionGroup>
        </Container>
      </main>
      
      {!isLandingPage && !isBannedPage && <Footer />}

      {!isLandingPage && !isBannedPage && (
        <>
          {userInfo && !userInfo.isAdmin && <ChatTrigger />}
          <ScrollToTopButton />
        </>
      )}
      
      {userInfo && <GlobalMessageDisplay />}
      {userInfo && <WarningDisplay />}
      <ToastContainer />

      <UpdateCompleteModal 
        show={showUpdateComplete}
        handleClose={() => setShowUpdateComplete(false)}
      />

      <InstallPwaModal 
        show={showInstallModal}
        handleClose={handleCloseInstallModal}
      />

      <SuggestionModal 
        show={showSuggestionModal}
        handleClose={() => setShowSuggestionModal(false)}
      />
    </div>
  );
};

export default App;