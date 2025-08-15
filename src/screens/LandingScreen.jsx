import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// --- NOS AJOUTS ---
// 1. Importer le logo et le fond d'écran
import logo from '../assets/logo.png';
import landingBackground from '../assets/landingbackground.png';

// 2. Importer dynamiquement toutes les images du dossier products
// Cette magie permet de récupérer toutes les images sans les nommer une par une
const productImagesContext = import.meta.glob('../assets/products/*.{png,jpg,jpeg,svg}');
const productImages = Object.keys(productImagesContext).map(key => productImagesContext[key].name);

// 3. Notre composant réécrit pour la nouvelle page
import './LandingScreen.css';

const LandingScreen = () => {
  // Divise les images en lignes de 5
  const chunkedImages = [];
  for (let i = 0; i < productImages.length; i += 5) {
    chunkedImages.push(productImages.slice(i, i + 5));
  }

  // Style pour l'arrondi des images (tu peux changer "40%" ici)
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
            {/* On duplique les images dans chaque ligne pour un effet de boucle infini parfait */}
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
        <img src={logo} alt="GTY Express Logo" className="landing-logo" />
        <h1 className='landing-title'>Là où le produit, c'est ton envie.</h1>
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