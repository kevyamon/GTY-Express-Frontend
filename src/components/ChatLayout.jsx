import React, { useState, useEffect } from 'react'; // Ajout de useEffect
import { Row, Col, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useGetConversationsQuery, useGetMessagesQuery, useSendMessageMutation, useMarkAsReadMutation } from '../slices/messageApiSlice'; // Ajout de useMarkAsReadMutation
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
  const [markAsRead] = useMarkAsReadMutation(); // NOUVEAU HOOK

  // EFFET POUR MARQUER COMME LU LORSQU'UNE CONVERSATION EST OUVERTE
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

    if (!currentConvo && !userInfo.isAdmin) {
      // Cas du premier message du client
      try {
        await sendMessage({ text }).unwrap();
      } catch (error) { console.error('Failed to send message:', error); }
      return;
    }

    if (userInfo.isAdmin) {
      recipientId = currentConvo.participants.find(p => p._id !== userInfo._id)?._id;
    } else {
      recipientId = currentConvo.participants.find(p => p.isAdmin)?._id;
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
                <Message>Sélectionnez une conversation pour commencer à discuter.</Message>
            </div>
        }
      </div>
    </div>
  );
};

export default ChatLayout;