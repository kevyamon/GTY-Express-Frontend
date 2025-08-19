import React, { useState, useEffect } from 'react';
import { Container, Row, Col, ListGroup, Image, Badge, Spinner, Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FaArchive, FaInbox } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { 
  useGetConversationsQuery, 
  useGetArchivedConversationsQuery,
  useSendMessageMutation,
  useArchiveConversationMutation,
  useMarkAsReadMutation,
} from '../slices/messageApiSlice';
import MessageContainer from '../components/MessageContainer';
import Message from '../components/Message';
import './ChatScreen.css';

const ChatScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // --- AMÉLIORATION : Gestion de la vue active/archivée ---
  const [showArchived, setShowArchived] = useState(false);

  const { data: activeConversations, isLoading: isLoadingActive } = useGetConversationsQuery(undefined, { skip: showArchived });
  const { data: archivedConversations, isLoading: isLoadingArchived } = useGetArchivedConversationsQuery(undefined, { skip: !showArchived || !userInfo.isAdmin });
  
  const conversations = showArchived ? archivedConversations : activeConversations;
  const isLoading = showArchived ? isLoadingArchived : isLoadingActive;
  // --- FIN DE L'AMÉLIORATION ---

  const [sendMessage] = useSendMessageMutation();
  const [archiveConversation, { isLoading: isArchiving }] = useArchiveConversationMutation();
  const [markAsRead] = useMarkAsReadMutation();

  const [showModal, setShowModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const handleOpenConversation = async (convo) => {
    // --- CORRECTION : Marquer comme lu uniquement au clic ---
    if (convo && convo.isUnread) {
        try {
            await markAsRead(convo._id).unwrap();
        } catch (error) {
            console.error("Erreur pour marquer comme lu", error);
        }
    }
    setSelectedConversation(convo);
    setShowModal(true);
  };

  const handleSendMessage = async (messageData) => {
    try {
      let recipientId;
      const currentConvo = selectedConversation || conversations?.find(c => c.participants.some(p => !p.isAdmin));

      if (!userInfo.isAdmin) {
        if (currentConvo) {
            recipientId = currentConvo.participants.find(p => p.isAdmin)?._id;
        }
      } else {
        if (!currentConvo) return;
        recipientId = currentConvo.participants.find(p => p._id !== userInfo._id)?._id;
      }
      await sendMessage({ ...messageData, recipientId }).unwrap();
    } catch (error) { 
        console.error('Failed to send message:', error);
    }
  };

  const handleArchive = async (e, convoId) => {
    e.stopPropagation(); // Empêche l'ouverture du chat
    try {
      await archiveConversation(convoId).unwrap();
      toast.info(`Conversation ${showArchived ? 'désarchivée' : 'archivée'}`);
    } catch (error) {
      toast.error("L'archivage a échoué");
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
      <Row className="align-items-center mb-4">
        <Col><h1>Messagerie</h1></Col>
        {userInfo.isAdmin && (
            <Col xs="auto">
                <Button variant="outline-secondary" onClick={() => setShowArchived(!showArchived)}>
                    {showArchived ? <FaInbox className="me-2" /> : <FaArchive className="me-2" />}
                    {showArchived ? 'Boîte de réception' : 'Voir les archives'}
                </Button>
            </Col>
        )}
      </Row>

      {!userInfo.isAdmin && (!conversations || conversations.length === 0) && (
        <div className="text-center">
            <Message variant="info">Vous n'avez pas encore de conversation.</Message>
            <Button className="mt-3" onClick={() => handleOpenConversation(null)}>
                Démarrer une conversation avec le service client
            </Button>
        </div>
      )}

      {conversations && conversations.length === 0 && (
        <Message variant='info'>
            {showArchived ? "Aucune conversation n'a été archivée." : "Vous n'avez aucune conversation active."}
        </Message>
      )}

      {(userInfo.isAdmin || (conversations && conversations.length > 0)) && (
        <ListGroup variant="flush" className="conversation-list-container">
          {conversations.map(convo => {
              const otherParticipant = convo.participants.find(p => p._id !== userInfo._id);
              if (!otherParticipant) return null;
              return (
                  <ListGroup.Item 
                      key={convo._id} 
                      onClick={() => handleOpenConversation(convo)} 
                      action
                      className={`conversation-list-item ${convo.isUnread ? 'unread' : ''}`}
                  >
                      <Row className="align-items-center">
                          <Col xs="auto">
                              <Image src={otherParticipant.profilePicture || 'https://i.imgur.com/Suf6O8w.png'} roundedCircle width={50} height={50} />
                          </Col>
                          <Col>
                              <div className="fw-bold d-flex align-items-center">
                                  {otherParticipant.name}
                                  {getRoleBadge(otherParticipant)}
                              </div>
                              <small className={convo.isUnread ? 'fw-bold' : 'text-muted'}>
                                  {convo.lastMessage?.text.substring(0, 40)}...
                              </small>
                          </Col>
                          <Col xs="auto" className="d-flex align-items-center">
                            {convo.isUnread && <Badge bg="primary" pill>!</Badge>}
                            {userInfo.isAdmin && (
                                <Button
                                    variant="light"
                                    size="sm"
                                    className="archive-btn"
                                    onClick={(e) => handleArchive(e, convo._id)}
                                    disabled={isArchiving}
                                    title={showArchived ? 'Désarchiver' : 'Archiver'}
                                >
                                    {showArchived ? <FaInbox /> : <FaArchive />}
                                </Button>
                            )}
                          </Col>
                      </Row>
                  </ListGroup.Item>
              )
          })}
        </ListGroup>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="d-flex align-items-center">
                <Image 
                    src={selectedConversation?.participants.find(p => p._id !== userInfo._id)?.profilePicture || 'https://i.imgur.com/Suf6O8w.png'} 
                    roundedCircle width={40} height={40} className="me-3"
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