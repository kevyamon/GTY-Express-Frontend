import React from 'react';
import './SplashScreen.css';
import logo from '../assets/logo.png';

const SplashScreen = ({ show }) => {
  return (
    <div className={`splash-screen-overlay ${show ? 'show' : ''}`}>
      <div className="splash-content">
        <img src={logo} alt="GTY Express Logo" className="splash-logo" />
        <h1 className="splash-text">GTY Express</h1>
      </div>
    </div>
  );
};

export default SplashScreen;