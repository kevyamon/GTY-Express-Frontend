import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaRocket } from 'react-icons/fa';
import './UpdateModal.css';

// --- MODIFICATION : Le composant est simplifié ---
// Il reçoit maintenant directement les fonctions pour confirmer ou fermer.
const UpdateModal = ({ show, handleClose, onConfirmUpdate }) => {

  const handleUpdate = () => {
    // Appelle la fonction de confirmation qui vient du PWAManager.
    onConfirmUpdate(); 
    // Ferme le modal.
    handleClose();
  };

  const handleLater = () => {
    // Ferme le modal.
    handleClose();
    // Affiche un message informatif à l'utilisateur comme demandé.
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