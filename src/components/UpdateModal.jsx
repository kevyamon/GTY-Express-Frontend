import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaRocket, FaCommentDots } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './UpdateModal.css';

const UpdateModal = ({ show, newVersion }) => {
  const navigate = useNavigate();

  const handleUpdate = () => {
    window.location.reload();
  };

  const handleComment = () => {
    // Redirige vers la page où les utilisateurs peuvent laisser des suggestions
    navigate('/profile/suggestions'); 
  };

  // On crée une fonction pour gérer le bouton "Plus tard" qui pour l'instant ne fait rien
  // pour ne pas avoir d'erreur. Tu pourras ajouter une logique plus tard si tu veux.
  const handleClose = () => {
    // Pour l'instant, on ne fait rien pour que le modal reste affiché
    // comme demandé implicitement par le backdrop="static".
    // Si tu veux le fermer, tu devras passer une fonction `handleClose` en props.
  };

  return (
    <Modal show={show} centered backdrop="static" keyboard={false} dialogClassName="update-modal-dialog">
      <Modal.Body className="update-modal-body">
        <div className="rocket-animation-container">
          <div className="rocket-icon">
            <FaRocket />
          </div>
          <div className="rocket-icon delay-1">
            <FaRocket />
          </div>
          <div className="rocket-icon delay-2">
            <FaRocket />
          </div>
        </div>

        <h2>Mise à Jour Disponible !</h2>
        <p className="lead-text">
          Une nouvelle version de GTY Express vient d'être déployée pour améliorer votre expérience.
        </p>

        <div className="version-details">
          <div className="version-info">
            <span className="label">Nouvelle version</span>
            <span className="value">{newVersion}</span>
          </div>
          <div className="editor-info">
            <span className="label">Éditeur</span>
            <span className="value">GTY Express Team</span>
          </div>
          <div className="corrections-info">
            <span className="label">Correctifs</span>
            <ul className="corrections-list">
              <li>Amélioration de la stabilité et des performances.</li>
            </ul>
          </div>
        </div>

        <div className="buttons-container">
          <Button variant="secondary" onClick={handleComment}>
            <FaCommentDots className="me-2" />
            Commenter la version
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Mettre à jour
          </Button>
        </div>
        
        <div className="later-button">
          <Button variant="link" onClick={handleClose}>
            Plus tard
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateModal;