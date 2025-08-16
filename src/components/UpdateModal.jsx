import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaRocket } from 'react-icons/fa';
import './UpdateModal.css'; // On va créer un nouveau style pour ce modal

const UpdateModal = ({ show, handleClose, onConfirmUpdate }) => {
  // On récupère les variables injectées par Vite
  const appVersion = import.meta.env.VITE_APP_VERSION;
  const commitHash = import.meta.env.VITE_COMMIT_HASH;

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false} dialogClassName="update-modal-dialog">
      <Modal.Body className="update-modal-body">
        <div className="rocket-animation-container">
          <div className="rocket-icon"><FaRocket /></div>
          <div className="rocket-icon delay-1"><FaRocket /></div>
          <div className="rocket-icon delay-2"><FaRocket /></div>
        </div>

        <h2>Mise à Jour Disponible !</h2>
        <p className="lead-text">
          Une nouvelle version de GTY Express est prête. Mettez à jour pour profiter des dernières améliorations.
        </p>
        
        {/* Section d'information sur la version */}
        <div className="version-details">
          <div className="info-item">
            <span className="label"><span className="info-icon">#️⃣</span> Version</span>
            <span className="value">{appVersion}</span>
          </div>
          <div className="info-item">
            <span className="label"><span className="info-icon">📦</span> Build</span>
            <span className="value">{commitHash}</span>
          </div>
        </div>

        <div className="buttons-container">
          <Button className="update-button" onClick={onConfirmUpdate}>
            Mettre à jour maintenant
          </Button>
          <Button className="later-button" onClick={handleClose}>
            Plus tard
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateModal; 