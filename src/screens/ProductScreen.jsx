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
import './ProductScreen.css'; // On importe nos nouveaux styles

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [index, setIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  // --- NOUVEL AJOUT : État pour gérer les avis étendus ---
  const [expandedReviews, setExpandedReviews] = useState({});

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
  
  // --- NOUVEL AJOUT : Fonction pour basculer l'affichage d'un avis ---
  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

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
  const REVIEW_TRUNCATE_LENGTH = 150;

  return (
    <div className="product-screen-container">
      <Link className="btn btn-light my-3" to="/products">Retour</Link>
      {isLoading ? (<h2>Chargement...</h2>) 
      : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) 
      : product && (
        <>
          <Row>
            <Col md={7} className="mb-3">
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
            <Col md={5} className="product-details-col">
              <div className="product-details-card">
                  {product.brand && <div className="product-brand">{product.brand}</div>}
                  <h3>{product.name}</h3>
                  <div className='my-2'><Rating value={product.rating} text={`${product.numReviews} avis`} /></div>
                  <div className="product-price-main">{product.price} FCFA</div>
                  <div className='mb-3'><StockStatus countInStock={product.countInStock} /></div>
                  
                  <div className="description-box">
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
                  </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-4">
              <Col md={{ span: 5, offset: 7 }}>
                <Card className="add-to-cart-card">
                    <ListGroup variant="flush">
                    <ListGroup.Item>
                        <span>Prix:</span>
                        <strong className="summary-price-value">{product.price} FCFA</strong>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <span>Statut:</span>
                        <StockStatus countInStock={product.countInStock} />
                    </ListGroup.Item>
                    {product.countInStock > 0 && (
                        <ListGroup.Item>
                        <span>Quantité:</span>
                        <QtySelector value={qty} onChange={setQty} max={product.countInStock} />
                        </ListGroup.Item>
                    )}
                    <ListGroup.Item>
                        <Button className="btn-custom-primary" type="button" disabled={product.countInStock === 0} onClick={addToCartHandler}>
                        Ajouter au Panier
                        </Button>
                    </ListGroup.Item>
                    </ListGroup>
                </Card>
              </Col>
          </Row>

          <Row className="reviews mt-4">
            <Col>
              <Card className="add-to-cart-card">
                <Card.Body>
                  <h2>Avis des clients</h2>
                  {product.reviews.length === 0 && <Message>Aucun avis pour le moment.</Message>}
                  <ListGroup variant='flush'>
                    {/* --- DÉBUT DE LA MODIFICATION DE L'AFFICHAGE DES AVIS --- */}
                    {product.reviews.map(review => {
                      const isExpanded = expandedReviews[review._id];
                      const isLongReview = review.comment.length > REVIEW_TRUNCATE_LENGTH;
                      return (
                        <ListGroup.Item key={review._id} className="review-item">
                          <div className="review-header">
                            <div className="review-user-info">
                              <strong>{review.name}</strong>
                              <span className="review-date">{new Date(review.createdAt).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <Rating value={review.rating} />
                          </div>
                          <p className="review-comment">
                            {isLongReview && !isExpanded ? `${review.comment.substring(0, REVIEW_TRUNCATE_LENGTH)}...` : review.comment}
                          </p>
                          {isLongReview && (
                            <Button variant="link" className="toggle-review-btn" onClick={() => toggleReviewExpansion(review._id)}>
                              {isExpanded ? 'Réduire' : 'Lire la suite'}
                            </Button>
                          )}
                        </ListGroup.Item>
                      );
                    })}
                    {/* --- FIN DE LA MODIFICATION --- */}
                    <ListGroup.Item className="review-form-card">
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
                            <Button disabled={loadingReview} type='submit' className="btn-custom-primary mt-2">
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
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ProductScreen;