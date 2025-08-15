import React from 'react';
import { Modal, ListGroup, Badge, Image } from 'react-bootstrap';

const UserInfoModal = ({ user, show, handleClose }) => {
  if (!user) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Image 
            src={user.profilePicture || 'https://i.imgur.com/Suf6O8w.png'} 
            alt={user.name} 
            roundedCircle 
            style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }}
          />
          Détails de {user.name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>ID Utilisateur :</strong> {user._id}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Nom complet :</strong> {user.name}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Email :</strong> <a href={`mailto:${user.email}`}>{user.email}</a>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Téléphone :</strong> {user.phone}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Rôle :</strong> 
            {user.isAdmin ? <Badge bg="primary">Admin</Badge> : <Badge bg="secondary">Client</Badge>}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Statut :</strong> 
            {user.status === 'active' ? <Badge bg="success">Actif</Badge> : <Badge bg="danger">Banni</Badge>}
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Inscrit le :</strong> {formatDate(user.createdAt)}
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default UserInfoModal;