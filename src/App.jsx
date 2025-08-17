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
// CORRECTION : On n'importe plus l'image ici

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

  const [showLogo, setShowLogo] = useState(true);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      const timer = setTimeout(() => {
        setShowLogo(false);
        isInitialLoad.current = false;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleWelcomeEnd = () => {
    dispatch(clearWelcome());
    setShowLogo(false);
  };

  const handleLogoEnd = () => {
    setShowLogo(false);
  };

  // CORRECTION : On utilise des classes CSS plutôt que des styles en ligne pour le fond
  const appClasses = ['app-container']; // Classe de base
  if (!isLandingPage) {
    appClasses.push('app-background'); // On ajoute la classe pour l'image de fond
  }

  return (
    // CORRECTION : On utilise className au lieu de style pour le fond
    <div className={appClasses.join(' ')} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <GlobalLoader />
      
      {showWelcome && <WelcomeTransition onTransitionEnd={handleWelcomeEnd} />}
      
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