import React, { useState } from 'react';
import { Table, Button, Form, Row, Col, InputGroup, Image, Spinner, Card, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import Message from '../../components/Message';
import { useGetAllBannersQuery, useCreateBannerMutation, useDeleteBannerMutation, useUpdateBannerMutation } from '../../slices/promoBannerApiSlice';
import { FaEdit, FaTrash } from 'react-icons/fa';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const PromoBannerListScreen = () => {
  const { data: banners, isLoading, error, refetch } = useGetAllBannersQuery();
  const [createBanner, { isLoading: loadingCreate }] = useCreateBannerMutation();
  const [deleteBanner, { isLoading: loadingDelete }] = useDeleteBannerMutation();
  const [updateBanner, { isLoading: loadingUpdate }] = useUpdateBannerMutation();

  const [endDate, setEndDate] = useState('');
  const [animatedTexts, setAnimatedTexts] = useState([{ text: "Jusqu'à -60%" }, { text: 'Choice Day' }]);
  const [coupons, setCoupons] = useState([
    { title: '-5000 FCFA', subtitle: "dès 75000 FCFA", code: 'PROMO5K' },
    { title: '-10000 FCFA', subtitle: "dès 120000 FCFA", code: 'PROMO10K' },
    { title: '-25000 FCFA', subtitle: "dès 200000 FCFA", code: 'PROMO25K' },
  ]);
  const [floatingImages, setFloatingImages] = useState([]);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState(null);

  const handleTextChange = (index, value) => {
    const newTexts = [...animatedTexts];
    newTexts[index].text = value;
    setAnimatedTexts(newTexts);
  };
  const addTextField = () => setAnimatedTexts([...animatedTexts, { text: '' }]);
  const removeTextField = (index) => setAnimatedTexts(animatedTexts.filter((_, i) => i !== index));

  const uploadFileHandler = async (e) => {
    if (floatingImages.length >= 6) { toast.error("Maximum 6 images."); return; }
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    setLoadingUpload(true);
    try {
      const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
      setFloatingImages([...floatingImages, { url: data.secure_url }]);
      toast.success('Image ajoutée');
    } catch (error) { toast.error("Le téléversement a échoué"); }
    finally { setLoadingUpload(false); }
  };
  const removeFloatingImage = (index) => setFloatingImages(floatingImages.filter((_, i) => i !== index));

  const deleteHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr ?')) {
      try { await deleteBanner(id).unwrap(); toast.success('Bannière supprimée'); }
      catch (err) { toast.error(err?.data?.message || err.error); }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createBanner({ animatedTexts, endDate, coupons, floatingImages }).unwrap();
      toast.success('Nouvelle bannière créée et activée !');
      setAnimatedTexts([{ text: "Jusqu'à -60%" }, { text: 'Choice Day' }]);
      setEndDate('');
      setFloatingImages([]);
    } catch (err) { toast.error(err?.data?.message || err.error); }
  };

  const handleEdit = (banner) => {
    setBannerToEdit(banner);
    setEndDate(new Date(banner.endDate).toISOString().split('T')[0]);
    setAnimatedTexts(banner.animatedTexts || []);
    setCoupons(banner.coupons || []);
    setFloatingImages(banner.floatingImages || []);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        await updateBanner({ _id: bannerToEdit._id, animatedTexts, endDate, coupons, floatingImages }).unwrap();
        toast.success('Bannière mise à jour !');
        setShowEditModal(false);
    } catch (err) {
        toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div>
      <h1>Gestion de la Bannière Promo Avancée</h1>
      {/* ... (le formulaire de création reste le même) ... */}
      <h5 className="mt-4">Bannières Actives</h5>
      {isLoading ? <p>Chargement...</p> : error ? <Message variant='danger'>{error?.data?.message || error.error}</Message> : (
        banners && banners.filter(b => b.isActive).map(banner => (
            <Card key={banner._id}>
                <Card.Body className="d-flex justify-content-between align-items-center">
                    <div>
                        <Card.Title>Offre : {banner.animatedTexts.map(t => t.text).join(' / ')}</Card.Title>
                        <Card.Text>Expire le : {new Date(banner.endDate).toLocaleDateString()}</Card.Text>
                    </div>
                    <div>
                        <Button variant='warning' className='me-2' onClick={() => handleEdit(banner)}><FaEdit /></Button>
                        <Button variant='danger' onClick={() => deleteHandler(banner._id)} disabled={loadingDelete}><FaTrash /></Button>
                    </div>
                </Card.Body>
            </Card>
        ))
      )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton><Modal.Title>Modifier la Bannière</Modal.Title></Modal.Header>
        <Form onSubmit={handleUpdate}>
            <Modal.Body>
            <Form.Group controlId='endDateEdit' className='my-2'>
                <Form.Label>Date de fin</Form.Label>
                <Form.Control type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </Form.Group>
            <hr />
            <h6>Textes Animés</h6>
            {animatedTexts.map((item, index) => (
                <InputGroup className="mb-2" key={index}>
                    <Form.Control type='text' value={item.text} onChange={(e) => handleTextChange(index, e.target.value)} />
                    <Button variant="outline-danger" onClick={() => removeTextField(index)}>X</Button>
                </InputGroup>
            ))}
            <Button variant="outline-secondary" size="sm" onClick={addTextField}>Ajouter un texte</Button>
            <hr />
            <h6>Images Flottantes (6 max)</h6>
            <Form.Group controlId='imagesEdit' className='my-2'>
                <Form.Control type='file' onChange={uploadFileHandler} disabled={loadingUpload || floatingImages.length >= 6} />
                {loadingUpload && <Spinner size="sm" />}
            </Form.Group>
            <Row>
                {floatingImages.map((img, index) => (
                    <Col xs={4} md={2} key={index} className="position-relative">
                        <Image src={img.url} thumbnail />
                        <Button variant="danger" size="sm" onClick={() => removeFloatingImage(index)} style={{position: 'absolute', top: '5px', right: '15px'}}>X</Button>
                    </Col>
                ))}
            </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>Annuler</Button>
                <Button type='submit' variant='primary' disabled={loadingUpdate}>
                    {loadingUpdate ? 'Sauvegarde...' : 'Sauvegarder les Modifications'}
                </Button>
            </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default PromoBannerListScreen;