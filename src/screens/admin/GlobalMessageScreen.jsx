import React, { useState } from 'react';
import { Form, Button, Card, Spinner, Container } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useCreateGlobalMessageMutation } from '../../slices/globalMessageApiSlice';

const GlobalMessageScreen = () => {
  const [message, setMessage] = useState('');
  const [createGlobalMessage, { isLoading }] = useCreateGlobalMessageMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Le message ne peut pas être vide.');
      return;
    }
    if (window.confirm('Êtes-vous sûr de vouloir envoyer ce message à TOUS les utilisateurs ? Cette action est irréversible et remplacera toute annonce précédente.')) {
      try {
        await createGlobalMessage({ message }).unwrap();
        toast.success('Annonce globale envoyée avec succès !');
        setMessage('');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Container>
      <h1 className="my-4">📢 Envoyer une Annonce Globale</h1>
      <Card>
        <Card.Header>Nouveau Message</Card.Header>
        <Card.Body>
          <Card.Text>
            Le message que vous envoyez ici apparaîtra sous forme de pop-up pour tous les utilisateurs connectés.
            L'envoi d'un nouveau message désactivera automatiquement l'ancien.
          </Card.Text>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="globalMessageText">
              <Form.Control
                as="textarea"
                rows={8}
                placeholder="Écrivez votre message ici... Il sera visible par tous."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  {' '}Envoi en cours...
                </>
              ) : (
                'Envoyer à tous les utilisateurs'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GlobalMessageScreen;