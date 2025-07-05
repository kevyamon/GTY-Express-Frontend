import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { useCreateOrderMutation } from '../slices/orderApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

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
      }).unwrap();
      
      dispatch(clearCartItems());

      // CORRECTION DE LA LOGIQUE DE REDIRECTION
      if (res.paymentMethod === 'Cash') {
        toast.success('Votre commande a été validée !');
        navigate(`/order/${res._id}`);
      } else {
        // On redirige vers la nouvelle page de paiement dédiée
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
              : ( <ListGroup variant='flush'>{cart.cartItems.map((item, index) => (<ListGroup.Item key={index}><Row><Col md={1}><Image src={item.image.startsWith('/') ? `${import.meta.env.VITE_BACKEND_URL}${item.image}` : item.image} alt={item.name} fluid rounded /></Col><Col><Link to={`/product/${item._id}`}>{item.name}</Link></Col><Col md={4} className="text-end">{item.qty} x {item.price} FCFA = {(item.qty * item.price).toFixed(2)} FCFA</Col></Row></ListGroup.Item>))}</ListGroup>)}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item><h2>Récapitulatif</h2></ListGroup.Item>
              <ListGroup.Item><Row><Col>Total</Col><Col><strong>{(cart.totalPrice || 0).toFixed(2)} FCFA</strong></Col></Row></ListGroup.Item>
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