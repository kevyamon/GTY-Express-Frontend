import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const TermsScreen = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
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
  );
};

export default TermsScreen;