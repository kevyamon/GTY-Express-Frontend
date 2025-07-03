import { Container } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css'; // On importe le style pour l'animation

const App = () => {
  const location = useLocation();

  return (
    <>
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
      <ToastContainer />
    </>
  );
};
export default App;