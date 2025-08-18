// src/components/UpdateModal.jsx

import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { FaRocket, FaInfoCircle, FaCalendarAlt, FaCodeBranch } from 'react-icons/fa';
import './UpdateModal.css';

const UpdateModal = ({ show, handleClose, onConfirmUpdate, newVersionInfo, isUpdating }) => {

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
        
        <div className="update-notice">
          <strong>Note pour l'application installée :</strong> Il peut être nécessaire de cliquer plusieurs fois sur "Mettre à jour" le temps que le système finalise l'installation en arrière-plan.
        </div>

        <div className="version-details">
          <div className="info-item">
            <span className="label"><FaInfoCircle className="info-icon" /> Nouvelle Version</span>
            <span className="value">{displayVersion}</span>
          </div>
          <div className="info-item">
            <span className="label"><FaCodeBranch className="info-icon" /> Editeur</span>
            <span className="value">GTY Express dev Team</span>
          </div>
          <div className="info-item">
            <span className="label"><FaCalendarAlt className="info-icon" /> Date</span>
            <span className="value">{formattedDate}</span>
          </div>
        </div>

        <div className="buttons-container">
          <Button className="update-button" onClick={onConfirmUpdate} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Installation...</span>
              </>
            ) : (
              'Mettre à jour maintenant'
            )}
          </Button>
          <Button className="later-button" onClick={handleClose} disabled={isUpdating}>
            Plus tard
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateModal;