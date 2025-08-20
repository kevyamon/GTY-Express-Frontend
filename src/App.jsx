import { useState, useEffect, useContext } from 'react';
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
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import GlobalLoader from './components/GlobalLoader';
import { clearWelcome } from './slices/authSlice';
import SuggestionModal from './components/SuggestionModal';
import GlobalMessageDisplay from './components/GlobalMessageDisplay';
import { VersionContext } from './contexts/VersionContext';
import UpdateModal from './components/UpdateModal'; 
import UpdateCompleteModal from './components/UpdateCompleteModal';
import SplashScreen from './components/SplashScreen';
import PushNotificationManager from './components/PushNotificationManager'; // --- NOUVEL IMPORT ---
import './App.css';
import bgImage from '../background.jpg';

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo, showWelcome } = useSelector((state) => state.auth);

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  const {
    isModalOpen,
    isUpdateInProgress,
    newVersionInfo,
    showUpdateCompleteModal,
    setShowUpdateCompleteModal,
    confirmUpdate,
    declineUpdate,
  } = useContext(VersionContext);
  
  const isLandingPage = location.pathname === '/';
  const isBannedPage = location.pathname === '/banned';
  
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);

  const handleShowInstallModal = () => setShowInstallModal(true);
  const handleCloseInstallModal = () => setShowInstallModal(false);
  
  const handleWelcomeEnd = () => {
    dispatch(clearWelcome());
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
      <SplashScreen show={showSplash} />
      
      {/* --- LIGNE AJOUTÉE --- */}
      {userInfo && <PushNotificationManager />}
      
      <GlobalLoader />
      
      {showWelcome && <WelcomeTransition onTransitionEnd={handleWelcomeEnd} />}
      
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
      
      <InstallPwaModal 
        show={showInstallModal}
        handleClose={handleCloseInstallModal}
      />

      <SuggestionModal 
        show={showSuggestionModal}
        handleClose={() => setShowSuggestionModal(false)}
      />

      <UpdateModal
        show={isModalOpen}
        handleClose={declineUpdate}
        onConfirmUpdate={confirmUpdate}
        isUpdating={isUpdateInProgress}
        newVersionInfo={newVersionInfo}
      />

      <UpdateCompleteModal
        show={showUpdateCompleteModal}
        handleClose={() => setShowUpdateCompleteModal(false)}
      />
    </div>
  );
};

export default App;