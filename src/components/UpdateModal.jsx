// src/components/UpdateModal.jsx
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaRocket } from 'react-icons/fa';
import './UpdateModal.css';

const UpdateModal = ({ show, newVersion }) => {

  const handleUpdate = () => {
    window.location.reload();
  };

  return (
    <Modal show={show} centered backdrop="static" keyboard={false}>
      <Modal.Body className="update-modal-body">
        <div className="update-modal-icon">
          <FaRocket />
        </div>
        <h2>Mise à Jour Disponible !</h2>
        <p className="lead-text">
          Une nouvelle version de GTY Express vient d'être déployée pour améliorer votre expérience.
        </p>
        
        <div className="version-info-grid">
          <div>
            <strong>Nouvelle version disponible</strong>
            <span>{newVersion}</span>
          </div>
        </div>

        <Button variant="primary" onClick={handleUpdate} size="lg">
          Installer et recharger
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateModal;