import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Vos imports d'images restent les mêmes
import landingBackground from '../assets/landingbackground.png';
const imageModules = import.meta.glob('../assets/products/*.{png,jpg,jpeg,svg}');

import './LandingScreen.css';

const LandingScreen = () => {
  const [productImages, setProductImages] = useState([]);
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // La logique de redirection et de chargement d'images est conservée
  useEffect(() => {
    if (userInfo) {
      navigate('/products');
    }
  }, [userInfo, navigate]);

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

  if (userInfo) {
    return null;
  }

  return (
    <div className='landing-v2' style={pageStyle}>
      {/* L'arrière-plan avec les images qui défilent est conservé */}
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

      <div className='overlay'></div>

      {/* --- DÉBUT DE LA MODIFICATION DU CONTENU --- */}
      <div className='landing-v2-content'>
        <h1 className='landing-main-title'>Bienvenue sur GTY Express</h1>
        
        <h2 className='landing-subtitle-typing'>Vos envies,en un instant.</h2>

        <p className='landing-subtitle-secondary'>
          Explorez des milliers d'articles et recevez-les où que vous soyez.
          <br />
          Le meilleur service de livraison en Côte d'Ivoire.
        </p>

        <div className='landing-buttons-v2'>
          <Link to='/register'>
            <Button className='btn-cta-primary'>
              Commencer
            </Button>
          </Link>
        </div>
      </div>
      {/* --- FIN DE LA MODIFICATION DU CONTENU --- */}
    </div>
  );
};

export default LandingScreen;
