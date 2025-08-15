import React from 'react';
import { useSelector } from 'react-redux';
import './GlobalLoader.css';

const GlobalLoader = () => {
  // Plus tard, nous allons créer un état global pour contrôler "isLoading"
  const isLoading = false; // Pour l'instant, nous le mettons sur "false"

  return (
    <div className={`global-loader-overlay ${isLoading ? 'show' : ''}`}>
      <div className="pulsing-dot"></div>
    </div>
  );
};

export default GlobalLoader;