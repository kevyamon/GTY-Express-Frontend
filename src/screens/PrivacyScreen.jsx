import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './StaticPage.css'; // On importe le style

const PrivacyScreen = () => {
  return (
    <div className="static-page-container">
      <Container>
        <Row className="justify-content-md-center">
          <Col md={10}>
            <h1>Données Personnelles et Cookies</h1>
            <p className="lead mt-4">
              La protection de vos données personnelles est une priorité pour GTY Express.
            </p>

            <h5 className="mt-4">Collecte des données</h5>
            <p>
              Nous collectons les informations nécessaires au traitement de vos commandes et à la gestion de notre relation commerciale (nom, prénom, adresse, email, téléphone). Vos données de paiement ne sont pas stockées sur nos serveurs et sont traitées par nos partenaires de paiement sécurisé.
            </p>

            <h5 className="mt-4">Utilisation des données</h5>
            <p>
              Vos données sont utilisées exclusivement pour :
            </p>
            <ul>
                <li>Assurer le traitement et la livraison de vos commandes.</li>
                <li>Communiquer avec vous concernant votre commande.</li>
                <li>Vous envoyer nos offres promotionnelles si vous y avez consenti.</li>
            </ul>

            <h5 className="mt-4">Vos droits</h5>
            <p>
              Conformément à la loi, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Vous pouvez exercer ce droit en nous contactant via notre page de contact.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrivacyScreen;