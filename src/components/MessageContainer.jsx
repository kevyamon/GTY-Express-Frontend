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

  const messagesAreaRef = useRef(null); // Référence à la zone des messages
  const fileInputRef = useRef(null);
  const [text, setText] = useState('');
  const [fileToSend, setFileToSend] = useState(null);
  const [preview, setPreview] = useState(null);
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
        // Fait défiler jusqu'en bas de la zone des messages
        messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // ... (tous les autres handlers restent inchangés)
  const handleFileChange = (e) => { const file = e.target.files[0]; if (file) { setFileToSend(file); if (file.type.startsWith('image/')) { setPreview(URL.createObjectURL(file)); } else { setPreview(file.name); } } };
  const removePreview = () => { setFileToSend(null); setPreview(null); };
  const handleSubmit = async (e) => { e.preventDefault(); if (!text.trim() && !fileToSend) return; let uploadData = {}; if (fileToSend) { setLoadingUpload(true); try { const formData = new FormData(); formData.append('file', fileToSend); formData.append('upload_preset', UPLOAD_PRESET); const resourceType = fileToSend.type.startsWith('image/') ? 'image' : 'raw'; const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`, formData); uploadData = { fileUrl: data.secure_url, fileName: data.original_filename || fileToSend.name, fileType: data.resource_type }; } catch (error) { toast.error("Le téléversement a échoué"); setLoadingUpload(false); return; } finally { setLoadingUpload(false); } } onSendMessage({ text, ...uploadData }); setText(''); setFileToSend(null); setPreview(null); };
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
                <div className={`message-wrapper ${messageAlignment}`}>
                    {msg.isEdited && <div className="message-edited-indicator">Modifié</div>}
                    <div className={`message-bubble ${messageAlignment} ${isDeleted ? 'deleted-message' : ''}`}>
                        {editingMessage?._id === msg._id ? ( <Form onSubmit={handleUpdate} className="edit-message-form"><Form.Control type="text" value={editedText} onChange={(e) => setEditedText(e.target.value)} autoFocus /><Button type="submit" variant="success" size="sm">✓</Button><Button onClick={() => setEditingMessage(null)} variant="danger" size="sm">x</Button></Form> ) : (
                            <>
                                {msg.fileUrl && msg.fileType === 'image' && <Image src={msg.fileUrl} alt={msg.fileName || 'Image'} className="message-image mb-2" fluid />}
                                {msg.fileUrl && msg.fileType !== 'image' && ( <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="file-message-link"><FaFileAlt className="file-icon" /><span>{msg.fileName || 'Fichier'}</span></a> )}
                                {msg.text && <p className="mb-0">{msg.text}</p>}
                            </>
                        )}
                    </div>
                    <div className="d-flex align-items-center">
                        {messageAlignment === 'sent' && !isDeleted && <BsCheck2All color={isSeen ? '#0d6efd' : '#adb5bd'} className="me-1" />}
                        <span className="message-timestamp">{new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                        {messageAlignment === 'sent' && !editingMessage && !isDeleted && (
                            <div className="message-actions">
                                {!msg.fileUrl && <button onClick={() => handleEdit(msg)}><FaEdit /></button>}
                                <button onClick={() => handleDelete(msg._id)}><FaTrash /></button>
                            </div>
                        )}
                    </div>
                </div>
              </React.Fragment>
            );
        })}
      </div>

      <div className="preview-container">
        {preview && (
            fileToSend?.type.startsWith('image/') ? (
                <div className="image-preview-wrapper"><Image src={preview} className="preview-image" /><Button variant="dark" onClick={removePreview} className="remove-preview-btn">X</Button></div>
            ) : (
                <div className="file-preview-wrapper"><FaFileAlt className="file-icon" /><span className="me-auto">{preview}</span><Button variant="dark" onClick={removePreview} className="remove-preview-btn">X</Button></div>
            )
        )}
      </div>

      <Form onSubmit={handleSubmit} className="message-input-form">
        <InputGroup>
          <Form.Control type="text" placeholder="Écrivez votre message..." value={text} onChange={(e) => setText(e.target.value)} />
          <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
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