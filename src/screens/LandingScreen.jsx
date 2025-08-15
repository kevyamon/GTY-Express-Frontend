import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// 1. Importer le logo et le fond d'écran (inchangé)
import logo from '../assets/logo.png';
import landingBackground from '../assets/landingbackground.png';

// 2. CORRECTION : Voici la bonne méthode pour importer les images avec Vite
// On utilise { eager: true } pour charger directement les images
const modules = import.meta.glob('../assets/products/*.{png,jpg,jpeg,svg}', { eager: true });
// On récupère ensuite le chemin de chaque image
const productImages = Object.values(modules).map((module) => module.default);

import './LandingScreen.css';

const LandingScreen = () => {
  // Divise les images en lignes de 5 (inchangé)
  const chunkedImages = [];
  for (let i = 0; i < productImages.length; i += 5) {
    chunkedImages.push(productImages.slice(i, i + 5));
  }

  // Style pour l'arrondi des images (inchangé)
  const imageStyle = {
    borderRadius: '40%',
  };

  const pageStyle = {
    backgroundImage: `url(${landingBackground})`,
  };

  return (
    <div className='landing-v2' style={pageStyle}>
      <div className='scrolling-background'>
        {chunkedImages.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`product-scroller ${rowIndex % 2 === 0 ? 'scroll-left' : 'scroll-right'}`}
          >
            {/* On duplique les images pour un effet de boucle infini (inchangé) */}
            {[...row, ...row].map((image, imgIndex) => (
              <img
                key={imgIndex}
                src={image}
                alt={`product-showcase-${imgIndex}`}
                className="product-image"
                style={imageStyle}
              />
            ))}
          </div>
        ))}
      </div>

      <div className='landing-v2-content'>
        {/* On ajoute une classe pour l'animation du logo */}
        <img src={logo} alt="GTY Express Logo" className="landing-logo animated-logo" />
        <h1 className='landing-main-title'>Bienvenue sur GTY Express</h1>
<h2 className='landing-slogan'>Là où le produit, c'est ton envie.</h2>
        <p className='landing-subtitle'>
          Explore des milliers d'articles et profite d'une livraison express en Côte d'Ivoire.
        </p>
        <div className='landing-buttons-v2'>
          <Link to='/register'>
            <Button className='btn-signup'>
              Créer un compte
            </Button>
          </Link>
          <Link to='/login'>
            <Button className='btn-login'>
              Se Connecter
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;