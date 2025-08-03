import React from 'react';
import { ListGroup, Image, Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const ChatSidebar = ({ conversations, onSelectConversation, selectedConversationId }) => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <ListGroup variant="flush" className="chat-sidebar">
      {conversations && conversations.map((convo) => {
        const otherParticipant = convo.participants.find(p => p._id !== userInfo._id);
        const lastMessageText = convo.lastMessage?.text ? `${convo.lastMessage.text.substring(0, 25)}...` : "Démarrez la conversation";

        return (
          <ListGroup.Item
            key={convo._id}
            action
            active={convo._id === selectedConversationId}
            onClick={() => onSelectConversation(convo._id)}
            className="d-flex justify-content-between align-items-start"
          >
            <Image src={otherParticipant?.profilePicture || 'https://i.imgur.com/Suf6O8w.png'} roundedCircle width={40} height={40} />
            <div className="ms-2 me-auto">
              <div className="fw-bold">{otherParticipant?.name || "Utilisateur"}</div>
              {/* Le texte du dernier message est en gras si non lu */}
              <small className={convo.isUnread ? 'fw-bold' : ''}>{lastMessageText}</small>
            </div>
            {/* La pastille est plus visible */}
            {convo.isUnread && <Badge bg="primary" pill>!</Badge>}
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
};

export default ChatSidebar;