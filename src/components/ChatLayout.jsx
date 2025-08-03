import React, { useState } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useGetConversationsQuery, useGetMessagesQuery, useSendMessageMutation } from '../slices/messageApiSlice';
import ChatSidebar from './ChatSidebar';
import MessageContainer from './MessageContainer';
import Message from './Message';
import '../screens/Chat.css';

const ChatLayout = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const { data: conversations, isLoading: isLoadingConvos } = useGetConversationsQuery();
  const { data: messages, isLoading: isLoadingMessages } = useGetMessagesQuery(selectedConversationId, {
    skip: !selectedConversationId,
  });
  const [sendMessage] = useSendMessageMutation();

  const handleSendMessage = async (text) => {
    let recipientId;

    if (userInfo.isAdmin) {
      const currentConvo = conversations.find(c => c._id === selectedConversationId);
      recipientId = currentConvo.participants.find(p => p._id !== userInfo._id)?._id;
    } else {
      // Pour un client, on cherche l'admin
      const adminInConvo = conversations[0]?.participants.find(p => p.isAdmin);
      recipientId = adminInConvo?._id;
    }

    if (!recipientId && conversations.length === 0) {
      // Si c'est le tout premier message du client (cas spécial)
      // On devra récupérer l'ID de l'admin autrement, pour l'instant on met un placeholder
      // Ceci sera amélioré plus tard
      console.error("Impossible de déterminer l'admin destinataire");
      return;
    }

    try {
      await sendMessage({ recipientId, text }).unwrap();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="chat-layout">
      <ChatSidebar 
        conversations={conversations} 
        onSelectConversation={setSelectedConversationId}
        selectedConversationId={selectedConversationId}
      />
      <div className="message-area-container">
        {isLoadingConvos ? <Spinner /> : 
         selectedConversationId ? 
            <MessageContainer messages={messages} onSendMessage={handleSendMessage} /> :
            <div className="d-flex align-items-center justify-content-center h-100">
                <Message>Sélectionnez une conversation pour commencer.</Message>
            </div>
        }
      </div>
    </div>
  );
};

export default ChatLayout;