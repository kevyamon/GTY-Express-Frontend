import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './StaticPage.css'; // NOUVEL IMPORT

const AboutScreen = () => {
  return (
    <div className="static-page-container"> {/* NOUVELLE CLASSE CSS */}
      <Container>
        <Row className="justify-content-md-center">
          <Col md={10}>
            <h1>Qui sommes nous ?</h1>
            <p className="lead mt-4">
              Bienvenue sur GTY Express, votre destination de confiance pour des produits de qualité livrés rapidement.
            </p>
            <p>
              Fondée en 2025, GTY Express a pour mission de simplifier votre expérience d'achat en ligne en vous offrant une sélection rigoureuse de produits variés, un service client à l'écoute et une logistique efficace.
            </p>
            <p>
              Nous sommes basés à Abidjan, en Côte d'Ivoire, et nous nous engageons à soutenir l'économie locale tout en vous donnant accès à des articles du monde entier. Notre équipe est passionnée par l'innovation et travaille sans relâche pour vous garantir une satisfaction totale à chaque commande.
            </p>
            <p>
              Merci de faire partie de notre aventure !
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutScreen;