import React, { useState } from 'react';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useCreateSuggestionMutation } from '../slices/suggestionApiSlice';

const SuggestionModal = ({ show, handleClose }) => {
  const [text, setText] = useState('');

  const [createSuggestion, { isLoading }] = useCreateSuggestionMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      toast.error('La suggestion ne peut pas être vide.');
      return;
    }
    try {
      await createSuggestion({ text }).unwrap();
      toast.success('Merci ! Votre suggestion a bien été envoyée.');
      handleClose(); // Ferme le modal
      setText(''); // Réinitialise le champ de texte
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Envoyer une suggestion</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <p>Votre avis est important pour nous. N'hésitez pas à nous faire part de vos idées d'amélioration.</p>
          <Form.Group controlId="suggestionText">
            <Form.Control
              as="textarea"
              rows={5}
              placeholder="Écrivez votre suggestion ici..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? <Spinner as="span" size="sm" /> : 'Envoyer'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SuggestionModal;