import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify'; // Importer
import 'react-toastify/dist/ReactToastify.css'; // Importer le style

const App = () => {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
      <ToastContainer /> {/* Ajouter le conteneur ici */}
    </>
  );
};
export default App;
