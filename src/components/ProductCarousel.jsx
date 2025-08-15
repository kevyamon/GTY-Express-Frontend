// src/components/ProductCarousel.jsx
import { Row, Col } from 'react-bootstrap';
import Product from './Product';
import Message from './Message';
import './ProductCarousel.css'; // Nous allons créer ce fichier juste après

const ProductCarousel = ({ title, products, isLoading, error }) => {
  if (isLoading) {
    return null; // On n'affiche rien pendant le chargement pour ne pas surcharger
  }

  if (error) {
    return <Message variant='danger'>{error?.data?.message || error.error}</Message>;
  }

  // On n'affiche la section que s'il y a des produits à montrer
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className='carousel-container my-4'>
      <h2 className='carousel-title'>{title}</h2>
      <div className="product-row-scroll-container">
        <Row className="product-row-inner">
          {products.map((product) => (
            <Col key={product._id} className="p-1">
              <Product product={product} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default ProductCarousel;