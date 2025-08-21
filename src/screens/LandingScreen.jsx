import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
// --- MODIFICATION : on importe useOutletContext ---
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaGooglePlay, FaApple } from 'react-icons/fa'; // --- NOUVEL IMPORT ---

import landingBackground from '../assets/landingbackground.png';
const imageModules = import.meta.glob('../assets/products/*.{png,jpg,jpeg,svg}');

import './LandingScreen.css';

const LandingScreen = () => {
  const [productImages, setProductImages] = useState([]);
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  
  // --- DÉBUT DE L'AJOUT ---
  // On récupère la fonction pour afficher la modale d'installation
  const { handleShowInstallModal } = useOutletContext();
  // --- FIN DE L'AJOUT ---

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

      <div className='landing-v2-content'>
        <h1 className='landing-main-title'>Bienvenue sur GTY Express</h1>
        
        <h2 className='landing-subtitle-typing'>Vos envies, en un instant.</h2>

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

        {/* --- DÉBUT DE L'AJOUT DES NOUVEAUX BOUTONS --- */}
        <div className="download-app-section">
            <p>Téléchargez notre application</p>
            <div className="download-buttons">
                <Button className="download-btn android" onClick={handleShowInstallModal}>
                    <FaGooglePlay />
                    <span>Android</span>
                </Button>
                <Button className="download-btn apple" onClick={handleShowInstallModal}>
                    <FaApple />
                    <span>Apple iOS</span>
                </Button>
            </div>
        </div>
        {/* --- FIN DE L'AJOUT --- */}

      </div>
    </div>
  );
};

export default LandingScreen;