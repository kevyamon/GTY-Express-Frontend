import React, { useState } from 'react';
import { Table, Button, Form, Row, Col, Image, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import Message from '../../components/Message';
import { useGetAllBannersQuery, useCreateBannerMutation, useDeleteBannerMutation } from '../../slices/promoBannerApiSlice';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const PromoBannerListScreen = () => {
  const { data: banners, isLoading, error } = useGetAllBannersQuery();
  const [createBanner, { isLoading: loadingCreate }] = useCreateBannerMutation();
  const [deleteBanner, { isLoading: loadingDelete }] = useDeleteBannerMutation();

  // State for the creation form
  const [mainOfferText, setMainOfferText] = useState("Jusqu'à -60%");
  const [endDate, setEndDate] = useState('');
  const [coupons, setCoupons] = useState([
    { title: '-5000 FCFA', subtitle: "dès 75000 FCFA d'achat", code: 'PROMO5K' },
    { title: '-10000 FCFA', subtitle: "dès 120000 FCFA d'achat", code: 'PROMO10K' },
    { title: '-25000 FCFA', subtitle: "dès 200000 FCFA d'achat", code: 'PROMO25K' },
  ]);
  const [images, setImages] = useState([]); // Nouvel état pour les images
  const [loadingUpload, setLoadingUpload] = useState(false);

  const handleCouponChange = (index, field, value) => {
    const newCoupons = [...coupons];
    newCoupons[index][field] = value;
    setCoupons(newCoupons);
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
      setImages([...images, data.secure_url]);
      toast.success('Image ajoutée');
    } catch (error) {
      toast.error("Le téléversement a échoué");
    } finally {
      setLoadingUpload(false);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette bannière ?')) {
      try {
        await deleteBanner(id).unwrap();
        toast.success('Bannière supprimée');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createBanner({ mainOfferText, endDate, coupons, images }).unwrap(); // On envoie les images
      toast.success('Nouvelle bannière créée et activée !');
      // On réinitialise le formulaire
      setMainOfferText("Jusqu'à -60%");
      setEndDate('');
      setImages([]);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div>
      <h1>Gestion de la Bannière Promo</h1>

      <Form onSubmit={submitHandler} className="my-4 p-3 border rounded">
        <h5>Créer une nouvelle bannière (cela désactivera les anciennes)</h5>
        <Form.Group controlId='mainOfferText' className='my-2'>
          <Form.Label>Texte de l'offre principale</Form.Label>
          <Form.Control type='text' value={mainOfferText} onChange={(e) => setMainOfferText(e.target.value)} />
        </Form.Group>
        <Form.Group controlId='endDate' className='my-2'>
          <Form.Label>Date de fin</Form.Label>
          <Form.Control type='date' value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </Form.Group>
        <hr />
        <h6>Coupons</h6>
        {coupons.map((coupon, index) => (
          <Row key={index} className="mb-2">
            <Col><Form.Control type='text' placeholder='Titre' value={coupon.title} onChange={(e) => handleCouponChange(index, 'title', e.target.value)} /></Col>
            <Col><Form.Control type='text' placeholder='Sous-titre' value={coupon.subtitle} onChange={(e) => handleCouponChange(index, 'subtitle', e.target.value)} /></Col>
            <Col><Form.Control type='text' placeholder='Code' value={coupon.code} onChange={(e) => handleCouponChange(index, 'code', e.target.value)} /></Col>
          </Row>
        ))}
         <hr />
        <h6>Images de fond</h6>
        <Form.Group controlId='images' className='my-2'>
            <Form.Label>Ajouter des images (3 maximum recommandées)</Form.Label>
            <Form.Control type='file' onChange={uploadFileHandler} />
            {loadingUpload && <Spinner size="sm" />}
        </Form.Group>
        <Row>
            {images.map(img => (
                <Col xs={4} md={2} key={img}>
                    <Image src={img} thumbnail />
                </Col>
            ))}
        </Row>
        <Button type='submit' variant='primary' className='mt-3' disabled={loadingCreate}>
          {loadingCreate ? 'Création...' : 'Créer et Activer'}
        </Button>
      </Form>

      <h5 className="mt-4">Bannières Existantes</h5>
      {isLoading || loadingDelete ? <p>Chargement...</p> : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>OFFRE PRINCIPALE</th>
              <th>DATE DE FIN</th>
              <th>ACTIVE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner._id}>
                <td>{banner.mainOfferText}</td>
                <td>{new Date(banner.endDate).toLocaleDateString()}</td>
                <td>{banner.isActive ? '✅' : '❌'}</td>
                <td>
                  <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(banner._id)}>
                    🗑️
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default PromoBannerListScreen;