import React, { useState } from 'react';
import { Container, Row, Col, ListGroup, Image, Badge, Spinner, Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'; // Ajout de toast
import { 
  useGetConversationsQuery, 
  useSendMessageMutation,
  // --- DÉBUT DES AJOUTS ---
  useGetArchivedConversationsQuery,
  useArchiveConversationMutation
  // --- FIN DES AJOUTS ---
} from '../slices/messageApiSlice';
import MessageContainer from '../components/MessageContainer';
import Message from '../components/Message';
import ChatSidebar from '../components/ChatSidebar'; // On importe le composant
import './ChatScreen.css';

const ChatScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  
  // --- DÉBUT DES MODIFICATIONS ---
  const [showModal, setShowModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isShowingArchived, setIsShowingArchived] = useState(false);

  // On utilise un hook conditionnellement basé sur l'état
  const { data: activeConversations, isLoading: isLoadingActive } = useGetConversationsQuery(undefined, { skip: isShowingArchived });
  const { data: archivedConversations, isLoading: isLoadingArchived } = useGetArchivedConversationsQuery(undefined, { skip: !isShowingArchived });

  const [archiveConversation] = useArchiveConversationMutation();
  const [sendMessage] = useSendMessageMutation();

  const conversations = isShowingArchived ? archivedConversations : activeConversations;
  const isLoading = isShowingArchived ? isLoadingArchived : isLoadingActive;

  const handleArchiveToggle = async (conversationId) => {
    try {
      await archiveConversation(conversationId).unwrap();
      toast.info(`Conversation ${isShowingArchived ? 'désarchivée' : 'archivée'}.`);
      // Si la conversation archivée était celle sélectionnée, on la déselectionne
      if (selectedConversation && selectedConversation._id === conversationId) {
        setSelectedConversation(null);
        setShowModal(false);
      }
    } catch (err) {
      toast.error("Une erreur s'est produite.");
    }
  };
  // --- FIN DES MODIFICATIONS ---

  const handleOpenConversation = (convo) => {
    setSelectedConversation(convo);
    setShowModal(true);
  };

  const handleSendMessage = async (messageData) => {
    try {
      let recipientId;
      if (!userInfo.isAdmin) {
        if (selectedConversation) {
            recipientId = selectedConversation.participants.find(p => p.isAdmin)?._id;
        }
      } 
      else {
        if (!selectedConversation) return;
        recipientId = selectedConversation.participants.find(p => p._id !== userInfo._id)?._id;
      }
      await sendMessage({ ...messageData, recipientId }).unwrap();
    } catch (error) { 
        console.error('Failed to send message:', error);
    }
  };
  
  const getRoleBadge = (user) => {
    if (!user) return null;
    if (user.isAdmin) {
      return <Badge bg="primary" className="ms-2">Admin</Badge>;
    }
    return <Badge bg="secondary" className="ms-2">Client</Badge>;
  };
  
  if (isLoading) {
    return <div className="d-flex justify-content-center align-items-center h-100"><Spinner /></div>;
  }

  return (
    <Container className="my-4">
      <h1 className="mb-4">Messagerie</h1>

      {/* --- DÉBUT DES MODIFICATIONS --- */}
      {/* On remplace la ListGroup par le nouveau composant ChatSidebar */}
      <Row>
        <Col md={4}>
          <ChatSidebar
            conversations={conversations}
            onSelectConversation={handleOpenConversation}
            selectedConversationId={selectedConversation?._id}
            onArchiveToggle={handleArchiveToggle}
            onShowArchived={() => setIsShowingArchived(!isShowingArchived)}
            isShowingArchived={isShowingArchived}
          />
           {/* Logique pour le client qui n'a aucune conversation active */}
          {!userInfo.isAdmin && (!conversations || conversations.length === 0) && !isShowingArchived && (
            <div className="text-center mt-3">
                <Message variant="info">Vous n'avez pas encore de conversation.</Message>
                <Button className="mt-3" onClick={() => handleOpenConversation(null)}>
                    Démarrer une conversation
                </Button>
            </div>
          )}
        </Col>
        <Col md={8}>
          {/* Cette partie ne change pas, elle est maintenant dans le modal */}
        </Col>
      </Row>
      {/* --- FIN DES MODIFICATIONS --- */}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="d-flex align-items-center">
                <Image 
                    src={selectedConversation?.participants.find(p => p._id !== userInfo._id)?.profilePicture || 'https://i.imgur.com/Suf6O8w.png'} 
                    roundedCircle 
                    width={40} 
                    height={40} 
                    className="me-3"
                />
                <div>
                    Conversation avec {selectedConversation?.participants.find(p => p._id !== userInfo._id)?.name || 'Service Client'}
                    {getRoleBadge(selectedConversation?.participants.find(p => p._id !== userInfo._id))}
                </div>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="chat-modal-body">
            {selectedConversation ? (
                <MessageContainer 
                    conversationId={selectedConversation._id} 
                    onSendMessage={handleSendMessage} 
                />
            ) : !userInfo.isAdmin ? (
                <MessageContainer 
                    conversationId="new" 
                    onSendMessage={handleSendMessage}
                />
            ) : null}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ChatScreen;