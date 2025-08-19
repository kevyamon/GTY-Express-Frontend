import { Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Message from '../components/Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';
import './HomeScreen.css'; // On réutilise le style de la page d'accueil

const TopProductsScreen = () => {
  // On appelle la requête sans limite pour tout récupérer
  const { data: topProducts, isLoading, error } = useGetTopProductsQuery();

  return (
    <Container fluid>
      <div className='home-screen-background'>
        <Link to='/products' className='btn btn-light mb-4'>
          Retour
        </Link>
        
        <h1 className='home-screen-title'>⭐ Produits les Mieux Notés</h1>

        {isLoading ? (
          <h2>Chargement...</h2>
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : (
          <>
            {topProducts && topProducts.length === 0 ? (
              <Message>Aucun produit n'a encore été suffisamment bien noté.</Message>
            ) : (
              <Row className="product-grid">
                {topProducts.map((product) => (
                  <Col key={product._id} xs={6} sm={6} md={4} lg={3} xl={2} className="p-1 p-md-2">
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default TopProductsScreen;