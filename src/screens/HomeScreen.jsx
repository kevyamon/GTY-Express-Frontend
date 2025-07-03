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
          <Row>
            {products.map((product) => (
              // LA CORRECTION EST SUR CETTE LIGNE
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
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