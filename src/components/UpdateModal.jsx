import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaRocket, FaInfoCircle, FaCalendarAlt, FaCodeBranch } from 'react-icons/fa';
import './UpdateModal.css';

// --- MODIFICATION IMPORTANTE : On ajoute "newVersionInfo" dans les props ---
const UpdateModal = ({ show, handleClose, onConfirmUpdate, newVersionInfo }) => {

  // On utilise les informations de la nouvelle version si elles existent, sinon on met des valeurs par défaut
  const displayVersion = newVersionInfo?.version || 'Chargement...';
  const commitDateISO = newVersionInfo?.commitDate || new Date().toISOString();

  const formattedDate = new Date(commitDateISO).toLocaleString('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

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
        
        <div className="version-details">
          <div className="info-item">
            <span className="label"><FaInfoCircle className="info-icon" /> Nouvelle Version</span>
            {/* --- MODIFICATION : On affiche la nouvelle version --- */}
            <span className="value">{displayVersion}</span>
          </div>
          <div className="info-item">
            <span className="label"><FaCodeBranch className="info-icon" /> Editeur</span>
            <span className="value">GTY Express dev Team</span>
          </div>
          <div className="info-item">
            <span className="label"><FaCalendarAlt className="info-icon" /> Date</span>
            {/* --- MODIFICATION : On affiche la date de la nouvelle version --- */}
            <span className="value">{formattedDate}</span>
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