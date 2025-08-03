import React, { useRef, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const MessageContainer = ({ messages = [], onSendMessage }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const messageEndRef = useRef(null);
  const [text, setText] = React.useState('');

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText('');
    }
  };

  const isNewDay = (msg1, msg2) => {
    if (!msg2) return true; // Toujours afficher la date pour le premier message
    const date1 = new Date(msg1.createdAt).toLocaleDateString();
    const date2 = new Date(msg2.createdAt).toLocaleDateString();
    return date1 !== date2;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toLocaleDateString() === today.toLocaleDateString()) {
      return "AUJOURD'HUI";
    }
    if (date.toLocaleDateString() === yesterday.toLocaleDateString()) {
      return "HIER";
    }
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  return (
    <div className="message-container">
      <div className="messages-area">
        {messages.map((msg, index) => {
          const showDate = isNewDay(msg, messages[index - 1]);
          const messageAlignment = msg.sender._id === userInfo._id ? 'sent' : 'received';

          return (
            <React.Fragment key={msg._id}>
              {showDate && (
                <div className="date-separator">
                  {formatDate(msg.createdAt)}
                </div>
              )}
              <div className={`message-wrapper ${messageAlignment}`}>
                <div className={`message-bubble ${messageAlignment}`}>
                  {msg.text}
                </div>
                <span className="message-timestamp">
                  {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </React.Fragment>
          );
        })}
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