import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Row,
  Col,
  ListGroup,
  Image,
  Button,
  Card,
} from 'react-bootstrap';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import QtySelector from '../components/QtySelector';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const { userInfo } = useSelector((state) => state.auth);

  const updateQtyHandler = (item, newQty) => {
    dispatch(addToCart({ ...item, qty: newQty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    if (userInfo) {
      navigate('/shipping');
    } else {
      navigate('/login?redirect=/shipping');
    }
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
            {cartItems.map((item) => {
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
                <ListGroup.Item key={item._id}>
                  {/* --- CORRECTION POUR LE RESPONSIVE --- */}
                  <Row className="align-items-center">
                    {/* Colonne Image (petite sur mobile) */}
                    <Col xs={3} md={2}>
                      <Image src={imageUrl} alt={item.name} fluid rounded />
                    </Col>
                    {/* Colonne Titre (prend le reste de la ligne sur mobile) */}
                    <Col xs={9} md={3}>
                      <Link to={`/product/${item._id}`}>{item.name}</Link>
                    </Col>
                    {/* Colonne Prix (visible uniquement sur grand écran) */}
                    <Col md={2} className="d-none d-md-block">{item.price} FCFA</Col>
                    {/* Colonne Quantité (prend la moitié de la largeur sur mobile) */}
                    <Col xs={8} md={3} className="mt-2 mt-md-0">
                      <QtySelector
                        value={item.qty}
                        onChange={(newQty) => updateQtyHandler(item, newQty)}
                        max={item.countInStock}
                      />
                    </Col>
                    {/* Colonne Supprimer (prend l'autre moitié sur mobile) */}
                    <Col xs={4} md={2} className="text-end mt-2 mt-md-0">
                      <Button
                        type='button'
                        variant='light'
                        onClick={() => removeFromCartHandler(item._id)}
                      >
                        🗑️
                      </Button>
                    </Col>
                  </Row>
                  {/* --- FIN DE LA CORRECTION --- */}
                </ListGroup.Item>
              );
            })}
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
              {(cart.itemsPrice || 0).toFixed(2)} FCFA
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type='button'
                className='btn-block w-100'
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