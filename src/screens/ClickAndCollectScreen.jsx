import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './StaticPage.css'; // NOUVEL IMPORT

const ClickAndCollectScreen = () => {
  return (
    <div className="static-page-container"> {/* NOUVELLE CLASSE CSS */}
      <Container>
        <Row className="justify-content-md-center">
          <Col md={10}>
            <h1>Cliquez et Retirez</h1>
            <p className="lead mt-4">
              Gagnez du temps avec notre service "Cliquez et Retirez" ! Commandez en ligne et récupérez vos achats dans le point de retrait de votre choix.
            </p>

            <h5>Comment ça marche ?</h5>
            <ol>
              <li><strong>Commandez en ligne :</strong> Ajoutez vos produits au panier comme d'habitude.</li>
              <li><strong>Choisissez le retrait :</strong> Au moment de choisir la méthode de livraison, sélectionnez "Cliquez et Retirez" et choisissez le point de retrait qui vous arrange.</li>
              <li><strong>Recevez la notification :</strong> Nous vous prévenons par notification dès que votre commande est prête à être récupérée.</li>
              <li><strong>Récupérez votre commande :</strong> Présentez-vous au point de retrait avec votre confirmation de commande et une pièce d'identité pour récupérer vos achats. C'est simple, rapide et souvent gratuit !</li>
            </ol>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ClickAndCollectScreen;