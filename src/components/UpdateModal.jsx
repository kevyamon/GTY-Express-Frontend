import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaRocket, FaRegCommentDots, FaRegClock, FaCodeBranch, FaCheckCircle, FaWrench } from 'react-icons/fa';
import './UpdateModal.css';

const UpdateModal = ({ show, handleClose, newVersion, deployedAt, onCommentClick }) => {

  const formatDate = (dateString) => {
    if (!dateString) return 'Un instant...';
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const handleUpdate = () => {
    handleClose();
    window.location.reload();
  };

  const handleComment = () => {
    handleClose();
    onCommentClick(); // Appelle la fonction du parent pour ouvrir l'autre modal
  };

  const handleLater = () => {
    handleClose();
    toast.info('Vous pourrez mettre à jour quand vous voulez en cliquant sur le bouton "Màj" en haut.');
  };

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
          Une nouvelle version de GTY Express vient d'être déployée pour améliorer votre expérience.
        </p>

        <div className="version-details">
          <div className="info-item">
            <span className="label"><FaCodeBranch className="info-icon" /> Nouvelle version</span>
            <span className="value">{newVersion}</span>
          </div>
          <div className="info-item">
            <span className="label"><FaRegClock className="info-icon" /> Déployée le</span>
            <span className="value">{formatDate(deployedAt)}</span>
          </div>
          <div className="info-item">
            <span className="label"><FaCheckCircle className="info-icon verified" /> Éditeur</span>
            <span className="value">GTY Express Team</span>
          </div>
          <div className="info-item corrections-info">
            <span className="label"><FaWrench className="info-icon" /> Correctifs</span>
            <ul className="corrections-list">
              <li>Amélioration de la stabilité et des performances.</li>
            </ul>
          </div>
        </div>

        <div className="buttons-container">
          <Button className="update-button" onClick={handleUpdate}>
            Mettre à jour
          </Button>
          <Button className="comment-button" onClick={handleComment}>
            <FaRegCommentDots className="me-2" />
            Commenter la version
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