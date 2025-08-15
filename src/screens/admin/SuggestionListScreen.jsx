import React from 'react';
import { Table, Button, Spinner, Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import { useGetSuggestionsQuery, useArchiveSuggestionMutation } from '../../slices/suggestionApiSlice';

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
    <div className="container mt-4">
      <h1 className="mb-4">Boîte à Suggestions</h1>
      
      {suggestions.length === 0 ? (
        <Message>Aucune suggestion n'a été envoyée pour le moment.</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>DATE</th>
              <th>UTILISATEUR</th>
              <th>SUGGESTION</th>
              <th>STATUT (POUR VOUS)</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map((suggestion) => {
              const isArchivedByCurrentUser = suggestion.archivedBy.includes(userInfo._id);
              return (
                <tr key={suggestion._id} style={{ opacity: isArchivedByCurrentUser ? 0.6 : 1 }}>
                  <td>{new Date(suggestion.createdAt).toLocaleString('fr-FR')}</td>
                  <td>{suggestion.user?.name || 'Utilisateur inconnu'}</td>
                  <td style={{ whiteSpace: 'pre-wrap', maxWidth: '400px' }}>{suggestion.text}</td>
                  <td>
                    <Badge bg={isArchivedByCurrentUser ? 'secondary' : 'success'}>
                      {isArchivedByCurrentUser ? 'Archivé' : 'Nouveau'}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant={isArchivedByCurrentUser ? 'info' : 'secondary'}
                      size="sm"
                      onClick={() => handleArchiveToggle(suggestion)}
                      disabled={isArchiving}
                    >
                      {isArchivedByCurrentUser ? 'Désarchiver' : 'Archiver'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default SuggestionListScreen;