import React from 'react';
import { Modal, ListGroup, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux'; // On importe useSelector
import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaBullhorn, FaSyncAlt, FaUser, FaLightbulb, FaSignOutAlt } from 'react-icons/fa';
import './MobileMenuModal.css';

const MobileMenuModal = ({ 
  show, 
  handleClose, 
  userInfo, 
  totalAdminCount, 
  handleUpdateClick, 
  logoutHandler,
  handleAdminModal,
}) => {

  // On se connecte à Redux pour connaître l'état de la mise à jour
  const { isUpdateAvailable, isUpdateInProgress } = useSelector((state) => state.pwa);

  const handleLinkClick = (action) => {
    if (action) action();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} fullscreen="md-down" dialogClassName="mobile-menu-modal" contentClassName="mobile-menu-content">
      <Modal.Header closeButton>
        <Modal.Title>Menu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          {userInfo.isAdmin && (
            <ListGroup.Item action onClick={() => handleLinkClick(handleAdminModal)}>
              <FaTachometerAlt /> Section Admin
              {totalAdminCount > 0 && <Badge bg="danger" pill className="ms-2">{totalAdminCount}</Badge>}
            </ListGroup.Item>
          )}
          
          <LinkContainer to="/products" onClick={() => handleLinkClick()}>
            <ListGroup.Item action><FaBoxOpen /> Tous les produits</ListGroup.Item>
          </LinkContainer>

          <LinkContainer to="/promotions" onClick={() => handleLinkClick()}>
            <ListGroup.Item action className="promo-link"><FaBullhorn /> PROMO</ListGroup.Item>
          </LinkContainer>

          {/* --- LE BOUTON DE MISE À JOUR MOBILE --- */}
          <ListGroup.Item 
            action 
            onClick={() => handleLinkClick(handleUpdateClick)} 
            className={`d-flex justify-content-between align-items-center ${isUpdateInProgress ? 'update-available-blink' : ''}`}
          >
            <div>
              <FaSyncAlt style={{ color: isUpdateAvailable ? '#198754' : '#6c757d' }} />
              <span className="ms-3">Mise à jour</span>
            </div>
            {isUpdateAvailable && !isUpdateInProgress && <Badge bg="success">Prête</Badge>}
            {isUpdateInProgress && <Badge bg="warning">En cours...</Badge>}
          </ListGroup.Item>

          <ListGroup.Item className="separator">Mon Espace</ListGroup.Item>

          <LinkContainer to="/profile-details" onClick={() => handleLinkClick()}>
            <ListGroup.Item action><FaUser /> Mon Profil</ListGroup.Item>
          </LinkContainer>

          <LinkContainer to="/profile" onClick={() => handleLinkClick()}>
            <ListGroup.Item action><FaClipboardList /> Mes Commandes</ListGroup.Item>
          </LinkContainer>
          
          <LinkContainer to="/profile/suggestions" onClick={() => handleLinkClick()}>
            <ListGroup.Item action><FaLightbulb /> Mes Suggestions</ListGroup.Item>
          </LinkContainer>

          <ListGroup.Item action onClick={() => handleLinkClick(logoutHandler)} className="logout-link">
            <FaSignOutAlt /> Déconnexion
          </ListGroup.Item>

        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default MobileMenuModal;