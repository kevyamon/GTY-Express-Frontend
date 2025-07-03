import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useEffect } from 'react';
import './HomeScreen.css';

const HomeScreen = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <div className='home-screen-background'>
      {isLoading ? (
        <h2>Chargement...</h2>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1 className='home-screen-title'>Derniers Produits</h1>
          {/* LA MODIFICATION EST SUR CETTE LIGNE */}
          <Row xs={1} md={2} className="g-2">
            {products.map((product) => (
              <Col key={product._id} xs={6} md={6} lg={4} xl={3}>
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