import React from 'react';
import { Modal, ListGroup, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaTachometerAlt, FaUsers, FaBoxOpen, FaClipboardList, FaBullhorn, FaExclamationTriangle, FaImages } from 'react-icons/fa';
import './AdminMenuModal.css';

const AdminMenuModal = ({ 
  show, 
  handleClose, 
  newUsersCount, 
  newOrdersCount, 
  pendingComplaintsCount,
  onNavigate // Renommé pour plus de clarté
}) => {

  const menuItems = [
    { path: '/admin/dashboard', label: 'Tableau de Bord', icon: <FaTachometerAlt />, count: 0, key: null },
    { path: '/admin/userlist', label: 'Gestion Utilisateurs', icon: <FaUsers />, count: newUsersCount, key: 'users' },
    { path: '/admin/orderlist', label: 'Gestion Commandes', icon: <FaClipboardList />, count: newOrdersCount, key: 'orders' },
    { path: '/admin/productlist', label: 'Gestion Produits', icon: <FaBoxOpen />, count: 0, key: null },
    { path: '/admin/complaintlist', label: 'Gestion Réclamations', icon: <FaExclamationTriangle />, count: pendingComplaintsCount, key: 'complaints' },
    { path: '/admin/promotionlist', label: 'Gestion Promotions', icon: <FaBullhorn />, count: 0, key: null },
    { path: '/admin/promobannerlist', label: 'Gestion Bannière', icon: <FaImages />, count: 0, key: null },
  ];

  // La navigation est maintenant gérée par LinkContainer.
  // L'onClick sert juste à mettre à jour les compteurs via onNavigate.
  const handleItemClick = (key) => {
    if (key) {
      onNavigate(key);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Menu Administrateur</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        <ListGroup variant="flush">
          {menuItems.map(item => (
            <LinkContainer to={item.path} key={item.path}>
              <ListGroup.Item 
                action 
                onClick={() => handleItemClick(item.key)}
                className="d-flex justify-content-between align-items-center admin-menu-item"
              >
                <div>
                  {item.icon}
                  <span className="ms-3">{item.label}</span>
                </div>
                {item.count > 0 && <Badge bg="danger" pill>{item.count}</Badge>}
              </ListGroup.Item>
            </LinkContainer>
          ))}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default AdminMenuModal;