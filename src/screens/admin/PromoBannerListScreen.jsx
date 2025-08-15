import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col, InputGroup, Image, Spinner, Card, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import Message from '../../components/Message';
import { useGetAllBannersQuery, useCreateBannerMutation, useDeleteBannerMutation, useUpdateBannerMutation } from '../../slices/promoBannerApiSlice';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const PromoBannerListScreen = () => {
  const { data: banners, isLoading, error } = useGetAllBannersQuery();
  const [createBanner, { isLoading: loadingCreate }] = useCreateBannerMutation();
  const [deleteBanner, { isLoading: loadingDelete }] = useDeleteBannerMutation();
  const [updateBanner, { isLoading: loadingUpdate }] = useUpdateBannerMutation();

  // --- ÉTATS POUR LE FORMULAIRE ---
  const [formState, setFormState] = useState({
    endDate: '',
    animatedTexts: [{ text: '' }],
    coupons: [],
    floatingImages: [],
  });

  const [loadingUpload, setLoadingUpload] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState(null);

  // --- GESTION DES CHAMPS DU FORMULAIRE ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // Gestion des textes animés
  const handleTextChange = (index, value) => {
    const newTexts = [...formState.animatedTexts];
    newTexts[index] = { ...newTexts[index], text: value };
    setFormState(prev => ({ ...prev, animatedTexts: newTexts }));
  };
  const addTextField = () => setFormState(prev => ({ ...prev, animatedTexts: [...prev.animatedTexts, { text: '' }] }));
  const removeTextField = (index) => setFormState(prev => ({ ...prev, animatedTexts: prev.animatedTexts.filter((_, i) => i !== index) }));

  // Gestion des coupons
  const handleCouponChange = (index, field, value) => {
    const newCoupons = [...formState.coupons];
    newCoupons[index] = { ...newCoupons[index], [field]: value };
    setFormState(prev => ({ ...prev, coupons: newCoupons }));
  };
  const addCouponField = () => setFormState(prev => ({ ...prev, coupons: [...prev.coupons, { title: '', subtitle: '', code: '', discountType: 'percentage', discountValue: 0 }] }));
  const removeCouponField = (index) => setFormState(prev => ({ ...prev, coupons: prev.coupons.filter((_, i) => i !== index) }));

  // Gestion des images
  const uploadFileHandler = async (e) => {
    if (formState.floatingImages.length >= 6) { toast.error("Maximum 6 images."); return; }
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    setLoadingUpload(true);
    try {
      const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
      setFormState(prev => ({ ...prev, floatingImages: [...prev.floatingImages, { url: data.secure_url }] }));
      toast.success('Image ajoutée');
    } catch (error) { toast.error("Le téléversement a échoué"); }
    finally { setLoadingUpload(false); }
  };
  const removeFloatingImage = (index) => setFormState(prev => ({ ...prev, floatingImages: prev.floatingImages.filter((_, i) => i !== index) }));

  // --- ACTIONS CRUD ---
  const deleteHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr ?')) {
      try { await deleteBanner(id).unwrap(); toast.success('Bannière supprimée'); }
      catch (err) { toast.error(err?.data?.message || err.error); }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createBanner(formState).unwrap();
      toast.success('Nouvelle bannière créée et activée !');
      setFormState({ endDate: '', animatedTexts: [{ text: '' }], coupons: [], floatingImages: [] });
    } catch (err) { toast.error(err?.data?.message || err.error); }
  };

  const handleEdit = (banner) => {
    setBannerToEdit(banner);
    setFormState({
      endDate: new Date(banner.endDate).toISOString().split('T')[0],
      animatedTexts: banner.animatedTexts || [{ text: '' }],
      coupons: banner.coupons || [],
      floatingImages: banner.floatingImages || [],
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
        await updateBanner({ _id: bannerToEdit._id, ...formState }).unwrap();
        toast.success('Bannière mise à jour !');
        setShowEditModal(false);
    } catch (err) {
        toast.error(err?.data?.message || err.error);
    }
  };
  
  const activeBanners = banners ? banners.filter(b => b.isActive) : [];

  const renderForm = (isModal = false) => (
    <Form onSubmit={isModal ? handleUpdate : submitHandler}>
      <Card className="mb-3">
        <Card.Header>Détails de la Promotion</Card.Header>
        <Card.Body>
          <Form.Group controlId={isModal ? 'endDateEdit' : 'endDate'}>
            <Form.Label>Date de fin</Form.Label>
            <Form.Control type='date' name="endDate" value={formState.endDate} onChange={handleFormChange} required />
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="mb-3">
        <Card.Header>Coupons de Réduction</Card.Header>
        <Card.Body>
          {formState.coupons.map((coupon, index) => (
            <div key={index} className="p-2 border rounded mb-2">
              <Row>
                <Col md={6}><Form.Control placeholder="Titre (ex: -5000 FCFA)" value={coupon.title} onChange={(e) => handleCouponChange(index, 'title', e.target.value)} /></Col>
                <Col md={6}><Form.Control placeholder="Sous-titre (ex: dès 75000 FCFA)" value={coupon.subtitle} onChange={(e) => handleCouponChange(index, 'subtitle', e.target.value)} /></Col>
              </Row>
              <Row className="mt-2">
                <Col md={4}><Form.Control placeholder="Code (ex: PROMO5K)" value={coupon.code} onChange={(e) => handleCouponChange(index, 'code', e.target.value.toUpperCase())} /></Col>
                <Col md={4}>
                  <Form.Select value={coupon.discountType} onChange={(e) => handleCouponChange(index, 'discountType', e.target.value)}>
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant Fixe (FCFA)</option>
                  </Form.Select>
                </Col>
                <Col md={3}><Form.Control type="number" placeholder="Valeur" value={coupon.discountValue} onChange={(e) => handleCouponChange(index, 'discountValue', e.target.value)} /></Col>
                <Col md={1}><Button variant="danger" onClick={() => removeCouponField(index)}><FaTrash /></Button></Col>
              </Row>
            </div>
          ))}
          <Button variant="success" size="sm" onClick={addCouponField}><FaPlus /> Ajouter un coupon</Button>
        </Card.Body>
      </Card>

      {/* Sections Textes et Images restent similaires */}
      <Card className="mb-3">
        <Card.Header>Textes Animés</Card.Header>
        <Card.Body>
            {formState.animatedTexts.map((item, index) => (
                <InputGroup className="mb-2" key={index}>
                    <Form.Control type='text' placeholder="Texte de l'offre" value={item.text} onChange={(e) => handleTextChange(index, e.target.value)} />
                    <Button variant="outline-danger" onClick={() => removeTextField(index)}>X</Button>
                </InputGroup>
            ))}
            <Button variant="outline-secondary" size="sm" onClick={addTextField}>Ajouter un texte</Button>
        </Card.Body>
      </Card>
      <Card>
        <Card.Header>Images Flottantes (6 max)</Card.Header>
        <Card.Body>
          <Form.Group controlId={isModal ? 'imagesEdit' : 'images'}>
            <Form.Control type='file' onChange={uploadFileHandler} disabled={loadingUpload || formState.floatingImages.length >= 6} />
            {loadingUpload && <Spinner size="sm" />}
          </Form.Group>
          <Row className="mt-2">
            {formState.floatingImages.map((img, index) => (
                <Col xs={4} md={2} key={index} className="position-relative">
                    <Image src={img.url} thumbnail />
                    <Button variant="danger" size="sm" onClick={() => removeFloatingImage(index)} style={{position: 'absolute', top: '5px', right: '15px'}}>X</Button>
                </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
      
      {!isModal && (
        <Button type='submit' variant='primary' className='mt-3' disabled={loadingCreate}>
          {loadingCreate ? 'Création...' : 'Créer et Activer la Bannière'}
        </Button>
      )}
    </Form>
  );

  return (
    <div>
      <h1>Gestion de la Bannière Promo</h1>

      <div className="my-4 p-3 border rounded bg-light">
        <h5>Créer une nouvelle bannière (cela désactivera l'ancienne)</h5>
        {renderForm(false)}
      </div>

      <h5 className="mt-4">Bannière Actuelle</h5>
      {isLoading ? <p>Chargement...</p> : 
       error ? <Message variant='danger'>{error?.data?.message || error.error}</Message> : 
       activeBanners.length === 0 ? <Message variant="info">Aucune bannière active. Créez-en une ci-dessus.</Message> :
       activeBanners.map(banner => (
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
      }

      {bannerToEdit && (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
            <Modal.Header closeButton><Modal.Title>Modifier la Bannière</Modal.Title></Modal.Header>
            <Modal.Body>{renderForm(true)}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowEditModal(false)}>Annuler</Button>
                <Button variant='primary' onClick={handleUpdate} disabled={loadingUpdate}>
                    {loadingUpdate ? 'Sauvegarde...' : 'Sauvegarder les Modifications'}
                </Button>
            </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default PromoBannerListScreen;