import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetActiveGlobalMessageQuery, useDismissGlobalMessageMutation } from '../slices/globalMessageApiSlice';
import './GlobalMessageDisplay.css';

const GlobalMessageDisplay = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // On tente de récupérer un message actif, mais seulement si l'utilisateur est connecté
  const { data: message, isLoading } = useGetActiveGlobalMessageQuery(undefined, {
    skip: !userInfo,
  });

  const [dismissMessage] = useDismissGlobalMessageMutation();

  const handleDismiss = async () => {
    if (!message) return;
    try {
      // On appelle l'API pour dire que l'utilisateur a fermé le message
      await dismissMessage(message._id).unwrap();
    } catch (err) {
      toast.error("Impossible de fermer le message. Veuillez réessayer.");
    }
  };

  // On n'affiche rien si on charge, si l'utilisateur n'est pas connecté ou s'il n'y a pas de message
  if (isLoading || !userInfo || !message) {
    return null;
  }

  return (
    <Modal
      show={true}
      onHide={handleDismiss} // L'utilisateur peut aussi fermer en cliquant à côté
      centered
      dialogClassName="global-message-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="global-message-title">
          <span className="global-message-icon">📢</span> Annonce de GTY Express
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="global-message-text">{message.message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleDismiss}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GlobalMessageDisplay;