import React, { useState } from 'react';
import { Container, Row, Col, ListGroup, Image, Badge, Spinner, Button, Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useGetConversationsQuery, useSendMessageMutation } from '../slices/messageApiSlice';
import MessageContainer from '../components/MessageContainer';
import Message from '../components/Message';
import './ChatScreen.css';

const ChatScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: conversations, isLoading } = useGetConversationsQuery();
  const [sendMessage] = useSendMessageMutation();

  const [showModal, setShowModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

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

  // --- NOUVELLE FONCTION POUR AFFICHER LE BADGE DE RÔLE ---
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

      {!userInfo.isAdmin && (!conversations || conversations.length === 0) && (
        <div className="text-center">
            <Message variant="info">Vous n'avez pas encore de conversation.</Message>
            <Button className="mt-3" onClick={() => handleOpenConversation(null)}>
                Démarrer une conversation avec le service client
            </Button>
        </div>
      )}

      {(userInfo.isAdmin || (conversations && conversations.length > 0)) && (
        <ListGroup variant="flush">
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
                          {convo.isUnread && (
                              <Col xs="auto">
                                  <Badge bg="primary" pill>!</Badge>
                              </Col>
                          )}
                      </Row>
                  </ListGroup.Item>
              )
          })}
        </ListGroup>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {/* --- EN-TÊTE AMÉLIORÉ AVEC PHOTO ET RÔLE --- */}
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