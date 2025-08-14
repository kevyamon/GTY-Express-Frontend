import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './WelcomeTransition.css';
import logo from '/logo.png'; // On importe le logo

const WelcomeTransition = ({ onTransitionEnd }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // S'affiche uniquement si userInfo existe
    if (userInfo) {
      setVisible(true);

      // Disparaît après 4 secondes
      const timer = setTimeout(() => {
        setVisible(false);
        // Prévient le composant parent que l'animation est finie
        onTransitionEnd(); 
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [userInfo, onTransitionEnd]);

  if (!visible || !userInfo) {
    return null;
  }

  // Choisit le message en fonction du drapeau isNewUser
  const message = userInfo.isNewUser
    ? `Bienvenue, ${userInfo.name} ! Là où le produit, c'est ton envie !`
    : `Heureux de te revoir, ${userInfo.name} ! Viens vite voir les nouveautés !`;

  return (
    <div className="welcome-overlay">
      <div className="welcome-content">
        <img src={logo} alt="GTY Express Logo" className="welcome-logo" />
        <div className="welcome-emoji">🙋‍♂️</div>
        <p className="welcome-message">{message}</p>
      </div>
    </div>
  );
};

export default WelcomeTransition;