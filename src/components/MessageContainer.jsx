import React, { useRef, useEffect, useState } from 'react';
import { Form, Button, InputGroup, Image, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FaPaperclip, FaTrash, FaEdit } from 'react-icons/fa';
import { BsCheck2All } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useGetMessagesQuery, useSendMessageMutation, useDeleteMessageMutation, useUpdateMessageMutation, useMarkMessagesAsSeenMutation } from '../slices/messageApiSlice';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const MessageContainer = ({ conversationId }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: messages, isLoading } = useGetMessagesQuery(conversationId);
  const [sendMessage] = useSendMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [updateMessage] = useUpdateMessageMutation();
  const [markMessagesAsSeen] = useMarkMessagesAsSeenMutation();

  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    if (conversationId) {
        markMessagesAsSeen(conversationId);
    }
  }, [conversationId, messages, markMessagesAsSeen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) return;

    let imageUrl = '';
    if (imageFile) {
        setLoadingUpload(true);
        try {
            const formData = new FormData();
            formData.append('file', imageFile);
            formData.append('upload_preset', UPLOAD_PRESET);
            const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
            imageUrl = data.secure_url;
        } catch (error) {
            toast.error("Le téléversement a échoué");
            setLoadingUpload(false);
            return;
        } finally {
            setLoadingUpload(false);
        }
    }

    const currentConvo = messages && messages.length > 0 ? messages[0].conversation : null;
    const recipientId = currentConvo?.participants.find(p => p._id !== userInfo._id)?._id;

    try {
        await sendMessage({ recipientId, text, image: imageUrl }).unwrap();
        setText('');
        setImageFile(null);
        setImagePreview(null);
    } catch (error) { toast.error("Erreur d'envoi"); }
  };

  // ... (les autres handlers handleDelete, handleEdit, handleUpdate, isNewDay, formatDate restent inchangés)
  const handleDelete = async (messageId) => { try { await deleteMessage(messageId).unwrap(); toast.info('Message supprimé'); } catch (error) { toast.error('Erreur lors de la suppression'); } };
  const handleEdit = (message) => { setEditingMessage(message); setEditedText(message.text); };
  const handleUpdate = async (e) => { e.preventDefault(); if (!editedText.trim()) return; try { await updateMessage({ messageId: editingMessage._id, text: editedText }).unwrap(); setEditingMessage(null); setEditedText(''); } catch (error) { toast.error('Erreur lors de la modification'); } };
  const isNewDay = (msg1, msg2) => { if (!msg2) return true; return new Date(msg1.createdAt).toLocaleDateString() !== new Date(msg2.createdAt).toLocaleDateString(); };
  const formatDate = (dateString) => { const date = new Date(dateString); const today = new Date(); const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); if (date.toLocaleDateString() === today.toLocaleDateString()) return "AUJOURD'HUI"; if (date.toLocaleDateString() === yesterday.toLocaleDateString()) return "HIER"; return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }); };

  return (
    <div className="message-container">
      <div className="messages-area">
        {isLoading ? <Spinner/> : messages?.map((msg, index) => {
          const messageAlignment = msg.sender._id === userInfo._id ? 'sent' : 'received';
          const isSeen = msg.seenBy.length > 1;
          const isDeleted = msg.text === "Ce message a été supprimé";

          return (
            <React.Fragment key={msg._id}>
                {isNewDay(msg, messages[index-1]) && <div className="date-separator">{formatDate(msg.createdAt)}</div>}
                <div className={`message-wrapper ${messageAlignment}`}>
                    {msg.isEdited && <div className="message-edited-indicator">Modifié</div>}
                    <div className={`message-bubble ${messageAlignment} ${isDeleted ? 'deleted-message' : ''}`}>
                        {editingMessage?._id === msg._id ? (
                            <Form onSubmit={handleUpdate} className="edit-message-form">
                                <Form.Control type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)} autoFocus />
                                <Button type="submit" variant="success" size="sm">✓</Button>
                                <Button onClick={() => setEditingMessage(null)} variant="danger" size="sm">x</Button>
                            </Form>
                        ) : (
                            <>
                            {msg.text && <p className="mb-0">{msg.text}</p>}
                            {msg.image && <Image src={msg.image} alt="Image envoyée" className="message-image" fluid />}
                            </>
                        )}
                    </div>
                    <div className="d-flex align-items-center">
                        {messageAlignment === 'sent' && !isDeleted && <BsCheck2All color={isSeen ? '#0d6efd' : '#adb5bd'} className="me-1" />}
                        <span className="message-timestamp">
                            {new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {messageAlignment === 'sent' && !editingMessage && !isDeleted && (
                            <div className="message-actions">
                                {!msg.image && <button onClick={() => handleEdit(msg)}><FaEdit /></button>}
                                <button onClick={() => handleDelete(msg._id)}><FaTrash /></button>
                            </div>
                        )}
                    </div>
                </div>
            </React.Fragment>
          )
        })}
        <div ref={messageEndRef} />
      </div>

      <Form onSubmit={handleSubmit} className="message-input-form">
        {imagePreview && (
            <div className="image-preview-container">
                <Image src={imagePreview} className="preview-image" />
                <Button variant="dark" onClick={() => {setImagePreview(null); setImageFile(null);}} className="remove-preview-btn">X</Button>
            </div>
        )}
        <InputGroup>
          <Form.Control type="text" placeholder="Écrivez votre message..." value={text} onChange={(e) => setText(e.target.value)} />
          <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
          <Button variant="secondary" onClick={() => fileInputRef.current.click()} disabled={loadingUpload}>
            {loadingUpload ? <Spinner size="sm" /> : <FaPaperclip />}
          </Button>
          <Button variant="primary" type="submit" disabled={loadingUpload}>Envoyer</Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default MessageContainer;