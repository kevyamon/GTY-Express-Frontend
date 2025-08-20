import React from 'react';
import './SplashScreen.css';
import logo from '../assets/logo.png';

const SplashScreen = ({ show }) => {
  return (
    <div className={`splash-screen-overlay ${show ? 'show' : ''}`}>
      <div className="splash-content">
        <img src={logo} alt="GTY Express Logo" className="splash-logo" />
        <h1 className="splash-text">GTY Express</h1>
        {/* --- LIGNE AJOUTÉE CI-DESSOUS --- */}
        <p className="splash-signature">By_Kevy</p>
      </div>
    </div>
  );
};

export default SplashScreen;