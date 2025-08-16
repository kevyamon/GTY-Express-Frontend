import React, { useState } from 'react';
import { Button, ListGroup, Form, Modal, Spinner, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaLightbulb } from 'react-icons/fa';
import Message from '../components/Message';
import { 
  useGetMySuggestionsQuery, 
  useUpdateSuggestionMutation, 
  useDeleteSuggestionMutation 
} from '../slices/suggestionApiSlice';
// --- MODIFICATION : On importe le nouveau fichier CSS ---
import './MySuggestionsScreen.css';

const MySuggestionsScreen = () => {
  const { data: suggestions, isLoading, error } = useGetMySuggestionsQuery();
  const [updateSuggestion, { isLoading: isUpdating }] = useUpdateSuggestionMutation();
  const [deleteSuggestion, { isLoading: isDeleting }] = useDeleteSuggestionMutation();

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [editedText, setEditedText] = useState('');

  const handleShowEditModal = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setEditedText(suggestion.text);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedSuggestion(null);
    setEditedText('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateSuggestion({ suggestionId: selectedSuggestion._id, text: editedText }).unwrap();
      toast.success('Suggestion modifiée');
      handleCloseEditModal();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette suggestion ?')) {
      try {
        await deleteSuggestion(id).unwrap();
        toast.info('Suggestion supprimée');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    // --- MODIFICATION : On utilise un conteneur principal ---
    <div className="suggestions-container">
      <h2 className="text-center mb-4">
        <FaLightbulb className="me-2" /> Mes Suggestions
      </h2>
      
      {isLoading ? <Spinner animation="border" />
       : error ? <Message variant="danger">{error?.data?.message || error.error}</Message>
       : suggestions.length === 0 ? (
          <Message>
            Vous n'avez envoyé aucune suggestion pour le moment.
          </Message>
        ) : (
        // --- MODIFICATION : On utilise un Row pour les cartes ---
        <Row>
          {suggestions.map((suggestion) => (
            <Col md={6} key={suggestion._id} className="mb-3">
              <Card className="suggestion-card">
                <Card.Body>
                  <Card.Text className="suggestion-text">{suggestion.text}</Card.Text>
                  <div className="suggestion-footer">
                    <small className="text-muted">
                      Envoyé le {new Date(suggestion.createdAt).toLocaleDateString('fr-FR')}
                    </small>
                    <div className="suggestion-actions">
                      <Button variant="light" size="sm" onClick={() => handleShowEditModal(suggestion)}>
                        <FaEdit className="me-1" /> Modifier
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(suggestion._id)} disabled={isDeleting}>
                        <FaTrash />
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Le Modal de Modification reste le même */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modifier la suggestion</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdate}>
          <Modal.Body>
            <Form.Group controlId="editedSuggestionText">
              <Form.Control
                as="textarea"
                rows={5}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" disabled={isUpdating}>
              {isUpdating ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default MySuggestionsScreen;