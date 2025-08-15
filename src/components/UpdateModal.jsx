import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaRocket, FaInfoCircle, FaWrench, FaCommentDots, FaMobileAlt, FaClock } from 'react-icons/fa';
import './UpdateModal.css';
import logo from '/logo.png';

const UpdateModal = ({ show, handleClose, version, deployedAt, onConfirm, onCritique }) => {
  
  // Petite fonction pour formater la date joliment
  const formatDate = (dateString) => {
    if (!dateString) return 'Information non disponible';
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false}>
      <Modal.Body className="update-modal-body">
        <div className="update-modal-icon">
          <FaRocket />
        </div>
        <h2>Mise à Jour Disponible !</h2>
        <p className="lead-text">Une nouvelle version de GTY Express vient d'être déployée.</p>
        
        <div className="version-info-grid">
          <div>
            <FaInfoCircle className="info-icon" />
            <strong>Nouvelle version</strong>
            <span>{version}</span>
          </div>
          {/* --- NOUVELLE SECTION POUR LA DATE --- */}
          <div>
            <FaClock className="info-icon" />
            <strong>Déployée le</strong>
            <span>{formatDate(deployedAt)}</span>
          </div>
          {/* --- FIN DE L'AJOUT --- */}
          <div>
            <img src={logo} alt="GTY Express" className="editor-logo" />
            <strong>Éditeur</strong>
            <span>GTY Express Team</span>
          </div>
          <div>
            <FaWrench className="info-icon" />
            <strong>Correctifs</strong>
            <span>Amélioration de la stabilité et des performances.</span>
          </div>
          <div>
            <FaMobileAlt className="info-icon" />
            <strong>Astuce mobile</strong>
            <span>Si vous êtes sur mobile, glissez vers le bas, ou utilisez la fonction de votre navigateur après avoir refermer cette fenêtre</span>
          </div>
        </div>

        <div className="update-actions">
          <Button variant="info" onClick={onCritique}>
            <FaCommentDots className="me-2"/>Critiquer la version
          </Button>
          <Button variant="secondary" onClick={handleClose}>Plus tard</Button>
          <Button variant="primary" onClick={onConfirm}>Actualiser</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateModal;