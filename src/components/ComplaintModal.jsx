import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Image, Col, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useCreateComplaintMutation } from '../slices/complaintApiSlice';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const ComplaintModal = ({ show, handleClose }) => {
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const [createComplaint, { isLoading }] = useCreateComplaintMutation();

  const uploadFileHandler = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoadingUpload(true);
    try {
      const uploadedImageUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', UPLOAD_PRESET);
          const config = { headers: { 'Content-Type': 'multipart/form-data' } };
          const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData, config);
          return data.secure_url;
        })
      );
      setImages((prevImages) => [...prevImages, ...uploadedImageUrls]);
      toast.success('Image(s) téléversée(s)');
    } catch (error) {
      toast.error("Le téléversement a échoué");
    } finally {
      setLoadingUpload(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createComplaint({ text, images }).unwrap();
      toast.success('Réclamation envoyée. Nous l\'examinerons bientôt.');
      handleClose();
      setText('');
      setImages([]);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Faire une réclamation</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <p>Veuillez expliquer en détail la raison de votre réclamation. Vous pouvez joindre des captures d'écran si nécessaire.</p>
          <Form.Group controlId="complaintText">
            <Form.Label>Votre message</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="complaintImages" className="mt-3">
            <Form.Label>Joindre des images (optionnel)</Form.Label>
            <Form.Control type="file" multiple onChange={uploadFileHandler} />
            {loadingUpload && <Spinner size="sm" />}
          </Form.Group>
          <Row className="mt-3">
            {images.map((img, index) => (
              <Col key={index} xs={4} md={3} className="mb-2">
                <Image src={img} thumbnail />
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Envoi...' : 'Envoyer la réclamation'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ComplaintModal;