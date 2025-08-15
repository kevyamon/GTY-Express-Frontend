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
import ScrollToTop from './components/ScrollToTop';
import GlobalLoader from './components/GlobalLoader'; // --- NOUVEL IMPORT ---
import { clearWelcome } from './slices/authSlice';
import './App.css';
import bgImage from '../background.jpg';

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { userInfo, showWelcome } = useSelector((state) => state.auth);

  const appStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };

  const handleTransitionEnd = () => {
    dispatch(clearWelcome());
  };

  return (
    <div style={appStyle}>
      <GlobalLoader /> {/* --- COMPOSANT AJOUTÉ ICI --- */}
      
      {showWelcome && <WelcomeTransition onTransitionEnd={handleTransitionEnd} />}
      
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