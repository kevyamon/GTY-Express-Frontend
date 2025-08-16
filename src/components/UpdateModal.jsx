import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaRocket, FaRegCommentDots, FaRegClock, FaCodeBranch, FaCheckCircle, FaWrench } from 'react-icons/fa';
import './UpdateModal.css';

// --- LE COMPOSANT EST SIMPLIFIÉ ---
const UpdateModal = ({ show, handleClose, onConfirmUpdate }) => {

  const handleUpdate = () => {
    // On appelle la fonction de confirmation qui vient du parent
    onConfirmUpdate(); 
    // On ferme le modal
    handleClose();
  };

  const handleLater = () => {
    handleClose();
    toast.info('Vous pouvez mettre à jour à tout moment en rafraîchissant la page.');
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

        {/* La section des détails a été retirée car ce modal est maintenant un simple prompt */}

        <div className="buttons-container" style={{marginTop: '1.5rem'}}>
          <Button className="update-button" onClick={handleUpdate}>
            Installer et recharger
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