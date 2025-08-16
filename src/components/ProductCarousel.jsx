import { Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Product from './Product';
import Message from './Message';
import './ProductCarousel.css';

// --- AMÉLIORATION : On ajoute les props "linkTo" et "limit" ---
const ProductCarousel = ({ title, products, isLoading, error, linkTo, limit }) => {
  if (isLoading) {
    return null;
  }

  if (error) {
    return <Message variant='danger'>{error?.data?.message || error.error}</Message>;
  }

  if (!products || products.length === 0) {
    return null;
  }
  
  // Le bouton "Voir tout" ne s'affiche que si on atteint la limite de produits
  const showSeeAllButton = limit && products.length === limit;

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
          {/* --- NOUVEAU : Le bouton "Voir Tout" --- */}
          {showSeeAllButton && (
            <Col className="d-flex align-items-center justify-content-center see-all-card p-1">
              <LinkContainer to={linkTo}>
                <Button variant="outline-primary">Voir Tout</Button>
              </LinkContainer>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};

export default ProductCarousel;