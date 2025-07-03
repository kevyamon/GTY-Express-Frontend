import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useEffect } from 'react';

const HomeScreen = () => {
  const { data: products, isLoading, error, refetch } = useGetProductsQuery();

  // Force le rafraîchissement des données à chaque fois que l'on affiche cette page
  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      {isLoading ? (
        <h2>Chargement...</h2>
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <h1>Derniers Produits</h1>
          <Row>
            {products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>
  );
};

export default HomeScreen;