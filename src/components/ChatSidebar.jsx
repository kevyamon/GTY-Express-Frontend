import React from 'react';
import { ListGroup, Image, Badge, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FaArchive, FaInbox } from 'react-icons/fa';
import './ChatSidebar.css';

const ChatSidebar = ({ 
  conversations, 
  onSelectConversation, 
  selectedConversationId,
  onArchiveToggle,
  onShowArchived,
  isShowingArchived,
}) => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <ListGroup variant="flush" className="chat-sidebar">
      <ListGroup.Item className="archive-toggle-section">
        <Button variant="outline-secondary" size="sm" className="w-100" onClick={onShowArchived}>
          {isShowingArchived ? (
            <><FaInbox className="me-2" /> Boîte de réception</>
          ) : (
            <><FaArchive className="me-2" /> Discussions archivées</>
          )}
        </Button>
      </ListGroup.Item>

      {conversations && conversations.map((convo) => {
        const otherParticipant = convo.participants.find(p => p._id !== userInfo._id);
        const lastMessageText = convo.lastMessage?.text ? `${convo.lastMessage.text.substring(0, 25)}...` : "Démarrez la conversation";

        return (
          <ListGroup.Item
            key={convo._id}
            action
            active={convo._id === selectedConversationId}
            // --- CORRECTION APPLIQUÉE ICI ---
            // On passe l'objet "convo" complet, et non plus seulement son ID.
            onClick={() => onSelectConversation(convo)}
            className="d-flex justify-content-between align-items-start conversation-item"
          >
            <Image src={otherParticipant?.profilePicture || 'https://i.imgur.com/Suf6O8w.png'} roundedCircle width={40} height={40} />
            <div className="ms-2 me-auto">
              <div className="fw-bold">{otherParticipant?.name || "Utilisateur"}</div>
              <small className={convo.isUnread ? 'fw-bold' : ''}>{lastMessageText}</small>
            </div>
            {convo.isUnread && <Badge bg="primary" pill>!</Badge>}
            <Button
              variant="light"
              size="sm"
              className="archive-btn"
              onClick={(e) => {
                e.stopPropagation();
                onArchiveToggle(convo._id);
              }}
            >
              {isShowingArchived ? <FaInbox /> : <FaArchive />}
            </Button>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
};

export default ChatSidebar;