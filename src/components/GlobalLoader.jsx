import React from 'react';
import { useSelector } from 'react-redux';
import './GlobalLoader.css';

const GlobalLoader = () => {
  // On récupère maintenant le message en plus de l'état de chargement
  const { isLoading, message } = useSelector((state) => state.loader);

  return (
    <div className={`global-loader-overlay ${isLoading ? 'show' : ''}`}>
      <div className="loader-content">
        <div className="pulsing-dot"></div>
        {/* On affiche le message s'il existe */}
        {message && (
          <p className="loader-message">
            {message}
            <span className="loading-dots"></span>
          </p>
        )}
      </div>
    </div>
  );
};

export default GlobalLoader;