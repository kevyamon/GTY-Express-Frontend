import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, ListGroup, Image, Badge, Spinner, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useGetConversationsQuery, useGetMessagesQuery, useSendMessageMutation, useMarkAsReadMutation } from '../slices/messageApiSlice';
import MessageContainer from '../components/MessageContainer';
import Message from '../components/Message';
import './ChatScreen.css';

const ConversationList = ({ conversations }) => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    if (!conversations || conversations.length === 0) {
        return <Message>Aucune conversation pour le moment.</Message>
    }

    return (
        <ListGroup variant="flush">
            {conversations.map(convo => {
                const otherParticipant = convo.participants.find(p => p._id !== userInfo._id);
                if (!otherParticipant) return null;

                return (
                    <ListGroup.Item 
                        key={convo._id} 
                        onClick={() => navigate(`/chat/${convo._id}`)} 
                        className={`conversation-list-item ${convo.isUnread ? 'unread' : ''}`}
                    >
                        <Row className="align-items-center">
                            <Col xs="auto">
                                <Image src={otherParticipant.profilePicture || 'https://i.imgur.com/Suf6O8w.png'} roundedCircle width={50} height={50} />
                            </Col>
                            <Col>
                                <div className="fw-bold">{otherParticipant.name}</div>
                                <small className={convo.isUnread ? 'fw-bold' : 'text-muted'}>
                                    {convo.lastMessage?.text.substring(0, 30)}...
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
    )
};

const ChatScreen = () => {
  const { id: conversationId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const { data: conversations, isLoading } = useGetConversationsQuery();
  const { data: messages } = useGetMessagesQuery(conversationId, {
    skip: !conversationId,
  });
  const [sendMessage] = useSendMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();

  useEffect(() => {
    if (conversationId) {
        const currentConvo = conversations?.find(c => c._id === conversationId);
        if (currentConvo?.isUnread) {
            markAsRead(conversationId);
        }
    }
  }, [conversationId, conversations, markAsRead]);

  // LA LOGIQUE D'ENVOI EST MAINTENANT ICI
  const handleSendMessage = async (messageData) => {
    try {
      let recipientId;
      const currentConvo = conversations?.find(c => c._id === conversationId);

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

  if (isLoading) {
    return <div className="d-flex justify-content-center align-items-center h-100"><Spinner /></div>;
  }

  // Sur mobile
  if (window.innerWidth < 768) {
      if (conversationId) {
          const currentConvo = conversations?.find(c => c._id === conversationId);
          if (!currentConvo && conversations) {
              return <Message variant="warning">Conversation non trouvée.</Message>;
          }
          const otherParticipant = currentConvo?.participants.find(p => p._id !== userInfo._id);
          return (
              <div>
                  <div className="conversation-view-header">
                    <Button variant="light" onClick={() => navigate('/chat')} className="back-btn">←</Button>
                    <strong>{otherParticipant?.name || 'Support'}</strong>
                  </div>
                  <MessageContainer conversationId={conversationId} messages={messages} onSendMessage={handleSendMessage} />
              </div>
          )
      }
      return <ConversationList conversations={conversations} />;
  }

  // Sur desktop
  return (
    <Container fluid>
      <Row style={{ height: '80vh' }}>
        <Col md={4} className="border-end">
          <h2 className="p-3">Conversations</h2>
          <ConversationList conversations={conversations} />
        </Col>
        <Col md={8}>
          {conversationId ? (
            <MessageContainer conversationId={conversationId} messages={messages} onSendMessage={handleSendMessage} />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100">
                <Message>Sélectionnez une conversation pour commencer à discuter.</Message>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ChatScreen;