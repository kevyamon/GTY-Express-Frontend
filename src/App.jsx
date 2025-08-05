import { Container } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatTrigger from './components/ChatTrigger';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ScrollToTop from './components/ScrollToTop';
import './App.css';
import bgImage from '../background.jpg';

const App = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => state.auth);

  const appStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    minHeight: '100vh',
  };

  return (
    <div style={appStyle}>
      <ScrollToTop />
      <Header />
      <main className="py-3">
        <TransitionGroup component={null}>
          <CSSTransition key={location.key} timeout={300} classNames="fade">
            {/* ON RETIRE LE <Container fluid> QUI LIMITAIT LA LARGEUR */}
            <Outlet />
          </CSSTransition>
        </TransitionGroup>
      </main>
      <Footer />
      {userInfo && !userInfo.isAdmin && <ChatTrigger />}
      <ToastContainer />
    </div>
  );
};

export default App;