import React, { useState, useEffect } from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import './PromoBanner.css';

const PromoBanner = ({ bannerData }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Effet pour l'animation du texte
  useEffect(() => {
    if (bannerData.animatedTexts && bannerData.animatedTexts.length > 1) {
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
        j: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
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
      <Col xs={12} md={6} className="promo-left-section">
        <div className="timer">
          {Object.keys(timeLeft).length > 0 ? 
            `Fin de la promo : ${timeLeft.j}j ${timeLeft.h}h ${timeLeft.m}m ${timeLeft.s}s`
            : "Promotion terminée !"}
        </div>

        <div className="animated-text-container">
          {bannerData.animatedTexts && bannerData.animatedTexts.length > 0 && (
              <div key={currentTextIndex} className="main-offer">
                  {bannerData.animatedTexts[currentTextIndex].text}
              </div>
          )}
        </div>

        <div className="coupons-section">
          {bannerData.coupons && bannerData.coupons.map((coupon, index) => (
            <div className="coupon-card" key={index}>
              <span>{coupon.title}</span>
              <small>{coupon.subtitle}</small>
              <strong>{coupon.code}</strong>
            </div>
          ))}
        </div>
      </Col>

      <Col xs={12} md={6} className="promo-right-section">
        {bannerData.floatingImages && bannerData.floatingImages.map((img, index) => (
          <Image key={index} src={img.url} className={`floating-image floating-image-${index + 1}`} />
        ))}
      </Col>
    </div>
  );
};

export default PromoBanner;