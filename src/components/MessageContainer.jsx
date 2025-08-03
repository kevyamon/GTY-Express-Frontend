import React, { useRef, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const MessageContainer = ({ messages = [], onSendMessage }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const messageEndRef = useRef(null);
  const [text, setText] = React.useState('');

  useEffect(() => {
    // Fait défiler automatiquement vers le dernier message
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <div className="message-container">
      <div className="messages-area">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message-bubble ${msg.sender._id === userInfo._id ? 'sent' : 'received'}`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <Form onSubmit={handleSubmit} className="message-input-form">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Écrivez votre message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button variant="primary" type="submit">Envoyer</Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default MessageContainer;