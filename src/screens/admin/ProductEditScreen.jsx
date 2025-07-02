import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productsApiSlice';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        countInStock,
        description,
      }).unwrap();
      toast.success('Produit mis à jour avec succès');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      // CORRECTION ICI : On gère tous les types d'erreurs
      toast.error(err?.data?.message || err.error || err.message);
    }
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error || err.message);
    }
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Retour
      </Link>
      <h1>Modifier le Produit</h1>
      {loadingUpdate && <p>Mise à jour...</p>}
      {isLoading ? (
        <p>Chargement...</p>
      ) : error ? (
        <Message variant='danger'>{error.data.message}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Nom</Form.Label>
            <Form.Control
              type='name'
              placeholder='Entrez le nom'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='price' className='my-2'>
            <Form.Label>Prix</Form.Label>
            <Form.Control
              type='number'
              placeholder='Entrez le prix'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            ></Form.Control>
          </Form.Group>

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
              onChange={(e) => setCountInStock(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId='description' className='my-2'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type='text'
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