import { Row, Col } from 'react-bootstrap';
import { useParams, Link, useLocation } from 'react-router-dom';
import Product from '../components/Product';
import Message from '../components/Message';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import './HomeScreen.css';

const HomeScreen = () => {
  const { keyword } = useParams();
  const location = useLocation();

  const category = location.pathname.startsWith('/supermarket') ? 'supermarket' : 'general';

  const { data: products, isLoading, error } = useGetProductsQuery({
    keyword,
    category,
  });

  return (
    <div className='home-screen-background'>
      {keyword && <Link to={category === 'supermarket' ? '/supermarket' : '/products'} className='btn btn-light mb-4'>Retour</Link>}
      
      <h1 className='home-screen-title'>{category === 'supermarket' ? 'Supermarché' : 'Derniers Produits'}</h1>

      {isLoading ? (<h2>Chargement...</h2>) 
      : error ? (<Message variant="danger">{error?.data?.message || error.error}</Message>) 
      : (
        <>
          {products.length === 0 ? (
            <Message>Aucun produit trouvé</Message>
          ) : (
            <Row>
              {products.map((product) => (
                <Col key={product._id} xs={6} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </div>
  );
};

export default HomeScreen;