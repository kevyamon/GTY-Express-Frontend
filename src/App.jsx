import { Container } from 'react-bootstrap';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';
import bgImage from '../background.jpg';

const App = () => {
  const location = useLocation();

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

      {/* BOUTON MAISON AJOUTÉ ICI */}
      <Link to="/products" className="home-fab">
        🏠
      </Link>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default App;