import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form, Carousel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice.js';
import { useGetMyPurchasesQuery } from '../slices/orderApiSlice.js'; 
import { addToCart } from '../slices/cartSlice';
import QtySelector from '../components/QtySelector';
import StockStatus from '../components/StockStatus';
import Message from '../components/Message';
import Rating from '../components/Rating';
import './ProductScreen.css';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [index, setIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);
  
  const { data: purchaseHistory } = useGetMyPurchasesQuery(undefined, { skip: !userInfo });
  const hasPurchased = useMemo(() => {
    if (!purchaseHistory || !product) return false;
    return purchaseHistory.some(order => 
      order.status === 'Livrée' && 
      order.orderItems.some(item => item.product === product._id)
    );
  }, [purchaseHistory, product]);

  const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation();

  const handleSelect = (selectedIndex) => setIndex(selectedIndex);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const toggleDescription = () => setIsDescriptionExpanded(!isDescriptionExpanded);
  const getImageUrl = (url) => url.startsWith('/') ? `${import.meta.env.VITE_BACKEND_URL}${url}` : url;
  
  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success('Avis envoyé avec succès !');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const TRUNCATE_LENGTH = 250;

  return (
    <>
      <Link className="btn btn-light my-3" to="/products">Retour</Link>
      {isLoading ? (<h2>Chargement...</h2>) 
      : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) 
      : product && (
        <>
          <Row>
            <Col md={6} className="mb-3">
              <div className="product-image-gallery">
                {product.images && product.images.length > 1 ? (
                  <Carousel activeIndex={index} onSelect={handleSelect} interval={3000} pause="hover" variant="dark">
                    {product.images.map((imgUrl) => (
                      <Carousel.Item key={imgUrl}><Image src={getImageUrl(imgUrl)} alt={product.name} /></Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <Image 
                    src={product.images && product.images.length === 1 ? getImageUrl(product.images[0]) : (product.image ? getImageUrl(product.image) : 'https://via.placeholder.com/400')} 
                    alt={product.name} 
                  />
                )}
              </div>
            </Col>
            <Col md={6} className="product-details-col">
              <ListGroup variant="flush">
                <ListGroup.Item><h3>{product.name}</h3></ListGroup.Item>
                
                {/* --- MODIFICATION : AJOUT DE LA MARQUE --- */}
                {product.brand && (
                  <ListGroup.Item>
                    <span className="product-brand">{product.brand}</span>
                  </ListGroup.Item>
                )}
                {/* --- FIN DE LA MODIFICATION --- */}

                <ListGroup.Item>
                  <Rating value={product.rating} text={`${product.numReviews} avis`} />
                </ListGroup.Item>
                <ListGroup.Item><StockStatus countInStock={product.countInStock} /></ListGroup.Item>
                <ListGroup.Item>Prix: {product.price} FCFA</ListGroup.Item>
                <ListGroup.Item className="description-box">
                  <strong>Description:</strong>
                  <p onClick={toggleDescription} style={{ cursor: 'pointer' }}>
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
                  <ListGroup.Item><Row><Col>Prix:</Col><Col><strong>{product.price} FCFA</strong></Col></Row></ListGroup.Item>
                  <ListGroup.Item><Row><Col>Statut:</Col><Col><StockStatus countInStock={product.countInStock} /></Col></Row></ListGroup.Item>
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

          <Row className="reviews mt-4">
            <Col md={6}>
              <h2>Avis des clients</h2>
              {product.reviews.length === 0 && <Message>Aucun avis pour le moment.</Message>}
              <ListGroup variant='flush'>
                {product.reviews.map(review => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{new Date(review.createdAt).toLocaleDateString('fr-FR')}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Écrire un avis</h2>
                  {loadingReview && <p>Envoi de l'avis...</p>}
                  {userInfo ? (
                    hasPurchased ? (
                      <Form onSubmit={submitReviewHandler}>
                        <Form.Group controlId='rating' className='my-2'>
                          <Form.Label>Note</Form.Label>
                          <Form.Control as='select' value={rating} onChange={(e) => setRating(e.target.value)} required>
                            <option value=''>Sélectionner...</option>
                            <option value='1'>1 - Mauvais</option>
                            <option value='2'>2 - Passable</option>
                            <option value='3'>3 - Bon</option>
                            <option value='4'>4 - Très bon</option>
                            <option value='5'>5 - Excellent</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='comment' className='my-2'>
                          <Form.Label>Commentaire</Form.Label>
                          <Form.Control as='textarea' rows='3' value={comment} onChange={(e) => setComment(e.target.value)} required></Form.Control>
                        </Form.Group>
                        <Button disabled={loadingReview} type='submit' variant='primary'>
                          Envoyer
                        </Button>
                      </Form>
                    ) : (
                      <Message>Vous devez avoir acheté et reçu ce produit pour laisser un avis.</Message>
                    )
                  ) : (
                    <Message>Veuillez <Link to='/login'>vous connecter</Link> pour écrire un avis.</Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;