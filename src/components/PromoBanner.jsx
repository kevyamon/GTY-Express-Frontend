import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaCamera, FaHeadphones, FaShoppingBag } from 'react-icons/fa';
import './PromoBanner.css';

const PromoBanner = ({ bannerData }) => {
  const calculateTimeLeft = () => {
    // La date de fin vient maintenant de la base de données
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
    // Met à jour le timer uniquement si la date de fin change
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, bannerData.endDate]);

  return (
    <div className="promo-banner-container my-4">
      <Row>
        {/* Section Gauche : Timer et Offre */}
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

        {/* Section Droite : Images */}
        <Col md={4} className="promo-right-section">
          <div className="icon-background">
            <FaCamera className="icon-1" />
            <FaHeadphones className="icon-2" />
            <FaShoppingBag className="icon-3" />
          </div>
          <div className="deal-of-the-month">
            LES OFFRES DU MOIS
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default PromoBanner;