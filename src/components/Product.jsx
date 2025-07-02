import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  // On ajoute l'URL du backend devant le chemin de l'image
  const imageUrl = product.image.startsWith('/uploads/') 
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
        <Card.Text as="h3">{product.price} €</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;