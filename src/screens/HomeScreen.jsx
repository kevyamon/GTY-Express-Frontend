import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useEffect } from 'react';
import './HomeScreen.css'; // On importe notre nouveau fichier de style

const HomeScreen = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className='home-screen-background'> {/* On applique notre nouveau fond ici */}
      {isLoading ? (
        <h2>Chargement...</h2>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1 className='home-screen-title'>Derniers Produits</h1>
          {/* Cette ligne organise les produits en grille */}
          <Row xs={1} md={2} className="g-4">
            {products.map((product) => (
              <Col key={product._id}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default HomeScreen;