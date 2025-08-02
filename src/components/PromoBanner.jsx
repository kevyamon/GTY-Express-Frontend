import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaCamera, FaHeadphones, FaShoppingBag } from 'react-icons/fa';
import './PromoBanner.css';

const PromoBanner = () => {
  const calculateTimeLeft = () => {
    // On met une date de fin de promotion dans le futur pour la démonstration
    const difference = +new Date('2025-12-31T23:59:59') - +new Date();
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
  });

  return (
    <div className="promo-banner-container my-4">
      <Row>
        {/* Section Gauche : Timer et Offre */}
        <Col md={8} className="promo-left-section">
          <div className="timer">
            Fin de la promo : {timeLeft.jours}j {timeLeft.heures}h {timeLeft.minutes}m {timeLeft.secondes}s
          </div>
          <div className="main-offer">
            Jusqu'à -60%
          </div>
          <Row className="coupons-section">
            <Col xs={4}>
              <div className="coupon-card">
                <span>-5000 FCFA</span>
                <small>dès 75000 FCFA d'achat</small>
                <strong>Code: PROMO5K</strong>
              </div>
            </Col>
            <Col xs={4}>
              <div className="coupon-card">
                <span>-10000 FCFA</span>
                <small>dès 120000 FCFA d'achat</small>
                <strong>Code: PROMO10K</strong>
              </div>
            </Col>
            <Col xs={4}>
              <div className="coupon-card">
                <span>-25000 FCFA</span>
                <small>dès 200000 FCFA d'achat</small>
                <strong>Code: PROMO25K</strong>
              </div>
            </Col>
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