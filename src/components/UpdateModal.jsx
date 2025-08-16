import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaRocket } from 'react-icons/fa';
import './UpdateModal.css';

// --- MODIFICATION : Le composant est maintenant plus simple ---
// Il reçoit directement les fonctions 'handleClose' et 'onConfirmUpdate' de son parent (PWAManager).
const UpdateModal = ({ show, handleClose, onConfirmUpdate }) => {

  const handleUpdate = () => {
    // Il appelle simplement la fonction pour mettre à jour que le PWAManager lui a fournie.
    onConfirmUpdate(); 
  };

  const handleLater = () => {
    // Il appelle la fonction pour fermer que le PWAManager lui a fournie.
    handleClose();
    // Et il affiche le message informatif comme tu l'as demandé.
    toast.info('Vous pouvez mettre à jour à tout moment depuis le bouton "Màj".');
  };

  return (
    <Modal show={show} onHide={handleLater} centered backdrop="static" keyboard={false} dialogClassName="update-modal-dialog">
      <Modal.Body className="update-modal-body">
        <div className="rocket-animation-container">
          <div className="rocket-icon"><FaRocket /></div>
          <div className="rocket-icon delay-1"><FaRocket /></div>
          <div className="rocket-icon delay-2"><FaRocket /></div>
        </div>

        <h2>Mise à Jour Disponible !</h2>
        <p className="lead-text">
          Une nouvelle version de GTY Express est prête à être installée pour améliorer votre expérience.
        </p>

        <div className="buttons-container" style={{marginTop: '1.5rem'}}>
          <Button className="update-button" onClick={handleUpdate}>
            Mettre à jour maintenant
          </Button>
          <Button className="later-button" onClick={handleLater}>
            Plus tard
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateModal;