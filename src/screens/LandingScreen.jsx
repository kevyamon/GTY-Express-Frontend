import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import logo from '../assets/logo.png';
import landingBackground from '../assets/landingbackground.png';

// On charge les images de manière asynchrone pour ne pas bloquer le chargement initial
const imageModules = import.meta.glob('../assets/products/*.{png,jpg,jpeg,svg}');

import './LandingScreen.css';

const LandingScreen = () => {
  // On utilise un état pour stocker les images une fois chargées
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    // On charge les images après l'affichage du composant
    const loadImages = async () => {
      const imagePromises = Object.values(imageModules).map(importImage => importImage());
      const loadedImages = await Promise.all(imagePromises);
      setProductImages(loadedImages.map(module => module.default));
    };
    loadImages();
  }, []);

  // On groupe les images par lots pour créer plusieurs lignes de défilement
  const chunkedImages = [];
  for (let i = 0; i < productImages.length; i += 5) {
    chunkedImages.push(productImages.slice(i, i + 5));
  }

  const imageStyle = {
    borderRadius: '40%',
  };

  const pageStyle = {
    backgroundImage: `url(${landingBackground})`,
  };

  return (
    <div className='landing-v2' style={pageStyle}>
      {productImages.length > 0 && (
        <div className='scrolling-background'>
          {chunkedImages.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`product-scroller ${rowIndex % 2 === 0 ? 'scroll-left' : 'scroll-right'}`}
            >
              {/* On duplique la ligne d'images pour un défilement infini fluide */}
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
      )}

      <div className='landing-v2-content'>
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