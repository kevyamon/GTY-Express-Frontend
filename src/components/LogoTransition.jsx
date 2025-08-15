import React from 'react';
import './LogoTransition.css';

// show: un booléen pour afficher ou cacher l'animation
// onTransitionEnd: une fonction à appeler quand l'animation est finie
const LogoTransition = ({ show, onTransitionEnd }) => {
  const text = "GTY Express";

  // On écoute la fin de l'animation sur le dernier élément animé
  const handleAnimationEnd = (e) => {
    // On s'assure que c'est bien la dernière lettre qui a fini son animation
    if (e.target.classList.contains(`char${text.length}`)) {
      if (onTransitionEnd) {
        onTransitionEnd();
      }
    }
  };

  return (
    <div className={`logo-transition-overlay ${show ? 'show' : ''}`}>
      <h1 className="logo-container-transition">
        {text.split('').map((char, index) => (
          <span
            key={index}
            className={`char${index + 1}`}
            // On attache l'écouteur d'événement uniquement à la dernière lettre
            onAnimationEnd={index === text.length - 1 ? handleAnimationEnd : null}
          >
            {char === ' ' ? '\u00A0' : char} {/* Gère les espaces */}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default LogoTransition;