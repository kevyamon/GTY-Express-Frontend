import React, { useState, useEffect } from 'react'; // <-- Ajout de useState et useEffect
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle, FaGift } from 'react-icons/fa';
import './UpdateCompleteModal.css';

const UpdateCompleteModal = ({ show, handleClose }) => {
  // --- NOUVELLE LOGIQUE POUR LIRE LA BONNE VERSION ---
  const [appVersion, setAppVersion] = useState('inconnue');

  useEffect(() => {
    // Ce code s'exécute uniquement quand le modal est sur le point de s'afficher.
    if (show) {
      // On lit la version que notre VersionProvider a sauvegardée.
      const newVersion = sessionStorage.getItem('newAppVersion');
      if (newVersion) {
        setAppVersion(newVersion);
      }
    }
  }, [show]); // Se déclenche à chaque changement de la prop "show"
  // --- FIN DE LA NOUVELLE LOGIQUE ---

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
          {/* Affiche maintenant la version lue depuis le sessionStorage */}
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