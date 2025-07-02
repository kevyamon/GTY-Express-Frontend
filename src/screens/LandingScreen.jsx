import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './LandingScreen.css'; // On importe notre nouveau style

const LandingScreen = () => {
  return (
    <div className='landing'>
      <Container>
        <div className='landing-inner'>
          <h1>Bienvenue sur GTY Express</h1>
          <p className='lead'>
            Votre nouvelle destination pour trouver les meilleurs produits, rapidement et simplement.
          </p>
          <div className='landing-buttons'>
            <Link to='/login'>
              <Button variant='primary' size='lg'>
                Se Connecter
              </Button>
            </Link>
            <Link to='/register'>
              <Button variant='secondary' size='lg'>
                S'inscrire
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LandingScreen;
