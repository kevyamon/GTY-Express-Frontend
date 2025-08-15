import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, Form, InputGroup, Image, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import Message from '../../components/Message';
import { useGetProductsQuery, useDeleteProductMutation } from '../../slices/productsApiSlice';
import './ProductListScreen.css'; // On importe notre nouveau style

const ProductListScreen = () => {
  const { data: products, isLoading, error } = useGetProductsQuery({ category: 'all' });
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');

  // Filtre les produits en fonction de la recherche (nom, catégorie, marque)
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [products, searchQuery]);

  const deleteHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(id);
        toast.success('Produit supprimé');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className='align-items-center mb-4'>
        <Col><h1>Gestion des Produits</h1></Col>
        <Col md="auto" className="my-2 my-md-0">
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md="auto" className="text-end">
          <Button onClick={() => navigate('/admin/product/add')}>
            <FaPlus className="me-2" /> Créer un Produit
          </Button>
        </Col>
      </Row>

      {loadingDelete && <p>Suppression...</p>}
      {isLoading ? (<p>Chargement...</p>) 
       : error ? (<Message variant='danger'>{error?.data?.message || error.message}</Message>) 
       : (
        <div>
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-list-card">
              <Image 
                src={(product.images && product.images[0]) || 'https://via.placeholder.com/150'} 
                alt={product.name} 
                className="product-list-image" 
              />
              <div className="product-list-info">
                <div className="name">{product.name}</div>
                <div className="price">{product.price} FCFA</div>
                <div className="stock">Stock: {product.countInStock} | <Badge bg="info">{product.category}</Badge></div>
              </div>
              <div className="product-list-actions">
                <Button variant='light' className='btn-sm' onClick={() => navigate(`/admin/product/${product._id}/edit`)}>
                  <FaEdit />
                </Button>
                <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(product._id)}>
                  <FaTrash />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProductListScreen;