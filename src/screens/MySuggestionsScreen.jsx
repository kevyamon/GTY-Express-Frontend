import React, { useState } from 'react';
import { Button, ListGroup, Form, Modal, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { 
  useGetMySuggestionsQuery, 
  useUpdateSuggestionMutation, 
  useDeleteSuggestionMutation 
} from '../slices/suggestionApiSlice';

const MySuggestionsScreen = () => {
  // Récupération des données
  const { data: suggestions, isLoading, error } = useGetMySuggestionsQuery();
  const [updateSuggestion, { isLoading: isUpdating }] = useUpdateSuggestionMutation();
  const [deleteSuggestion, { isLoading: isDeleting }] = useDeleteSuggestionMutation();

  // États pour le modal de modification
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [editedText, setEditedText] = useState('');

  // Fonctions pour gérer le modal
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
    <div className="container mt-4">
      <h2 className="mb-4">Mes Suggestions</h2>
      
      {isLoading ? <Spinner animation="border" />
       : error ? <Message variant="danger">{error?.data?.message || error.error}</Message>
       : suggestions.length === 0 ? (
          <Message>
            Vous n'avez envoyé aucune suggestion pour le moment.
          </Message>
        ) : (
        <ListGroup>
          {suggestions.map((suggestion) => (
            <ListGroup.Item key={suggestion._id} className="d-flex justify-content-between align-items-center">
              <div>
                <p className="mb-1">{suggestion.text}</p>
                <small className="text-muted">
                  Envoyé le {new Date(suggestion.createdAt).toLocaleDateString('fr-FR')}
                </small>
              </div>
              <div>
                <Button variant="light" size="sm" className="me-2" onClick={() => handleShowEditModal(suggestion)}>
                  <FaEdit />
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(suggestion._id)} disabled={isDeleting}>
                  <FaTrash />
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* --- Modal de Modification --- */}
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