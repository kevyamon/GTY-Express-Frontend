import React from 'react';
import { Modal, ListGroup, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux'; // <-- On importe useDispatch
import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaBullhorn, FaSyncAlt, FaUser, FaLightbulb, FaSignOutAlt } from 'react-icons/fa';
import { setIsModalOpen } from '../slices/pwaSlice'; // <-- On importe l'action
import './MobileMenuModal.css';

const MobileMenuModal = ({ 
  show, 
  handleClose, 
  userInfo, 
  totalAdminCount, 
  logoutHandler,
  handleAdminModal,
}) => {
  const dispatch = useDispatch();

  // --- MODIFICATION : Logique de mise à jour identique au Header ---
  const { isUpdateAvailable, isUpdateInProgress, isModalOpen } = useSelector((state) => state.pwa);

  const handleUpdateClick = () => {
    if (isUpdateAvailable) {
      dispatch(setIsModalOpen(true));
    }
  };

  const showUpdateButton = isUpdateAvailable || isUpdateInProgress;
  const shouldBlink = isUpdateInProgress || (isUpdateAvailable && !isModalOpen);

  const getIconColor = () => {
    if (isUpdateAvailable && !isModalOpen) return '#dc3545'; // Rouge si refusé
    if (isUpdateInProgress) return '#ffc107'; // Jaune si en cours
    if (isUpdateAvailable) return '#198754'; // Vert si disponible
    return '#6c757d';
  };
  
  const getBadgeVariant = () => {
    if (isUpdateInProgress) return 'warning';
    if (isUpdateAvailable && !isModalOpen) return 'danger';
    if (isUpdateAvailable) return 'success';
    return '';
  };

  const getBadgeText = () => {
    if (isUpdateInProgress) return 'En cours...';
    if (isUpdateAvailable && !isModalOpen) return 'Requise';
    if (isUpdateAvailable) return 'Prête';
    return '';
  };
  // --- FIN DE LA MODIFICATION ---

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

          {showUpdateButton && (
            <ListGroup.Item 
              action 
              onClick={() => handleLinkClick(handleUpdateClick)} 
              className={`d-flex justify-content-between align-items-center ${shouldBlink ? 'update-available-blink' : ''}`}
            >
              <div>
                <FaSyncAlt style={{ color: getIconColor() }} />
                <span className="ms-3">Mise à jour</span>
              </div>
              <Badge bg={getBadgeVariant()}>{getBadgeText()}</Badge>
            </ListGroup.Item>
          )}

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