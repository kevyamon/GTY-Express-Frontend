import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { addToFavorites, removeFromFavorites } from '../slices/favoritesSlice';
import { toast } from 'react-toastify';
import { FaCartPlus } from 'react-icons/fa';
import StockStatus from './StockStatus';
import './Product.css';

// On reçoit productIndex en prop
const Product = ({ product, productIndex }) => {
  const dispatch = useDispatch();
  const { favoriteItems } = useSelector((state) => state.favorites);
  const isFavorite = favoriteItems.some((p) => p._id === product._id);

  // Le produit est considéré comme "nouveau" s'il est dans les 3 premiers de la liste
  const isNew = productIndex < 3;

  let imageToDisplay = 'https://via.placeholder.com/300';
  if (product.images && product.images.length > 0) {
    imageToDisplay = product.images[0];
  } else if (product.image) {
    imageToDisplay = product.image;
  }
  const imageUrl = imageToDisplay.startsWith('/')
    ? `${import.meta.env.VITE_BACKEND_URL}${imageToDisplay}`
    : imageToDisplay;

  const addToCartHandler = (e) => {
    e.preventDefault();
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

  const hasPromo = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasPromo
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="product-card my-3 p-0">
      <div className="product-image-container">
        <Link to={`/product/${product._id}`}>
          <Card.Img src={imageUrl} variant="top" className="product-card-img" />
        </Link>

        {/* LOGIQUE D'AFFICHAGE DES BADGES */}
        {isNew && !hasPromo && <div className="new-badge">Nouveau</div>}
        {hasPromo && <div className="discount-badge">-{discountPercent}%</div>}

        <button onClick={toggleFavoriteHandler} className="favorite-btn">
          {isFavorite ? '❤️' : '🤍'}
        </button>
        <button 
          onClick={addToCartHandler} 
          disabled={product.countInStock === 0} 
          className="add-to-cart-icon"
          aria-label="Ajouter au panier"
        >
          <FaCartPlus />
        </button>
      </div>

      <Card.Body className="product-card-body">
        <div className="product-title">
          <Link to={`/product/${product._id}`}>
            {product.name}
          </Link>
        </div>

        <div className="price-container">
          <span className="product-price">{product.price} FCFA</span>
          {hasPromo && (
            <span className="original-price">
              {product.originalPrice} FCFA
            </span>
          )}
        </div>

        <div className="stock-status-container">
            <StockStatus countInStock={product.countInStock} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default Product;