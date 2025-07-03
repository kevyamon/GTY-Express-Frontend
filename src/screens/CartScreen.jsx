import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import QtySelector from '../components/QtySelector'; // Importer notre nouveau composant

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const updateQtyHandler = (item, newQty) => {
    dispatch(addToCart({ ...item, qty: newQty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>Panier</h1>
        {cartItems.length === 0 ? (
          <Message>
            Votre panier est vide <Link to='/products'>Retour</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row className="align-items-center">
                  <Col md={2}>
                    <Image src={item.image.startsWith('/') ? `${import.meta.env.VITE_BACKEND_URL}${item.image}` : item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>{item.price} FCFA</Col>
                  <Col md={3}>
                    {/* On remplace l'ancien champ par notre nouveau composant */}
                    <QtySelector
                      value={item.qty}
                      onChange={(newQty) => updateQtyHandler(item, newQty)}
                      max={item.countInStock}
                    />
                  </Col>
                  <Col md={2}>
                    <Button
                      type='button'
                      variant='light'
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      🗑️
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>
                Sous-total ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                articles
              </h2>
              {cart.itemsPrice.toFixed(2)} FCFA
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block'
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Passer la commande
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;