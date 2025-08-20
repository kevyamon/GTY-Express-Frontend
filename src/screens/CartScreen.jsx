import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, Button, Card } from 'react-bootstrap'; // ListGroup et ListGroup.Item retirés
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import StockStatus from '../components/StockStatus';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import QtySelector from '../components/QtySelector';
import './CartScreen.css';

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

  const getImageUrl = (item) => {
    let imageToDisplay = 'https://via.placeholder.com/150';
    if (item.images && item.images.length > 0) {
      imageToDisplay = item.images[0];
    } else if (item.image) {
      imageToDisplay = item.image;
    }
    return imageToDisplay.startsWith('/')
      ? `${import.meta.env.VITE_BACKEND_URL}${imageToDisplay}`
      : imageToDisplay;
  };

  return (
    <Row className="cart-screen">
      <Col md={8}>
        <h1>Mon Panier</h1>
        {cartItems.length === 0 ? (
          <div className="empty-cart-container">
            <FaShoppingCart className="empty-cart-icon" />
            <h2 className="mt-3">Votre panier est tristement vide</h2>
            <p>Parcourez nos rayons pour trouver des articles qui vous plaisent !</p>
            <Link to='/products' className='btn btn-primary mt-3'>
              Continuer mes achats
            </Link>
          </div>
        ) : (
          // --- MODIFICATION : Remplacement de ListGroup par un div ---
          <div className="cart-items-container"> 
            {cartItems.map((item) => (
              // --- MODIFICATION : Remplacement de ListGroup.Item par un div ---
              <div key={item._id} className="cart-item-card"> 
                <Image src={getImageUrl(item)} alt={item.name} className="cart-item-image" />
                
                <div className="cart-item-details">
                  <Link to={`/product/${item._id}`} className="cart-item-name">{item.name}</Link>
                  <div className="cart-item-price">{item.price.toFixed(2)} FCFA</div>
                  <StockStatus countInStock={item.countInStock} />
                </div>

                <div className="cart-item-actions">
                  <QtySelector
                    value={item.qty}
                    onChange={(newQty) => updateQtyHandler(item, newQty)}
                    max={item.countInStock}
                  />
                  <Button
                    type='button'
                    variant='link'
                    className="cart-remove-btn"
                    onClick={() => removeFromCartHandler(item._id)}
                  >
                    <FaTrash /> Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Col>
      
      {cartItems.length > 0 && (
        <Col md={4}>
          <Card className="cart-summary-card">
            <Card.Body>
              <Card.Title as="h4" className="summary-title">
                Sous-total ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) articles
              </Card.Title>
              <div className="summary-total">
                {(cart.itemsPrice || 0).toFixed(2)} FCFA
              </div>
              <Button
                type='button'
                className='checkout-btn'
                onClick={checkoutHandler}
              >
                Passer la commande
              </Button>
            </Card.Body>
          </Card>
        </Col>
      )}
    </Row>
  );
};

export default CartScreen;