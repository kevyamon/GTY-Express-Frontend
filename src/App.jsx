import { useState, useEffect, useRef } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { useVersionCheck } from './hooks/useVersionCheck';
import UpdateModal from './components/UpdateModal';
import InstallPwaModal from './components/InstallPwaModal'; // <-- 1. ON IMPORTE LE NOUVEAU MODAL

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
  
  const isLandingPage = location.pathname === '/';
  
  const { isUpdateAvailable, newVersion, deployedAt } = useVersionCheck();
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // --- 2. ON AJOUTE LA LOGIQUE POUR LE MODAL D'INSTALLATION ---
  const [showInstallModal, setShowInstallModal] = useState(false);
  const handleShowInstallModal = () => setShowInstallModal(true);
  const handleCloseInstallModal = () => setShowInstallModal(false);
  // --- FIN DE L'AJOUT ---

  useEffect(() => {
    if (isUpdateAvailable) {
      setShowUpdateModal(true);
    }
  }, [isUpdateAvailable]);

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };

  const [showLogo, setShowLogo] = useState(true);
  const [logoKey, setLogoKey] = useState(Date.now());
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    setLogoKey(Date.now());
    setShowLogo(true);
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [location.pathname]);
  
  const handleWelcomeEnd = () => {
    dispatch(clearWelcome());
    setLogoKey(Date.now());
    setShowLogo(true);
  };

  const handleLogoEnd = () => {
    setShowLogo(false);
  };

  const appStyle = !isLandingPage ? {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    minHeight: '100vh',
  } : { minHeight: '100vh' };

  return (
    <div style={appStyle}>
      <GlobalLoader />
      
      {showWelcome && <WelcomeTransition onTransitionEnd={handleWelcomeEnd} />}
      
      <LogoTransition 
        key={logoKey} 
        show={showLogo} 
        onTransitionEnd={handleLogoEnd} 
      />
      
      <ScrollToTop />

      {/* 3. ON PASSE LA FONCTION D'OUVERTURE AU HEADER */}
      {!isLandingPage && <Header handleShowInstallModal={handleShowInstallModal} />}
      
      <main className={!isLandingPage ? "py-3" : ""}>
        <Container className={!isLandingPage ? "" : "p-0"} fluid={isLandingPage}>
          <TransitionGroup component={null}>
            <CSSTransition key={location.key} timeout={300} classNames="fade">
                <Outlet />
            </CSSTransition>
          </TransitionGroup>
        </Container>
      </main>
      
      {!isLandingPage && <Footer />}

      {userInfo && !userInfo.isAdmin && <ChatTrigger />}
      {userInfo && <WarningDisplay />}
      <ToastContainer />

      <UpdateModal 
        show={showUpdateModal} 
        handleClose={handleCloseUpdateModal} 
        newVersion={newVersion} 
        deployedAt={deployedAt}
      />

      {/* 4. ON AFFICHE NOTRE NOUVEAU MODAL */}
      <InstallPwaModal 
        show={showInstallModal}
        handleClose={handleCloseInstallModal}
      />
    </div>
  );
};

export default App;