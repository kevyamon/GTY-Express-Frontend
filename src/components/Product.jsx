import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  // Gère l'affichage des images locales et celles de Cloudinary
  const imageUrl = product.image.startsWith('/')
    ? `${import.meta.env.VITE_BACKEND_URL}${product.image}`
    : product.image;

  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        <Card.Img src={imageUrl} variant="top" />
      </Link>
      <Card.Body>
        <Link to={`/product/${product._id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="h3">{product.price} FCFA</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;