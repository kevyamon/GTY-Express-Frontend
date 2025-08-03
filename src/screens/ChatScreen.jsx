import React from 'react';
import { Container } from 'react-bootstrap';
import ChatLayout from '../components/ChatLayout'; // NOUVEL IMPORT

const ChatScreen = () => {
  return (
    <Container fluid>
      <h1 className="my-4">Messagerie Service Client</h1>
      <ChatLayout />
    </Container>
  );
};

export default ChatScreen;