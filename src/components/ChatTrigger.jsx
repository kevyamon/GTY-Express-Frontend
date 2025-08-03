import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';
import './ChatTrigger.css';

const ChatTrigger = () => {
  const navigate = useNavigate();

  return (
    <button className="chat-trigger-btn" onClick={() => navigate('/chat')} aria-label="Ouvrir la messagerie">
      <FaComments />
    </button>
  );
};

export default ChatTrigger;