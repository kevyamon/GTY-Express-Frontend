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
      // Pour un client, le destinataire est toujours l'admin
      if (!userInfo.isAdmin) {
        if (selectedConversation) {
            recipientId = selectedConversation.participants.find(p => p.isAdmin)?._id;
        }
      } 
      // Pour un admin, le destinataire est l'autre participant
      else {
        if (!selectedConversation) return;
        recipientId = selectedConversation.participants.find(p => p._id !== userInfo._id)?._id;
      }
      await sendMessage({ ...messageData, recipientId }).unwrap();
    } catch (error) { 
        console.error('Failed to send message:', error);
    }
  };

  if (isLoading) {
    return <div className="d-flex justify-content-center align-items-center h-100"><Spinner /></div>;
  }

  return (
    <Container className="my-4">
      <h1 className="mb-4">Messagerie</h1>

      {/* --- Pour un client qui n'a pas encore de conversation --- */}
      {!userInfo.isAdmin && (!conversations || conversations.length === 0) && (
        <div className="text-center">
            <Message variant="info">Vous n'avez pas encore de conversation.</Message>
            <Button className="mt-3" onClick={() => handleOpenConversation(null)}>
                Démarrer une conversation avec le service client
            </Button>
        </div>
      )}

      {/* --- Liste des conversations pour admin ou client avec historique --- */}
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
                              <div className="fw-bold">{otherParticipant.name}</div>
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

      {/* --- La Fenêtre Pop-up (Modale) --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Conversation avec {
              selectedConversation?.participants.find(p => p._id !== userInfo._id)?.name || 'Service Client'
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="chat-modal-body">
            {/* On s'assure que MessageContainer a bien un ID de conversation avant de s'afficher */}
            {selectedConversation ? (
                <MessageContainer 
                    conversationId={selectedConversation._id} 
                    onSendMessage={handleSendMessage} 
                />
            ) : !userInfo.isAdmin ? ( // Cas où un client démarre une nouvelle conversation
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