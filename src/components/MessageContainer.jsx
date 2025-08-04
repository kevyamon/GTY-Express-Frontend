import React, { useRef, useEffect, useState } from 'react';
import { Form, Button, InputGroup, Image, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FaPaperclip, FaTrash, FaEdit } from 'react-icons/fa';
import { BsCheck2All } from 'react-icons/bs';
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
  const [imageFile, setImageFile] = useState(null); // Pour le fichier image
  const [imagePreview, setImagePreview] = useState(null); // Pour l'URL de prévisualisation
  const [loadingUpload, setLoadingUpload] = useState(false);

  const [editingMessage, setEditingMessage] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [deleteMessage] = useDeleteMessageMutation();
  const [updateMessage] = useUpdateMessageMutation();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // On stocke le fichier
      setImagePreview(URL.createObjectURL(file)); // On crée une URL locale pour la preview
    }
  };

  const removePreview = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imageFile) return;

    let imageUrl = '';
    // S'il y a une image à envoyer, on la téléverse d'abord
    if (imageFile) {
      setLoadingUpload(true);
      try {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', UPLOAD_PRESET);
        const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
        imageUrl = data.secure_url;
      } catch (error) {
        toast.error("Le téléversement de l'image a échoué");
        setLoadingUpload(false);
        return;
      } finally {
        setLoadingUpload(false);
      }
    }

    // On envoie le message (texte et/ou URL de l'image)
    onSendMessage({ text, image: imageUrl });

    // On réinitialise le formulaire
    setText('');
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async (messageId) => { /* ... (inchangé) ... */ };
  const handleEdit = (message) => { /* ... (inchangé) ... */ };
  const handleUpdate = async (e) => { /* ... (inchangé) ... */ };
  const isNewDay = (msg1, msg2) => { /* ... (inchangé) ... */ };
  const formatDate = (dateString) => { /* ... (inchangé) ... */ };

  return (
    <div className="message-container">
      <div className="messages-area">
        {messages.map((msg, index) => {
            // ... (logique d'affichage des messages existante, inchangée)
            const showDate = isNewDay(msg, messages[index - 1]);
            const messageAlignment = msg.sender._id === userInfo._id ? 'sent' : 'received';
            const isDeleted = msg.text === "Ce message a été supprimé";
            const isSeen = msg.seenBy.length > 1;
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
                        {msg.image && <Image src={msg.image} alt="Image envoyée" className="message-image mb-2" fluid />}
                        {msg.text && <p className="mb-0">{msg.text}</p>}
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
            );
        })}
        <div ref={messageEndRef} />
      </div>

      <div className="preview-container">
        {imagePreview && (
            <div className="image-preview-wrapper">
                <Image src={imagePreview} className="preview-image" />
                <Button variant="dark" onClick={removePreview} className="remove-preview-btn">X</Button>
            </div>
        )}
      </div>

      <Form onSubmit={handleSubmit} className="message-input-form">
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