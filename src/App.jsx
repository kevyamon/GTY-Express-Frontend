import { Container } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatTrigger from './components/ChatTrigger'; // NOUVEL IMPORT
import { useSelector } from 'react-redux'; // NOUVEL IMPORT
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
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
      <Header />
      <main className="py-3">
        <TransitionGroup component={null}>
          <CSSTransition key={location.key} timeout={300} classNames="fade">
            <Container fluid>
              <Outlet />
            </Container>
          </CSSTransition>
        </TransitionGroup>
      </main>
      <Footer />
      {/* On affiche le bouton de chat si l'utilisateur est connecté et n'est pas admin */}
      {userInfo && !userInfo.isAdmin && <ChatTrigger />}
      <ToastContainer />
    </div>
  );
};

export default App;