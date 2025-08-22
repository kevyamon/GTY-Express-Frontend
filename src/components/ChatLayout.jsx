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

  // --- DÉBUT DE LA CORRECTION : Affichage du premier message ---
  // Cet effet surveille la liste des conversations. S'il n'y avait aucune conversation
  // et qu'une nouvelle apparaît, on la sélectionne automatiquement.
  useEffect(() => {
    // S'applique seulement aux clients (pas aux admins)
    if (!userInfo.isAdmin && conversations) {
      // Si on n'avait pas de conversation sélectionnée et qu'il y en a maintenant une seule
      if (!selectedConversationId && conversations.length === 1) {
        setSelectedConversationId(conversations[0]._id);
      }
    }
  }, [conversations, selectedConversationId, userInfo.isAdmin]);
  // --- FIN DE LA CORRECTION ---

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
  
  const handleSendMessage = async (messageData) => {
    try {
      let recipientId;
      const currentConvo = conversations?.find(c => c._id === selectedConversationId);

      if (!userInfo.isAdmin) {
        if (currentConvo) {
            recipientId = currentConvo.participants.find(p => p.isAdmin)?._id;
        }
      } 
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
    if (!userInfo.isAdmin && conversations?.length === 0) {
      return <MessageContainer conversationId="new" messages={[]} onSendMessage={handleSendMessage} />;
    }
    if (selectedConversationId) {
      return <MessageContainer conversationId={selectedConversationId} messages={messages} onSendMessage={handleSendMessage} />;
    }
    return (
      <div className="d-flex align-items-center justify-content-center h-100">
          <Message>Sélectionnez une conversation pour commencer à discuter.</Message>
      </div>
    );
  }

  return (
    <div className="chat-layout">
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