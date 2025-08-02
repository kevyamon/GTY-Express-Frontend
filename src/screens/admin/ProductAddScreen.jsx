import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Image, ListGroup, Spinner } from 'react-bootstrap';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useCreateProductMutation } from '../../slices/productsApiSlice';
import { useGetPromotionsQuery } from '../../slices/promotionApiSlice';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const ProductAddScreen = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [images, setImages] = useState([]);
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [isSupermarket, setIsSupermarket] = useState(false);
  const [promotion, setPromotion] = useState('');
  const [loadingUpload, setLoadingUpload] = useState(false);

  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const { data: promotions, isLoading: loadingPromotions } = useGetPromotionsQuery();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createProduct({
        name,
        price: Number(price),
        originalPrice: Number(originalPrice),
        brand,
        images,
        countInStock: Number(countInStock),
        description,
        isSupermarket,
        promotion: promotion === '' ? undefined : promotion,
      }).unwrap();
      toast.success('Produit créé avec succès');
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    setLoadingUpload(true);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData, config);
      toast.success('Image téléversée');
      setImages([...images, data.secure_url]);
      setLoadingUpload(false);
    } catch (error) {
      toast.error("Le téléversement a échoué");
      setLoadingUpload(false);
    }
  };

  const deleteImageHandler = (imageToDelete) => {
    if (window.confirm("Êtes-vous sûr de vouloir retirer cette image ?")) {
      setImages(images.filter(img => img !== imageToDelete));
      toast.info('Image retirée');
    }
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>Retour</Link>
      <h1>Créer un Produit</h1>
      {loadingCreate && <p>Création en cours...</p>}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name' className='my-2'>
          <Form.Label>Nom</Form.Label>
          <Form.Control type='text' placeholder='Entrez le nom' value={name} onChange={(e) => setName(e.target.value)} required/>
        </Form.Group>
        <Row>
            <Col><Form.Group controlId='brand' className='my-2'><Form.Label>Marque</Form.Label><Form.Control type='text' placeholder='Entrez la marque' value={brand} onChange={(e) => setBrand(e.target.value)} /></Form.Group></Col>
            <Col><Form.Group controlId='countInStock' className='my-2'><Form.Label>Stock</Form.Label><Form.Control type='number' placeholder='Entrez le stock' value={countInStock} onChange={(e) => setCountInStock(e.target.value)} required/></Form.Group></Col>
        </Row>
        <Row>
          <Col><Form.Group controlId='originalPrice' className='my-2'><Form.Label>Prix Original (Optionnel)</Form.Label><Form.Control type='number' placeholder='Prix barré' value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} /></Form.Group></Col>
          <Col><Form.Group controlId='price' className='my-2'><Form.Label>Prix de Vente</Form.Label><Form.Control type='number' placeholder='Prix de vente' value={price} onChange={(e) => setPrice(e.target.value)} required/></Form.Group></Col>
        </Row>
        <Form.Group controlId='images' className='my-2'>
          <Form.Label>Images</Form.Label>
          <ListGroup variant="flush" className="mb-2">
            {images.map((img, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                <Image src={img} alt={`Aperçu ${index+1}`} thumbnail style={{height: '60px'}}/>
                <Form.Control type="text" value={img} readOnly className="mx-2"/>
                <Button variant="danger" size="sm" onClick={() => deleteImageHandler(img)}>X</Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <Form.Control label='Ajouter une image' onChange={uploadFileHandler} type='file' />
          {loadingUpload && <p>Téléversement...</p>}
        </Form.Group>
        <Form.Group controlId='description' className='my-2'><Form.Label>Description</Form.Label><Form.Control as='textarea' rows={3} placeholder='Entrez la description' value={description} onChange={(e) => setDescription(e.target.value)} required/></Form.Group>
        <Form.Group controlId='isSupermarket' className='my-3'><Form.Check type='checkbox' label='Produit de type Supermarché' checked={isSupermarket} onChange={(e) => setIsSupermarket(e.target.checked)} /></Form.Group>
        <Form.Group controlId='promotion' className='my-3'>
          <Form.Label>Associer à une promotion (Optionnel)</Form.Label>
          <Form.Select value={promotion} onChange={(e) => setPromotion(e.target.value)}>
            <option value=''>Aucune promotion</option>
            {loadingPromotions ? <option>Chargement...</option> : 
              promotions?.map(p => <option key={p._id} value={p._id}>{p.name}</option>)
            }
          </Form.Select>
        </Form.Group>
        <Button type='submit' variant='primary' style={{ marginTop: '1rem' }} disabled={loadingCreate}>
          Créer le Produit
        </Button>
      </Form>
    </>
  );
};

export default ProductAddScreen;