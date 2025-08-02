import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './StaticPage.css'; // NOUVEL IMPORT

const ReturnsScreen = () => {
  return (
    <div className="static-page-container"> {/* NOUVELLE CLASSE CSS */}
      <Container>
        <Row className="justify-content-md-center">
          <Col md={10}>
            <h1>Retour ou Échange</h1>
            <p className="lead mt-4">
              Un article ne vous convient pas ? Vous avez changé d'avis ? Pas de problème, vous avez 7 jours pour nous le retourner.
            </p>

            <h5>Conditions de retour</h5>
            <ul>
              <li>Le produit doit être dans son état d'origine, non utilisé et dans son emballage complet.</li>
              <li>Les retours doivent être effectués dans un délai de 7 jours après la réception de la commande.</li>
              <li>Certains articles, comme les produits d'hygiène ou les logiciels, ne peuvent pas être retournés.</li>
            </ul>

            <h5>Procédure de retour</h5>
            <p>
              Pour effectuer un retour, veuillez contacter notre service client depuis la section "Aide & Contact" de notre site. Un conseiller vous indiquera la marche à suivre pour nous renvoyer le produit et obtenir un échange ou un remboursement.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ReturnsScreen;