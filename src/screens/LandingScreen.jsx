import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import logo from '../assets/logo.png';
import landingBackground from '../assets/landingbackground.png';

const imageModules = import.meta.glob('../assets/products/*.{png,jpg,jpeg,svg}');

import './LandingScreen.css';

const LandingScreen = () => {
  const [productImages, setProductImages] = useState([]);
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // --- DÉBUT DE LA CORRECTION ---
  // Ce `useEffect` s'exécute au chargement du composant.
  // S'il détecte qu'un utilisateur est connecté, il le redirige immédiatement.
  useEffect(() => {
    if (userInfo) {
      navigate('/products');
    }
  }, [userInfo, navigate]);
  // --- FIN DE LA CORRECTION ---

  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = Object.values(imageModules).map(importImage => importImage());
      const loadedImages = await Promise.all(imagePromises);
      setProductImages(loadedImages.map(module => module.default));
    };
    loadImages();
  }, []);

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

  // Si l'utilisateur est connecté, on peut retourner null car la redirection est en cours.
  // Cela évite un bref affichage de la page avant la redirection.
  if (userInfo) {
    return null;
  }

  return (
    <div className='landing-v2' style={pageStyle}>
      {productImages.length > 0 && (
        <div className='scrolling-background'>
          {chunkedImages.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`product-scroller ${rowIndex % 2 === 0 ? 'scroll-left' : 'scroll-right'}`}
            >
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