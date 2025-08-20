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

  // La logique de redirection si l'utilisateur est connecté est conservée
  useEffect(() => {
    if (userInfo) {
      navigate('/products');
    }
  }, [userInfo, navigate]);

  // La logique de chargement des images pour l'arrière-plan est conservée
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

      {/* NOUVEAU : Superposition sombre pour la lisibilité */}
      <div className='overlay'></div>

      {/* Le contenu est maintenant centré sans boîte en arrière-plan */}
      <div className='landing-v2-content'>
        <h1 className='landing-main-title'>Vos envies, livrées en un instant.</h1>
        <p className='landing-subtitle'>
          Explorez des milliers d'articles et recevez-les où que vous soyez.
          <br />
          Le meilleur service de livraison en Côte d'Ivoire.
        </p>
        <div className='landing-buttons-v2'>
          <Link to='/register'>
            {/* NOUVEAU : Un seul bouton d'appel à l'action */}
            <Button className='btn-cta-primary'>
              Commencer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;