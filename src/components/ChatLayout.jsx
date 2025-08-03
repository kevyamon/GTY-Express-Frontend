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
    // Logique simplifiée : dès qu'on sélectionne une conversation, on la marque comme lue.
    if (selectedConversationId) {
      const currentConvo = conversations?.find(c => c._id === selectedConversationId);
      if (currentConvo?.isUnread) {
        markAsRead(selectedConversationId);
      }
    }
  }, [selectedConversationId, conversations, markAsRead]);

  const handleSendMessage = async (messageData) => {
    let recipientId;
    const currentConvo = conversations?.find(c => c._id === selectedConversationId);

    if (userInfo.isAdmin) {
      if (!currentConvo) return;
      recipientId = currentConvo.participants.find(p => p._id !== userInfo._id)?._id;
    } else {
      if (currentConvo) {
        recipientId = currentConvo.participants.find(p => p.isAdmin)?._id;
      }
    }

    try {
      await sendMessage({ ...messageData, recipientId }).unwrap();
    } catch (error) { console.error('Failed to send message:', error); }
  };

  const renderContent = () => {
    if (isLoadingConvos) {
      return <div className="d-flex justify-content-center align-items-center h-100"><Spinner /></div>;
    }
    if (!userInfo.isAdmin && conversations?.length === 0) {
      return <MessageContainer messages={[]} onSendMessage={handleSendMessage} />;
    }
    if (selectedConversationId) {
      return <MessageContainer messages={messages} onSendMessage={handleSendMessage} />;
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