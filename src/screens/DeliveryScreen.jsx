import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './StaticPage.css'; // NOUVEL IMPORT

const DeliveryScreen = () => {
  return (
    <div className="static-page-container"> {/* NOUVELLE CLASSE CSS */}
      <Container>
        <Row className="justify-content-md-center">
          <Col md={10}>
            <h1>Politique de Livraison</h1>
            <p className="lead mt-4">
              Chez GTY Express, nous nous engageons à vous livrer vos produits le plus rapidement possible, partout en Côte d'Ivoire.
            </p>

            <Card className="my-4">
              <Card.Header as="h5">Options de livraison</Card.Header>
              <Card.Body>
                <Card.Title>Livraison à Domicile</Card.Title>
                <Card.Text>
                  Recevez votre commande directement chez vous ou à votre bureau. Les délais de livraison varient de 24h à 72h selon votre zone géographique. Les frais de livraison sont calculés au moment de la validation de la commande.
                </Card.Text>
                <Card.Title className="mt-3">Retrait en Point Relais</Card.Title>
                <Card.Text>
                  Choisissez l'un de nos points relais partenaires pour récupérer votre colis à votre convenance. Cette option est souvent plus économique.
                </Card.Text>
              </Card.Body>
            </Card>

            <h5>Suivi de commande</h5>
            <p>
              Dès l'expédition de votre commande, vous recevrez une notification avec un lien de suivi vous permettant de suivre en temps réel l'acheminement de votre colis.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DeliveryScreen;