import React, { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useGetConversationsQuery, useGetMessagesQuery, useSendMessageMutation, useMarkAsReadMutation } from '../slices/messageApiSlice';
import ChatSidebar from './ChatSidebar';
import MessageContainer from './MessageContainer';
import Message from './Message';
import '../screens/Chat.css';

const ChatLayout = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const { data: conversations, isLoading: isLoadingConvos } = useGetConversationsQuery();
  const { data: messages } = useGetMessagesQuery(selectedConversationId, {
    skip: !selectedConversationId,
  });
  const [sendMessage] = useSendMessageMutation();
  const [markAsRead] = useMarkAsReadMutation();

  useEffect(() => {
    if (selectedConversationId) {
      const currentConvo = conversations?.find(c => c._id === selectedConversationId);
      if (currentConvo?.isUnread) {
        markAsRead(selectedConversationId);
      }
    }
  }, [selectedConversationId, conversations, markAsRead]);

  const handleSendMessage = async (text) => {
    let recipientId;
    const currentConvo = conversations?.find(c => c._id === selectedConversationId);

    // Si c'est un admin qui envoie
    if (userInfo.isAdmin) {
      if (!currentConvo) return; // Un admin doit sélectionner une conversation
      recipientId = currentConvo.participants.find(p => p._id !== userInfo._id)?._id;
    } 
    // Si c'est un client qui envoie
    else {
      // S'il a déjà une conversation, on prend l'ID de l'admin dedans
      if (currentConvo) {
        recipientId = currentConvo.participants.find(p => p.isAdmin)?._id;
      }
      // S'il n'a pas de conversation, on n'envoie pas de recipientId, le backend le trouvera
    }

    try {
      await sendMessage({ recipientId, text }).unwrap();
    } catch (error) { console.error('Failed to send message:', error); }
  };

  // Logique d'affichage améliorée
  const renderContent = () => {
    if (isLoadingConvos) {
      return <Spinner />;
    }
    // Si c'est un client et qu'il n'a pas de conversation, on lui montre directement l'interface de message
    if (!userInfo.isAdmin && conversations?.length === 0) {
      return <MessageContainer messages={[]} onSendMessage={handleSendMessage} />;
    }
    // Si une conversation est sélectionnée, on montre les messages
    if (selectedConversationId) {
      return <MessageContainer messages={messages} onSendMessage={handleSendMessage} />;
    }
    // Sinon, on invite à sélectionner une conversation
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
          <Message>Sélectionnez une conversation pour commencer à discuter.</Message>
      </div>
    );
  }

  return (
    <div className="chat-layout">
      {/* On n'affiche la barre latérale que si l'utilisateur est admin ou a des conversations */}
      {(userInfo.isAdmin || conversations?.length > 0) && (
        <ChatSidebar 
          conversations={conversations} 
          onSelectConversation={setSelectedConversationId}
          selectedConversationId={selectedConversationId}
        />
      )}
      <div className="message-area-container">
        {renderContent()}
      </div>
    </div>
  );
};

export default ChatLayout;