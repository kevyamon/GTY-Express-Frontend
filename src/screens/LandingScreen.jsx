import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './LandingScreen.css'; // On importe notre nouveau style

const LandingScreen = () => {
  return (
    <div className='landing'>
      <Container>
        <div className='landing-inner'>
          <h1 className='animated-text'>Bienvenue sur GTY Express</h1>
          <p className='lead'>
            Votre nouvelle destination pour trouver les meilleurs produits, rapidement et simplement.
          </p>
          <div className='landing-buttons'>
            <Link to='/login'>
              <Button variant='primary' size='lg' className='animated-button'>
                Se Connecter
              </Button>
            </Link>
            <Link to='/register'>
              <Button variant='secondary' size='lg' className='animated-button'>
                S'inscrire
              </Button>
            </Link>
          </div>

          {/* Ajout du crédit de création */}
          <div className='creator-credit'>
            <p>Créé par Kevin Amon</p>
            <p>2250768388770 / amonchristr34@gmail.com</p>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default LandingScreen;