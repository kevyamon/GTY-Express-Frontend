import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import {
  addToFavorites,
  removeFromFavorites,
} from '../slices/favoritesSlice';
import { toast } from 'react-toastify';
import './Product.css';

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const { favoriteItems } = useSelector((state) => state.favorites);
  const isFavorite = favoriteItems.some((p) => p._id === product._id);
  const imageUrl = product.image.startsWith('/') ? `${import.meta.env.VITE_BACKEND_URL}${product.image}`: product.image;
  const addToCartHandler = () => { dispatch(addToCart({ ...product, qty: 1 })); toast.success('Produit ajouté au panier !'); };
  const toggleFavoriteHandler = () => { /* ... */ };

  // Calcul de la promotion
  const hasPromo = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasPromo ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <Card className="my-3 p-3 rounded h-100 position-relative">
      {hasPromo && (
        <div className="discount-badge">-{discountPercent}%</div>
      )}
      <button onClick={toggleFavoriteHandler} className="favorite-btn">{isFavorite ? '❤️' : '🤍'}</button>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={imageUrl} variant="top" className="card-img-top" />
      </Link>

      <Card.Body className="d-flex flex-column product-card-body">
        <Card.Title as="div" className="product-title flex-grow-1">
          <Link to={`/product/${product._id}`}>
            <strong>{product.name}</strong>
          </Link>
        </Card.Title>

        <div className="price-container">
          <Card.Text as="h4">{product.price} FCFA</Card.Text>
          {hasPromo && (
            <Card.Text as="span" className="original-price">
              <del>{product.originalPrice} FCFA</del>
            </Card.Text>
          )}
        </div>

        <Button className="btn-violet" type="button" disabled={product.countInStock === 0} onClick={addToCartHandler}>
          PANIER
        </Button>
      </Card.Body>
    </Card>
  );
};
export default Product;