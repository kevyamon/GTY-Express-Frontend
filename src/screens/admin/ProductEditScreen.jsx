import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
} from '../../slices/productsApiSlice';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [image, setImage] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  const [loadingUpload, setLoadingUpload] = useState(false);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        originalPrice,
        image,
        countInStock,
        description,
      }).unwrap();
      toast.success('Produit mis à jour');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setOriginalPrice(product.originalPrice || 0);
      setImage(product.image);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    setLoadingUpload(true);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        config
      );
      toast.success('Image téléversée');
      setImage(data.secure_url);
      setLoadingUpload(false);
    } catch (error) {
      toast.error("Le téléversement a échoué");
      setLoadingUpload(false);
    }
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>Retour</Link>
      <h1>Modifier le Produit</h1>
      {loadingUpdate && <p>Mise à jour...</p>}
      {isLoading ? (<p>Chargement...</p>) 
      : error ? (<Message variant='danger'>{error.data.message}</Message>) 
      : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name' className='my-2'>
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type='text'
              placeholder='Entrez le nom'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Row>
            <Col>
              <Form.Group controlId='originalPrice' className='my-2'>
                <Form.Label>Prix Original (pour la promo)</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Entrez le prix original'
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))} // CORRECTION ICI
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId='price' className='my-2'>
                <Form.Label>Prix de Vente Actuel</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Entrez le prix de vente'
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))} // CORRECTION ICI
                ></Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId='image' className='my-2'>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type='text'
              placeholder="URL de l'image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            ></Form.Control>
            <Form.Control
              label='Choisir un fichier'
              onChange={uploadFileHandler}
              type='file'
            ></Form.Control>
            {loadingUpload && <p>Téléversement de l'image...</p>}
          </Form.Group>

          <Form.Group controlId='countInStock' className='my-2'>
            <Form.Label>Stock</Form.Label>
            <Form.Control
              type='number'
              placeholder='Entrez le stock'
              value={countInStock}
              onChange={(e) => setCountInStock(Number(e.target.value))} // CORRECTION ICI
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='description' className='my-2'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              placeholder='Entrez la description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' style={{ marginTop: '1rem' }}>
            Mettre à jour
          </Button>
        </Form>
      )}
    </>
  );
};

export default ProductEditScreen;