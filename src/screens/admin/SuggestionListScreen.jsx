import React from 'react';
import { Button, Spinner, Badge, Card, Image, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import { useGetSuggestionsQuery, useArchiveSuggestionMutation } from '../../slices/suggestionApiSlice';
import { FaArchive, FaInbox, FaLightbulb } from 'react-icons/fa';
import './SuggestionListScreen.css'; // On importe le nouveau CSS

const SuggestionListScreen = () => {
  const { data: suggestions, isLoading, error } = useGetSuggestionsQuery();
  const [archiveSuggestion, { isLoading: isArchiving }] = useArchiveSuggestionMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const handleArchiveToggle = async (suggestion) => {
    try {
      await archiveSuggestion(suggestion._id).unwrap();
      const isArchived = suggestion.archivedBy.includes(userInfo._id);
      toast.info(`Suggestion ${isArchived ? 'désarchivée' : 'archivée'}`);
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
      <h1 className="mb-4">
        <FaLightbulb className="me-3" />
        Boîte à Suggestions
      </h1>
      
      {suggestions.length === 0 ? (
        <Message>Aucune suggestion n'a été envoyée pour le moment.</Message>
      ) : (
        <Row>
          {suggestions.map((suggestion) => {
            const isArchivedByCurrentUser = suggestion.archivedBy.includes(userInfo._id);
            return (
              <Col lg={12} key={suggestion._id} className="mb-3">
                <Card className={`suggestion-admin-card ${isArchivedByCurrentUser ? 'archived' : ''}`}>
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
                        <Badge bg={isArchivedByCurrentUser ? 'secondary' : 'success'}>
                            {isArchivedByCurrentUser ? 'Traité' : 'Nouveau'}
                        </Badge>
                    </Card.Header>
                    <Card.Body className="suggestion-card-body">
                        <p className="suggestion-text-content">{suggestion.text}</p>
                    </Card.Body>
                    <Card.Footer className="suggestion-card-footer">
                        <Button
                            variant={isArchivedByCurrentUser ? 'outline-secondary' : 'secondary'}
                            size="sm"
                            onClick={() => handleArchiveToggle(suggestion)}
                            disabled={isArchiving}
                        >
                            {isArchivedByCurrentUser ? <FaInbox className="me-2" /> : <FaArchive className="me-2" />}
                            {isArchivedByCurrentUser ? 'Désarchiver' : 'Archiver'}
                        </Button>
                    </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default SuggestionListScreen;