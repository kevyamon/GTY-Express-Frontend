import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // --- NOUVEL IMPORT ---
import './StaticPage.css';

const TermsScreen = () => {
  const navigate = useNavigate();

  // --- NOUVEL AJOUT : On récupère l'état de connexion de l'utilisateur ---
  const { userInfo } = useSelector((state) => state.auth);

  // --- MODIFICATION : La logique du bouton "Retour" est maintenant conditionnelle ---
  const goBackHandler = () => {
    if (userInfo) {
      navigate(-1); // Si l'utilisateur est connecté, on retourne en arrière
    } else {
      navigate('/register'); // Sinon, on le dirige vers la page d'inscription
    }
  };

  return (
    <div className="static-page-container">
      <Button className='btn btn-light mb-4' onClick={goBackHandler}>
        Retour
      </Button>
      <Container>
        <Row className="justify-content-md-center">
          <Col md={10}>
            <h1>Conditions Générales d'Utilisation et de Vente (CGU/CGV)</h1>
            <h5 className="mt-4">Article 1 : Objet</h5>
            <p>
              Les présentes conditions régissent les ventes par la société GTY Express de ses produits.
            </p>

            <h5 className="mt-4">Article 2 : Prix</h5>
            <p>
              Les prix de nos produits sont indiqués en francs CFA (FCFA) toutes taxes comprises (TVA et autres taxes applicables au jour de la commande), sauf indication contraire et hors frais de traitement et d'expédition.
            </p>

            <h5 className="mt-4">Article 3 : Commandes</h5>
            <p>
              Vous pouvez passer commande sur notre site internet gty-express-frontend.onrender.com. Les informations contractuelles sont présentées en langue française et feront l'objet d'une confirmation au plus tard au moment de la validation de votre commande.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TermsScreen;