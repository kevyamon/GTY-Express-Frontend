import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './StaticPage.css'; // On importe le style

const HowToBuyScreen = () => {
  return (
    <div className="static-page-container">
      <Container>
        <Row className="justify-content-md-center">
          <Col md={10}>
            <h1>Comment acheter en ligne ?</h1>
            <p className="lead mt-4">
              Acheter sur GTY Express est simple, rapide et sécurisé. Suivez ces quelques étapes pour passer votre commande.
            </p>

            <h5 className="mt-4">Étape 1 : Trouvez vos produits</h5>
            <p>
              Utilisez la barre de recherche en haut du site ou naviguez dans nos différentes catégories (Produits, Supermarché, Promotions) pour trouver les articles que vous souhaitez.
            </p>

            <h5 className="mt-4">Étape 2 : Ajoutez au panier</h5>
            <p>
              Sur la page d'un produit, sélectionnez la quantité désirée et cliquez sur le bouton "Ajouter au Panier". Vous pouvez continuer vos achats ou consulter votre panier à tout moment en cliquant sur l'icône 🛒 en haut de la page.
            </p>

            <h5 className="mt-4">Étape 3 : Validez votre commande</h5>
            <p>
              Une fois dans votre panier, cliquez sur "Passer la commande". Si vous n'êtes pas connecté, le site vous invitera à le faire ou à créer un compte.
            </p>

            <h5 className="mt-4">Étape 4 : Livraison et Paiement</h5>
            <p>
              Remplissez votre adresse de livraison, puis choisissez votre méthode de paiement (PayPal/Carte de crédit ou Paiement à la livraison).
            </p>

            <h5 className="mt-4">Étape 5 : Confirmation</h5>
            <p>
              Vérifiez le récapitulatif de votre commande et cliquez sur "Valider la Commande". C'est tout ! Vous recevrez une notification de confirmation et pourrez suivre l'état de votre commande depuis votre profil.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HowToBuyScreen;