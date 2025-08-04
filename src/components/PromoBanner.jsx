import React, { useState, useEffect } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import './PromoBanner.css';

const PromoBanner = ({ bannerData }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Effet pour l'animation du texte
  useEffect(() => {
    if (bannerData.animatedTexts.length > 1) {
      const interval = setInterval(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % bannerData.animatedTexts.length);
      }, 4000); // Change de texte toutes les 4 secondes
      return () => clearInterval(interval);
    }
  }, [bannerData.animatedTexts]);

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
    const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="promo-banner-container my-4">
      <div className="floating-images-container">
        {bannerData.floatingImages && bannerData.floatingImages.map((img, index) => (
          <Image key={index} src={img.url} className={`floating-image floating-image-${index + 1}`} />
        ))}
      </div>

      <Row>
        <Col className="promo-left-section">
          <div className="timer">
            {Object.keys(timeLeft).length > 0 ? 
              `Fin de la promo : ${timeLeft.jours}j ${timeLeft.heures}h ${timeLeft.minutes}m ${timeLeft.secondes}s`
              : "Promotion terminée !"}
          </div>

          <div className="animated-text-container">
            {bannerData.animatedTexts.length > 0 && (
                <div key={currentTextIndex} className="main-offer">
                    {bannerData.animatedTexts[currentTextIndex].text}
                </div>
            )}
          </div>

          <Row className="coupons-section justify-content-center">
            {bannerData.coupons.map((coupon, index) => (
              <Col xs={6} md={4} key={index} className="mb-2">
                <div className="coupon-card">
                  <span>{coupon.title}</span>
                  <small>{coupon.subtitle}</small>
                  <strong>{coupon.code}</strong>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default PromoBanner;