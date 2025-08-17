import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './StaticPage.css';

const PrivacyScreen = () => {
  const navigate = useNavigate();

  const goBackHandler = () => {
    navigate(-1);
  };

  return (
    <div className="static-page-container">
      <Button className='btn btn-light mb-4' onClick={goBackHandler}>
        Retour
      </Button>
      <Container>
        <Row className="justify-content-md-center">
          <Col md={10}>
            <h1>Données Personnelles et Confidentialité</h1>
            <p className="lead mt-4">
              La protection de vos données personnelles est une priorité pour GTY Express.
            </p>

            <h5 className="mt-4">Collecte des informations</h5>
            <p>
              Nous collectons des informations lorsque vous vous inscrivez sur notre site, passez une commande, ou nous contactez. Les informations collectées incluent votre nom, votre adresse e-mail, votre numéro de téléphone et votre adresse postale.
            </p>

            <h5 className="mt-4">Utilisation des informations</h5>
            <p>
              Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :
            </p>
            <ul>
              <li>Personnaliser votre expérience et répondre à vos besoins individuels.</li>
              <li>Fournir un contenu publicitaire personnalisé.</li>
              <li>Améliorer notre site Web.</li>
              <li>Améliorer le service client et vos besoins de prise en charge.</li>
              <li>Vous contacter par e-mail ou téléphone pour le suivi de vos commandes.</li>
            </ul>

            <h5 className="mt-4">Confidentialité</h5>
            <p>
              Nous sommes les seuls propriétaires des informations recueillies sur ce site. Vos informations personnelles ne seront pas vendues, échangées, transférées, ou données à une autre société sans votre consentement, en dehors de ce qui est nécessaire pour répondre à une demande et / ou une transaction, comme par exemple pour expédier une commande.
            </p>
            
            <h5 className="mt-4">Sécurité</h5>
            <p>
              Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PrivacyScreen;