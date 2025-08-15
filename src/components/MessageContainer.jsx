import React, { useRef, useEffect, useState } from 'react';
import { Form, Button, InputGroup, Image, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FaPaperclip, FaTrash, FaEdit, FaFileAlt } from 'react-icons/fa';
import { BsCheck2All } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useGetMessagesQuery, useSendMessageMutation, useDeleteMessageMutation, useUpdateMessageMutation, useMarkMessagesAsSeenMutation } from '../slices/messageApiSlice';
import '../screens/Chat.css';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const MessageContainer = ({ conversationId, onSendMessage }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: messages, isLoading } = useGetMessagesQuery(conversationId);
  const [markMessagesAsSeen] = useMarkMessagesAsSeenMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [updateMessage] = useUpdateMessageMutation();

  const messagesAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [text, setText] = useState('');
  const messageEndRef = useRef(null);
  const [filesToSend, setFilesToSend] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedText, setEditedText] = useState('');

  useEffect(() => {
    if (conversationId && conversationId !== 'new') {
        markMessagesAsSeen(conversationId);
    }
  }, [conversationId, messages, markMessagesAsSeen]);

  useEffect(() => {
    if (messagesAreaRef.current) {
        messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    if (filesToSend.length + selectedFiles.length > 10) {
        toast.error("Vous ne pouvez pas envoyer plus de 10 fichiers à la fois.");
        return;
    }
    setFilesToSend(prev => [...prev, ...selectedFiles]);
    const newPreviews = selectedFiles.map(file => ({
        url: URL.createObjectURL(file),
        name: file.name,
        isImage: file.type.startsWith('image/'),
    }));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (indexToRemove) => {
    setFilesToSend(filesToSend.filter((_, index) => index !== indexToRemove));
    setPreviews(previews.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && filesToSend.length === 0) return;

    let uploadedFiles = [];
    if (filesToSend.length > 0) {
      setLoadingUpload(true);
      try {
        uploadedFiles = await Promise.all(
            filesToSend.map(async file => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', UPLOAD_PRESET);
                const resourceType = file.type.startsWith('image/') ? 'image' : 'raw';
                const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, formData);
                return {
                    fileUrl: data.secure_url,
                    fileName: data.original_filename || file.name,
                    fileType: data.resource_type,
                };
            })
        );
      } catch (error) {
        toast.error("Le téléversement d'un ou plusieurs fichiers a échoué");
        setLoadingUpload(false);
        return;
      } finally {
        setLoadingUpload(false);
      }
    }

    onSendMessage({ text, files: uploadedFiles });

    setText('');
    setFilesToSend([]);
    setPreviews([]);
  };

  const handleDelete = async (messageId) => { try { await deleteMessage(messageId).unwrap(); toast.info('Message supprimé'); } catch (error) { toast.error('Erreur lors de la suppression'); } };
  const handleEdit = (message) => { setEditingMessage(message); setEditedText(message.text); };
  const handleUpdate = async (e) => { e.preventDefault(); if (!editedText.trim()) return; try { await updateMessage({ messageId: editingMessage._id, text: editedText }).unwrap(); setEditingMessage(null); setEditedText(''); } catch (error) { toast.error('Erreur de modification'); } };
  const isNewDay = (msg1, msg2) => { if (!msg2) return true; return new Date(msg1.createdAt).toLocaleDateString() !== new Date(msg2.createdAt).toLocaleDateString(); };
  const formatDate = (dateString) => { const date = new Date(dateString); const today = new Date(); const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); if (date.toLocaleDateString() === today.toLocaleDateString()) return "AUJOURD'HUI"; if (date.toLocaleDateString() === yesterday.toLocaleDateString()) return "HIER"; return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }); };

  if (isLoading) return <div className="d-flex justify-content-center align-items-center h-100"><Spinner /></div>;

  return (
    <div className="message-container">
      <div className="messages-area" ref={messagesAreaRef}>
        {messages && messages.map((msg, index) => {
            const showDate = isNewDay(msg, messages[index - 1]);
            const messageAlignment = msg.sender._id === userInfo._id ? 'sent' : 'received';
            const isDeleted = msg.text === "Ce message a été supprimé";
            const isSeen = msg.seenBy.length > 1;
            return (
              <React.Fragment key={msg._id}>
                {showDate && <div className="date-separator">{formatDate(msg.createdAt)}</div>}
                {/* --- MODIFICATION ICI POUR LA PHOTO DE PROFIL --- */}
                <div className={`d-flex align-items-end ${messageAlignment === 'sent' ? 'justify-content-end' : 'justify-content-start'}`}>
                  {messageAlignment === 'received' && (
                    <Image 
                      src={msg.sender.profilePicture || 'https://i.imgur.com/Suf6O8w.png'} 
                      roundedCircle 
                      width={30} 
                      height={30} 
                      className="me-2 mb-1"
                    />
                  )}
                  <div className={`message-wrapper ${messageAlignment}`}>
                      {msg.isEdited && <div className="message-edited-indicator">Modifié</div>}
                      <div className={`message-bubble ${messageAlignment} ${isDeleted ? 'deleted-message' : ''}`}>
                          {editingMessage?._id === msg._id ? ( <Form onSubmit={handleUpdate} className="edit-message-form"><Form.Control type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)} autoFocus /><Button type="submit" variant="success" size="sm">✓</Button><Button onClick={() => setEditingMessage(null)} variant="danger" size="sm">x</Button></Form> ) : (
                              <>
                                  {msg.files && msg.files.map(file => (
                                      file.fileType === 'image' ? 
                                      <Image key={file.fileUrl} src={file.fileUrl} alt={file.fileName} className="message-image mb-2" fluid /> :
                                      <a key={file.fileUrl} href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="file-message-link">
                                          <FaFileAlt className="file-icon" />
                                          <span>{file.fileName}</span>
                                      </a>
                                  ))}
                                  {msg.text && <p className="mb-0">{msg.text}</p>}
                              </>
                          )}
                      </div>
                      <div className="d-flex align-items-center">
                          {messageAlignment === 'sent' && !isDeleted && <BsCheck2All color={isSeen ? '#0d6efd' : '#adb5bd'} className="me-1" />}
                          <span className="message-timestamp">{new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                          {messageAlignment === 'sent' && !editingMessage && !isDeleted && (
                              <div className="message-actions">
                                  {(!msg.files || msg.files.length === 0) && <button onClick={() => handleEdit(msg)}><FaEdit /></button>}
                                  <button onClick={() => handleDelete(msg._id)}><FaTrash /></button>
                              </div>
                          )}
                      </div>
                  </div>
                </div>
                 {/* --- FIN DE LA MODIFICATION --- */}
              </React.Fragment>
            );
        })}
        <div ref={messageEndRef} />
      </div>

      <div className="preview-container">
        {previews.map((p, index) => (
            p.isImage ? (
                <div key={index} className="image-preview-wrapper">
                    <Image src={p.url} className="preview-image" />
                    <Button variant="dark" onClick={() => removePreview(index)} className="remove-preview-btn">X</Button>
                </div>
            ) : (
                <div key={index} className="file-preview-wrapper">
                    <FaFileAlt className="file-icon" />
                    <span className="me-auto">{p.name}</span>
                    <Button variant="dark" onClick={() => removePreview(index)} className="remove-preview-btn">X</Button>
                </div>
            )
        ))}
      </div>

      <Form onSubmit={handleSubmit} className="message-input-form">
        <InputGroup>
          <Form.Control type="text" placeholder="Écrivez votre message..." value={text} onChange={(e) => setText(e.target.value)} />
          <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
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