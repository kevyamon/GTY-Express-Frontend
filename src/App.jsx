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
import bgImage from '../background.jpg';

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

      {!isBannedPage && <Header handleShowInstallModal={handleShowInstallModal} />}
      
      <main className={!isLandingPage ? "py-3" : ""}>
        <Container className={!isLandingPage ? "" : "p-0"} fluid={isLandingPage}>
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
      
      {/* --- MODIFICATION ICI --- */}
      {userInfo && (
        <MobileMenuModal
          show={showMobileMenu}
          handleClose={() => setShowMobileMenu(false)}
          userInfo={userInfo}
          totalAdminCount={totalAdminCount}
          logoutHandler={logoutHandler}
          handleAdminModal={() => setShowAdminModal(true)}
          handleSuggestionModal={() => setShowSuggestionModal(true)}
        />
      )}
      {/* --- FIN DE LA MODIFICATION --- */}
      
      <SuggestionModal 
        show={showSuggestionModal}
        handleClose={() => setShowSuggestionModal(false)}
      />
    </div>
  );
};

export default App;