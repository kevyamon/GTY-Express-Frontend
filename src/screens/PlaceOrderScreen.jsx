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

      // On affiche la notification spéciale
      toast(
        <div>
          📢 Commande validée ! Elle est en cours de traitement.
        </div>,
        {
          position: 'top-center',
          autoClose: 5000, // Laisser la notif 5 secondes
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      // On attend 5 secondes avant de rediriger
      setTimeout(() => {
        navigate('/cart');
      }, 5000);

    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <CheckoutSteps step={4} />
      <Row>
        <Col md={8}>
          {/* ... Le reste de la page ne change pas ... */}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item><h2>Récapitulatif</h2></ListGroup.Item>
              <ListGroup.Item>
                <Row><Col>Articles</Col><Col>{(cart.itemsPrice || 0).toFixed(2)} FCFA</Col></Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row><Col>Frais de port</Col><Col>{(cart.shippingPrice || 0).toFixed(2)} FCFA</Col></Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row><Col>Taxes</Col><Col>{(cart.taxPrice || 0).toFixed(2)} FCFA</Col></Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row><Col>Total</Col><Col>{(cart.totalPrice || 0).toFixed(2)} FCFA</Col></Row>
              </ListGroup.Item>
              {/* ... Le reste de la page ne change pas ... */}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;