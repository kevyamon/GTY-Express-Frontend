import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle, FaGift } from 'react-icons/fa';
import './UpdateCompleteModal.css';

const UpdateCompleteModal = ({ show, handleClose }) => {
  // On récupère la version depuis les variables d'environnement injectées par Vite
  const appVersion = import.meta.env.VITE_APP_VERSION || 'inconnue';

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
      dialogClassName="update-complete-modal-dialog"
    >
      <Modal.Body className="update-complete-modal-body">
        <div className="gift-animation-container">
          <FaGift className="gift-icon" />
        </div>

        <h2>Mise à jour terminée !</h2>
        <p className="lead-text">
          GTY Express a été mis à jour avec succès. Profitez des dernières nouveautés !
        </p>

        <div className="version-info">
          Vous utilisez maintenant la version <strong>{appVersion}</strong>
        </div>

        <Button className="close-button" onClick={handleClose}>
          <FaCheckCircle className="me-2" /> C'est noté !
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateCompleteModal;