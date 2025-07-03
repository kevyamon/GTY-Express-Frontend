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

  const imageUrl = /* ... code existant ... */;

  const addToCartHandler = () => { /* ... code existant ... */ };

  const toggleFavoriteHandler = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product._id));
      toast.info('Produit retiré des favoris');
    } else {
      dispatch(addToFavorites(product));
      toast.success('Produit ajouté aux favoris');
    }
  };

  return (
    <Card className="my-3 p-3 rounded h-100 position-relative">
      {/* ... badge de promo ... */}
      <button onClick={toggleFavoriteHandler} className="favorite-btn">
        {isFavorite ? '❤️' : '🤍'}
      </button>
      <Link to={`/product/${product._id}`}>
        <Card.Img src={imageUrl} variant="top" className="card-img-top" />
      </Link>
      <Card.Body>
        {/* ... reste de la carte ... */}
      </Card.Body>
    </Card>
  );
};

export default Product;