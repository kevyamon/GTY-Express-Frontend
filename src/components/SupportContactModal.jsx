import React from 'react';
import { Modal, Button, Stack } from 'react-bootstrap';
import { FaWhatsapp, FaFacebookMessenger, FaEnvelope } from 'react-icons/fa';
import './SupportContactModal.css'; // Nous créerons ce fichier juste après

// Remplacez ces valeurs par vos vrais liens/numéros
const WHATSAPP_LINK = 'https://wa.me/2250768388770'; // Format international
const MESSENGER_LINK = 'https://m.me/votrepagefacebook';
const EMAIL_ADDRESS = 'mailto:amonchristr34@gmail.com';

const SupportContactModal = ({ show, handleClose, onContactChosen }) => {
  const handleContactClick = (url) => {
    onContactChosen(); // Cette fonction fermera l'avertissement principal
    window.open(url, '_blank'); // Ouvre le lien dans un nouvel onglet
    handleClose(); // Ferme ce petit modal
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="sm">
      <Modal.Header closeButton>
        <Modal.Title>Contacter le support</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center">Choisissez un moyen de contact :</p>
        <Stack direction="horizontal" gap={3} className="justify-content-center">
          <Button variant="success" className="contact-icon-btn" onClick={() => handleContactClick(WHATSAPP_LINK)}>
            <FaWhatsapp />
          </Button>
          <Button variant="primary" className="contact-icon-btn" onClick={() => handleContactClick(MESSENGER_LINK)}>
            <FaFacebookMessenger />
          </Button>
          <Button variant="secondary" className="contact-icon-btn" onClick={() => handleContactClick(EMAIL_ADDRESS)}>
            <FaEnvelope />
          </Button>
        </Stack>
      </Modal.Body>
    </Modal>
  );
};

export default SupportContactModal;