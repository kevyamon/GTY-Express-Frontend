import React, { useState, useEffect } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import './PromoBanner.css';

const PromoBanner = ({ bannerData }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(bannerData.endDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        jours: Math.floor(difference / (1000 * 60 * 60 * 24)),
        heures: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        secondes: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, bannerData.endDate]);

  return (
    <div className="promo-banner-container my-4">
      <Row>
        {/* Section de Gauche avec Texte et Coupons */}
        <Col md={8} className="promo-left-section">
          <div className="timer">
            {Object.keys(timeLeft).length > 0 ? 
              `Fin de la promo : ${timeLeft.jours}j ${timeLeft.heures}h ${timeLeft.minutes}m ${timeLeft.secondes}s`
              : "Promotion terminée !"}
          </div>
          <div className="main-offer">
            {bannerData.mainOfferText}
          </div>
          <Row className="coupons-section">
            {bannerData.coupons.map((coupon, index) => (
              <Col xs={4} key={index}>
                <div className="coupon-card">
                  <span>{coupon.title}</span>
                  <small>{coupon.subtitle}</small>
                  <strong>Code: {coupon.code}</strong>
                </div>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Section de Droite avec le bouton rouge */}
        <Col md={4} className="promo-right-section">
          <div className="deal-of-the-month">
            LES OFFRES DU MOIS
          </div>
        </Col>
      </Row>

      {/* Conteneur pour les images, positionné au-dessus de tout */}
      <div className="banner-images-container">
        {bannerData.images && bannerData.images.map((img, index) => (
          <Image key={index} src={img} className="banner-image-item" />
        ))}
      </div>
    </div>
  );
};

export default PromoBanner;