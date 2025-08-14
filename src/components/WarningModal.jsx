import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useCreateWarningMutation } from '../slices/warningsApiSlice'; // Assurez-vous que le chemin est correct

const WarningModal = ({ show, handleClose, user }) => {
  const [message, setMessage] = useState('');
  const [actions, setActions] = useState({
    contactSupport: false,
    verifyProfile: false,
  });

  const [createWarning, { isLoading }] = useCreateWarningMutation();

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setActions((prev) => ({ ...prev, [name]: checked }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Le message ne peut pas être vide.');
      return;
    }

    try {
      await createWarning({
        userId: user._id,
        message,
        actions,
      }).unwrap();
      toast.success(`Avertissement envoyé à ${user.name}`);
      handleClose();
      setMessage('');
      setActions({ contactSupport: false, verifyProfile: false });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (!user) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Envoyer un avertissement à {user.name}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Form.Group controlId="warningMessage">
            <Form.Label>Message de l'avertissement</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message ici..."
              required
            />
          </Form.Group>
          <hr />
          <Form.Group>
            <Form.Label>Actions suggérées pour l'utilisateur :</Form.Label>
            <Form.Check
              type="checkbox"
              id="contactSupport"
              name="contactSupport"
              label="Contacter le support"
              checked={actions.contactSupport}
              onChange={handleCheckboxChange}
            />
            <Form.Check
              type="checkbox"
              id="verifyProfile"
              name="verifyProfile"
              label="Vérifier Mon Profil"
              checked={actions.verifyProfile}
              onChange={handleCheckboxChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="danger" type="submit" disabled={isLoading}>
            {isLoading ? <Spinner as="span" size="sm" /> : "Envoyer l'avertissement"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default WarningModal;