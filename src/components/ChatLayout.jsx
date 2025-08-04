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
    refetchOnMountOrArgChange: true,
  });
  const [sendMessage] = useSendMessageMutation();
  const [markAsRead, { isLoading: isMarkingRead }] = useMarkAsReadMutation();

  useEffect(() => {
    const markConversationAsRead = async () => {
      if (selectedConversationId) {
        const currentConvo = conversations?.find(c => c._id === selectedConversationId);
        if (currentConvo?.isUnread && !isMarkingRead) {
          try {
            await markAsRead(selectedConversationId).unwrap();
          } catch (error) {
            console.error("Failed to mark as read", error);
          }
        }
      }
    };
    markConversationAsRead();
  }, [selectedConversationId, conversations, markAsRead, isMarkingRead]);

  // --- LOGIQUE D'ENVOI CORRIGÉE ET SIMPLIFIÉE ---
  const handleSendMessage = async (messageData) => {
    try {
      let recipientId;
      const currentConvo = conversations?.find(c => c._id === selectedConversationId);

      // Si c'est un client, le destinataire est toujours l'admin
      if (!userInfo.isAdmin) {
        // S'il y a une conversation, on trouve l'admin dedans.
        // Sinon (premier message), on n'envoie pas de recipientId, le backend s'en charge.
        if (currentConvo) {
            recipientId = currentConvo.participants.find(p => p.isAdmin)?._id;
        }
      } 
      // Si c'est un admin, le destinataire est l'autre participant
      else {
        if (!currentConvo) return; 
        recipientId = currentConvo.participants.find(p => p._id !== userInfo._id)?._id;
      }

      await sendMessage({ ...messageData, recipientId }).unwrap();
    } catch (error) { 
        console.error('Failed to send message:', error);
    }
  };

  const renderContent = () => {
    if (isLoadingConvos) {
      return <div className="d-flex justify-content-center align-items-center h-100"><Spinner /></div>;
    }
    // Si c'est un client sans conversation, on lui montre l'interface de message
    if (!userInfo.isAdmin && conversations?.length === 0) {
      // On lui passe un ID de conversation "new" pour qu'il sache que c'est un premier message
      return <MessageContainer conversationId="new" messages={[]} onSendMessage={handleSendMessage} />;
    }
    // Si une conversation est sélectionnée, on montre les messages
    if (selectedConversationId) {
      return <MessageContainer conversationId={selectedConversationId} messages={messages} onSendMessage={handleSendMessage} />;
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
      {(userInfo.isAdmin || (conversations && conversations.length > 0)) && (
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