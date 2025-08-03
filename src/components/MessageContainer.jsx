import React, { useRef, useEffect, useState } from 'react';
import { Form, Button, InputGroup, Image, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FaPaperclip, FaTrash, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDeleteMessageMutation, useUpdateMessageMutation } from '../slices/messageApiSlice';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const MessageContainer = ({ messages = [], onSendMessage }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [text, setText] = useState('');
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [deleteMessage] = useDeleteMessageMutation();
  const [updateMessage] = useUpdateMessageMutation();

  useEffect(() => {
    // Scroll automatique à chaque nouveau message
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage({ text });
      setText('');
    }
  };
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    setLoadingUpload(true);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData, config);
      onSendMessage({ image: data.secure_url });
    } catch (error) {
      toast.error("Le téléversement de l'image a échoué");
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleDelete = async (messageId) => {
    try {
        await deleteMessage(messageId).unwrap();
        toast.info('Message supprimé');
    } catch (error) {
        toast.error('Erreur lors de la suppression du message');
    }
  };
  const handleEdit = (message) => {
    setEditingMessage(message);
    setEditedText(message.text);
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editedText.trim()) return;
    try {
        await updateMessage({ messageId: editingMessage._id, text: editedText }).unwrap();
        setEditingMessage(null);
        setEditedText('');
    } catch (error) {
        toast.error('Erreur lors de la modification');
    }
  };

  const isNewDay = (msg1, msg2) => {
    if (!msg2) return true;
    const date1 = new Date(msg1.createdAt).toLocaleDateString();
    const date2 = new Date(msg2.createdAt).toLocaleDateString();
    return date1 !== date2;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toLocaleDateString() === today.toLocaleDateString()) return "AUJOURD'HUI";
    if (date.toLocaleDateString() === yesterday.toLocaleDateString()) return "HIER";
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="message-container">
      <div className="messages-area">
        {messages.map((msg, index) => {
          const showDate = isNewDay(msg, messages[index - 1]);
          const messageAlignment = msg.sender._id === userInfo._id ? 'sent' : 'received';
          const isDeleted = msg.text === "Ce message a été supprimé";
          return (
            <React.Fragment key={msg._id}>
              {showDate && <div className="date-separator">{formatDate(msg.createdAt)}</div>}
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
          );
        })}
        <div ref={messageEndRef} />
      </div>
      <Form onSubmit={handleSubmit} className="message-input-form">
        <InputGroup>
          <Form.Control type="text" placeholder="Écrivez votre message..." value={text} onChange={(e) => setText(e.target.value)} />
          <input type="file" ref={fileInputRef} onChange={uploadFileHandler} style={{ display: 'none' }} accept="image/*" />
          <Button variant="secondary" onClick={() => fileInputRef.current.click()} disabled={loadingUpload} className="image-upload-btn">
            {loadingUpload ? <Spinner size="sm" /> : <FaPaperclip />}
          </Button>
          <Button variant="primary" type="submit">Envoyer</Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default MessageContainer;