import React from 'react';
import './Loader.css'; // On importe notre nouveau style

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;