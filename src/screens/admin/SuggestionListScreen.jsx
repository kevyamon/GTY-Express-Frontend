import React, { useState } from 'react';
import { Button, Spinner, Badge, Card, Image, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import {
  useGetSuggestionsQuery,
  useGetArchivedSuggestionsQuery, // --- NOUVEL IMPORT ---
  useArchiveSuggestionMutation,
} from '../../slices/suggestionApiSlice';
import { FaArchive, FaInbox, FaLightbulb } from 'react-icons/fa';
import './SuggestionListScreen.css';

const SuggestionListScreen = () => {
  // --- DÉBUT DE LA MODIFICATION DE LA LOGIQUE ---
  const [showArchived, setShowArchived] = useState(false);

  const { data: activeSuggestions, isLoading: isLoadingActive } = useGetSuggestionsQuery(undefined, { skip: showArchived });
  const { data: archivedSuggestions, isLoading: isLoadingArchived } = useGetArchivedSuggestionsQuery(undefined, { skip: !showArchived });

  const suggestions = showArchived ? archivedSuggestions : activeSuggestions;
  const isLoading = showArchived ? isLoadingArchived : isLoadingActive;
  // --- FIN DE LA MODIFICATION DE LA LOGIQUE ---

  const [archiveSuggestion, { isLoading: isArchiving }] = useArchiveSuggestionMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const handleArchiveToggle = async (suggestionId) => {
    try {
      await archiveSuggestion(suggestionId).unwrap();
      toast.info(`Suggestion ${showArchived ? 'désarchivée' : 'archivée'}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) {
    return <div className="text-center"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Message variant='danger'>{error?.data?.message || error.error}</Message>;
  }

  return (
    <div className="suggestions-admin-container">
      <Row className="align-items-center mb-4">
        <Col>
          <h1><FaLightbulb className="me-3" />{showArchived ? 'Suggestions Archivées' : 'Boîte à Suggestions'}</h1>
        </Col>
        <Col xs="auto">
          <Button variant="outline-secondary" onClick={() => setShowArchived(!showArchived)}>
            {showArchived ? <FaInbox className="me-2" /> : <FaArchive className="me-2" />}
            {showArchived ? 'Boîte de réception' : 'Voir les archives'}
          </Button>
        </Col>
      </Row>
      
      {suggestions.length === 0 ? (
        <Message>{showArchived ? "Aucune suggestion n'a été archivée." : "Aucune nouvelle suggestion."}</Message>
      ) : (
        <Row>
          {suggestions.map((suggestion) => (
            <Col lg={12} key={suggestion._id} className="mb-3">
              <Card className="suggestion-admin-card">
                  <Card.Header className="suggestion-card-header">
                      <div className="user-info">
                          <Image 
                              src={suggestion.user?.profilePicture || 'https://i.imgur.com/Suf6O8w.png'} 
                              alt={suggestion.user?.name} 
                              className="user-avatar" 
                          />
                          <div>
                              <div className="user-name">{suggestion.user?.name || 'Utilisateur inconnu'}</div>
                              <div className="suggestion-date">{new Date(suggestion.createdAt).toLocaleString('fr-FR')}</div>
                          </div>
                      </div>
                      <Badge bg={showArchived ? 'secondary' : 'success'}>
                          {showArchived ? 'Traité' : 'Nouveau'}
                      </Badge>
                  </Card.Header>
                  <Card.Body className="suggestion-card-body">
                      <p className="suggestion-text-content">{suggestion.text}</p>
                  </Card.Body>
                  <Card.Footer className="suggestion-card-footer">
                      <Button
                          variant={showArchived ? 'outline-secondary' : 'secondary'}
                          size="sm"
                          onClick={() => handleArchiveToggle(suggestion._id)}
                          disabled={isArchiving}
                      >
                          {showArchived ? <FaInbox className="me-2" /> : <FaArchive className="me-2" />}
                          {showArchived ? 'Désarchiver' : 'Archiver'}
                      </Button>
                  </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default SuggestionListScreen;