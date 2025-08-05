import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './LandingScreen.css';

const LandingScreen = () => {
  return (
    <div className="landing-container">
      <style>
        {`
          @keyframes pulse-light {
            0% {
              box-shadow: 0 0 10px 0px rgba(255, 255, 255, 0.4);
            }
            70% {
              box-shadow: 0 0 10px 20px rgba(255, 255, 255, 0);
            }
            100% {
              box-shadow: 0 0 10px 0px rgba(255, 255, 255, 0);
            }
          }
          @keyframes text-glow {
            0%, 100% {
              text-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #007bff;
            }
            50% {
              text-shadow: 0 0 20px #fff, 0 0 30px #007bff, 0 0 40px #007bff;
            }
          }
          .welcome-text {
            animation: text-glow 3s ease-in-out infinite;
          }
          .pulsing-btn {
            animation: pulse-light 2s infinite;
          }
          .creator-text {
            animation: text-glow 4s ease-in-out infinite;
            animation-delay: 1.5s;
          }
        `}
      </style>
      <Container className="text-center landing-content">
        <h1 className="welcome-text">Bienvenue sur GTY Express</h1>
        <p className="lead-text">Votre source de confiance pour des produits de qualité.</p>
        <Row className="justify-content-center mt-4">
          <Col xs="auto">
            <Link to="/products">
              <Button variant="primary" size="lg" className="pulsing-btn">
                Voir les Produits
              </Button>
            </Link>
          </Col>
          <Col xs="auto">
            <Link to="/supermarket">
              <Button variant="success" size="lg" className="pulsing-btn" style={{animationDelay: '1s'}}>
                Aller au Supermarché
              </Button>
            </Link>
          </Col>
        </Row>
        <div className="creator-text mt-5">
            Créé par Kevin Amon 2250768388770 / amonchristr34@gmail.com
        </div>
      </Container>
    </div>
  );
};

export default LandingScreen;