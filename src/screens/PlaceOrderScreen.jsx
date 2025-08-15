import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card, Form, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { useCreateOrderMutation, useValidateCouponMutation } from '../slices/orderApiSlice';
import { clearCartItems, applyCoupon, removeCoupon } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  // --- NOUVEAUX ÉTATS ET LOGIQUE POUR LE COUPON ---
  const [couponCode, setCouponCode] = useState('');
  const [validateCoupon, { isLoading: loadingCoupon }] = useValidateCouponMutation();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      const res = await validateCoupon({ couponCode }).unwrap();
      dispatch(applyCoupon(res));
      toast.success('Coupon appliqué avec succès !');
    } catch (err) {
      toast.error(err?.data?.message || 'Coupon invalide ou expiré');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    toast.info('Coupon retiré.');
    setCouponCode('');
  };
  // --- FIN DE L'AJOUT DE LA LOGIQUE ---

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
        coupon: cart.coupon, // On envoie les infos du coupon
      }).unwrap();

      dispatch(clearCartItems());

      if (res.paymentMethod === 'Cash') {
        toast.success('Votre commande a été validée !');
        navigate(`/order/${res._id}`);
      } else {
        navigate(`/payment-gateway/${res._id}`);
      }

    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return (
    <>
      <CheckoutSteps step={3} />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item><h2>Livraison</h2><p><strong>Adresse: </strong>{cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}{cart.shippingAddress.country}</p></ListGroup.Item>
            <ListGroup.Item><h2>Paiement</h2><p><strong>Méthode: </strong>{cart.paymentMethod}</p></ListGroup.Item>
            <ListGroup.Item>
              <h2>Articles</h2>
              {cart.cartItems.length === 0 ? <Message>Votre panier est vide</Message>
              : ( <ListGroup variant='flush'>{cart.cartItems.map((item, index) => {
                let imageToDisplay = 'https://via.placeholder.com/150';
                if (item.images && item.images.length > 0) {
                  imageToDisplay = item.images[0];
                } else if (item.image) {
                  imageToDisplay = item.image;
                }
                const imageUrl = imageToDisplay.startsWith('/')
                  ? `${import.meta.env.VITE_BACKEND_URL}${imageToDisplay}`
                  : imageToDisplay;
                return (
                  <ListGroup.Item key={index}>
                    <Row>
                      <Col md={1}><Image src={imageUrl} alt={item.name} fluid rounded /></Col>
                      <Col><Link to={`/product/${item._id}`}>{item.name}</Link></Col>
                      <Col md={4} className="text-end">{item.qty} x {item.price} FCFA = {(item.qty * item.price).toFixed(2)} FCFA</Col>
                    </Row>
                  </ListGroup.Item>
                );
              })}</ListGroup>)}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item><h2>Récapitulatif</h2></ListGroup.Item>

              {/* --- SECTION COUPON AJOUTÉE --- */}
              <ListGroup.Item>
                {cart.coupon ? (
                  <div>
                    <p className="text-success mb-1">Coupon "{cart.coupon.code}" appliqué !</p>
                    <Button variant="outline-danger" size="sm" onClick={handleRemoveCoupon}>
                      Retirer le coupon
                    </Button>
                  </div>
                ) : (
                  <Form onSubmit={handleApplyCoupon}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Code promo"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button type="submit" variant="outline-secondary" disabled={loadingCoupon}>
                        {loadingCoupon ? '...' : 'Appliquer'}
                      </Button>
                    </InputGroup>
                  </Form>
                )}
              </ListGroup.Item>
              {/* --- FIN DE LA SECTION COUPON --- */}

              <ListGroup.Item>
                <Row><Col>Sous-total</Col><Col>{(cart.itemsPrice || 0).toFixed(2)} FCFA</Col></Row>
              </ListGroup.Item>

              {/* --- AFFICHAGE DE LA RÉDUCTION --- */}
              {cart.coupon && (
                <ListGroup.Item>
                  <Row className="text-danger">
                    <Col>Réduction ({cart.coupon.code})</Col>
                    <Col>-{(cart.coupon.discountAmountApplied || 0).toFixed(2)} FCFA</Col>
                  </Row>
                </ListGroup.Item>
              )}
              {/* --- FIN DE L'AFFICHAGE --- */}

              <ListGroup.Item>
                <Row><Col>Total</Col><Col><strong>{(cart.totalPrice || 0).toFixed(2)} FCFA</strong></Col></Row>
              </ListGroup.Item>

              <ListGroup.Item>{error && (<Message variant='danger'>{error.data.message}</Message>)}</ListGroup.Item>
              
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block w-100'
                  disabled={cart.cartItems.length === 0 || isLoading}
                  onClick={placeOrderHandler}
                >
                  {isLoading ? 'Chargement...' : cart.paymentMethod === 'Cash' ? 'Valider la Commande' : 'Continuer vers le Paiement'}
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;