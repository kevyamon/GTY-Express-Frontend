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

  // On récupère les favoris depuis le state Redux
  const { favoriteItems } = useSelector((state) => state.favorites);
  // On vérifie si ce produit est déjà dans les favoris
  const isFavorite = favoriteItems.some((p) => p._id === product._id);

  const imageUrl = product.image.startsWith('/')
    ? `${import.meta.env.VITE_BACKEND_URL}${product.image}`
    : product.image;

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success('Produit ajouté au panier !');
  };

  const toggleFavoriteHandler = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(product._id));
      toast.info('Produit retiré des favoris');
    } else {
      dispatch(addToFavorites(product));
      toast.success('Produit ajouté aux favoris');
    }
  };

  // Calcul de la promotion
  const hasPromo = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasPromo
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <Card className="my-3 p-3 rounded h-100">
      {/* On affiche le badge de promo si elle existe */}
      {hasPromo && <div className="discount-badge">-{discountPercent}%</div>}

      {/* On affiche le bouton coeur */}
      <button onClick={toggleFavoriteHandler} className="favorite-btn">
        {isFavorite ? '❤️' : '🤍'}
      </button>

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
          {/* On affiche le prix de vente actuel */}
          <Card.Text as="h4">{product.price} FCFA</Card.Text>
          {/* Si il y a une promo, on affiche le prix original barré */}
          {hasPromo && (
            <Card.Text as="span" className="original-price">
              {product.originalPrice} FCFA
            </Card.Text>
          )}
        </div>

        <Button
          className="btn-violet"
          type="button"
          disabled={product.countInStock === 0}
          onClick={addToCartHandler}
        >
          PANIER
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Product;