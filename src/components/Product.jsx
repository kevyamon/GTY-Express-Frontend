import { Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import './Product.css'; // On importe notre nouveau fichier de style

const Product = ({ product }) => {
  const dispatch = useDispatch();

  const imageUrl = product.image.startsWith('/')
    ? `${import.meta.env.VITE_BACKEND_URL}${product.image}`
    : product.image;

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success('Produit ajouté au panier !');
  };

  return (
    <Card className="my-3 p-3 rounded h-100">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={imageUrl} variant="top" className="card-img-top" />
      </Link>

      <Card.Body className="d-flex flex-column product-card-body">
        <Card.Title as="div" className="product-title flex-grow-1">
          <Link to={`/product/${product._id}`}>
            <strong>{product.name}</strong>
          </Link>
        </Card.Title>

        <Card.Text as="h4">{product.price} FCFA</Card.Text>

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