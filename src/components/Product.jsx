import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { addToFavorites, removeFromFavorites } from '../slices/favoritesSlice';
import { toast } from 'react-toastify';
import { FaCartPlus } from 'react-icons/fa';
import StockStatus from './StockStatus';
import './Product.css';

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const { favoriteItems } = useSelector((state) => state.favorites);
  const isFavorite = favoriteItems.some((p) => p._id === product._id);

  // --- LOGIQUE "NOUVEAU" AMÉLIORÉE ET SÉCURISÉE ---
  const isNew = () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return new Date(product.createdAt) > threeDaysAgo;
  };

  const hasPromo = product.originalPrice && product.originalPrice > product.price;

  // Calcul sécurisé du pourcentage
  const discountPercent = hasPromo
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

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

  return (
    <Card className="product-card my-3 p-0">
      <div className="product-image-container">
        <Link to={`/product/${product._id}`}>
          <Card.Img src={imageUrl} variant="top" className="product-card-img" />
        </Link>

        {/* Utilisation de ternaires pour un affichage 100% sûr */}
        {hasPromo ? (
          <div className="discount-badge">-{discountPercent}%</div>
        ) : isNew() ? (
          <div className="new-badge">Nouveau</div>
        ) : null}

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
          {hasPromo ? (
            <span className="original-price">
              {product.originalPrice} FCFA
            </span>
          ) : null}
        </div>

        <div className="stock-status-container">
          <StockStatus countInStock={product.countInStock} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default Product;