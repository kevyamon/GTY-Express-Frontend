import React from 'react';
import { Container, Row, Col, Accordion } from 'react-bootstrap';
import './StaticPage.css'; // On importe le style

const FAQScreen = () => {
  return (
    <div className="static-page-container">
      <Container>
        <Row className="justify-content-md-center">
          <Col md={10}>
            <h1>Foire Aux Questions (FAQ)</h1>

            <Accordion defaultActiveKey="0" className="mt-4">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Quels sont les délais de livraison ?</Accordion.Header>
                <Accordion.Body>
                  Nos délais de livraison standard sont de 24h à 72h ouvrées pour toute la Côte d'Ivoire. Vous pouvez suivre votre commande en temps réel depuis votre espace client.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Quels moyens de paiement acceptez-vous ?</Accordion.Header>
                <Accordion.Body>
                  Nous acceptons les paiements via PayPal (qui inclut les cartes de crédit) ainsi que le paiement en espèces à la livraison pour plus de flexibilité.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Puis-je annuler ou modifier ma commande ?</Accordion.Header>
                <Accordion.Body>
                  Vous pouvez annuler votre commande directement depuis votre historique d'achats tant qu'elle a le statut "En attente". Une fois qu'elle est "Confirmée" ou "Expédiée", il n'est plus possible de l'annuler. Pour toute modification, veuillez contacter notre service client au plus vite.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="3">
                <Accordion.Header>Comment puis-je retourner un produit ?</Accordion.Header>
                <Accordion.Body>
                  Vous disposez de 7 jours pour nous retourner un produit s'il ne vous convient pas. Consultez notre page "Retour ou Échange" pour connaître la procédure détaillée.
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FAQScreen;