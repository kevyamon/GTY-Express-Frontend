import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form, Carousel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice.js';
import { addToCart } from '../slices/cartSlice';
import QtySelector from '../components/QtySelector';
import StockStatus from '../components/StockStatus';
import Message from '../components/Message';
import './ProductScreen.css'; // On importe notre nouveau style

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [index, setIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); // État pour la description

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    if (error) {
      toast.error("Ce produit n'existe plus ou a été déplacé.");
      navigate('/products');
    }
  }, [error, navigate]);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success('Produit ajouté au panier !');
  };

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const getImageUrl = (url) => {
    return url.startsWith('/') ? `${import.meta.env.VITE_BACKEND_URL}${url}` : url;
  };

  // On définit ici le nombre de caractères maximum avant de cacher le reste
  const TRUNCATE_LENGTH = 250;

  return (
    <>
      <Link className="btn btn-light my-3" to="/products">Retour</Link>
      {isLoading ? (<h2>Chargement...</h2>) 
      : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) 
      : (
        <Row>
          <Col md={6}>
            {product.images && product.images.length > 1 ? (
              <Carousel activeIndex={index} onSelect={handleSelect} interval={3000} pause="hover">
                {product.images.map((imgUrl) => (
                  <Carousel.Item key={imgUrl}>
                    <Image src={getImageUrl(imgUrl)} alt={product.name} fluid />
                  </Carousel.Item>
                ))}
              </Carousel>
            ) : (
              <Image 
                src={product.images && product.images.length === 1 ? getImageUrl(product.images[0]) : (product.image ? getImageUrl(product.image) : '/images/sample.jpg')} 
                alt={product.name} 
                fluid 
              />
            )}
          </Col>
          <Col md={6}>
            <ListGroup variant="flush">
              <ListGroup.Item><h3>{product.name}</h3></ListGroup.Item>
              <ListGroup.Item>
                <StockStatus countInStock={product.countInStock} />
              </ListGroup.Item>
              <ListGroup.Item>Prix: {product.price} FCFA</ListGroup.Item>
              <ListGroup.Item className="description-box">
                <strong>Description:</strong>
                <p>
                  {/* LOGIQUE POUR AFFICHER/MASQUER LA DESCRIPTION */}
                  {product.description.length > TRUNCATE_LENGTH && !isDescriptionExpanded
                    ? `${product.description.substring(0, TRUNCATE_LENGTH)}...`
                    : product.description}
                </p>
                {product.description.length > TRUNCATE_LENGTH && (
                  <button onClick={toggleDescription} className="toggle-description-btn">
                    {isDescriptionExpanded ? 'Réduire' : 'Lire la suite >'}
                  </button>
                )}
              </ListGroup.Item>
            </ListGroup>
            <Card className="mt-3">
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row><Col>Prix:</Col><Col><strong>{product.price} FCFA</strong></Col></Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row><Col>Statut:</Col><Col><StockStatus countInStock={product.countInStock} /></Col></Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qté</Col>
                      <Col><QtySelector value={qty} onChange={setQty} max={product.countInStock} /></Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button className="btn-block" type="button" disabled={product.countInStock === 0} onClick={addToCartHandler}>
                    Ajouter au Panier
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;