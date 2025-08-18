import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux'; // <-- 1. AJOUT
import { FaCheckCircle, FaGift } from 'react-icons/fa';
import { hideLoader } from '../slices/loaderSlice'; // <-- 2. AJOUT
import './UpdateCompleteModal.css';

const UpdateCompleteModal = ({ show, handleClose }) => {
  const [appVersion, setAppVersion] = useState('inconnue');
  const dispatch = useDispatch(); // <-- 3. AJOUT

  useEffect(() => {
    if (show) {
      // --- AMÉLIORATION : On nettoie tout ici ---
      dispatch(hideLoader()); // 4. On s'assure que le loader est bien caché
      sessionStorage.removeItem('pwaUpdateInProgress'); // On nettoie l'indicateur de mise à jour

      const newVersion = sessionStorage.getItem('newAppVersion');
      if (newVersion) {
        setAppVersion(newVersion);
      }
    }
  }, [show, dispatch]); // <-- 5. AJOUT de dispatch

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