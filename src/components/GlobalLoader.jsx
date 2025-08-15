import React from 'react';
import { useSelector } from 'react-redux';
import './GlobalLoader.css';

const GlobalLoader = () => {
  // On se connecte à l'état global du loader
  const { isLoading } = useSelector((state) => state.loader);

  return (
    <div className={`global-loader-overlay ${isLoading ? 'show' : ''}`}>
      <div className="pulsing-dot"></div>
    </div>
  );
};

export default GlobalLoader;