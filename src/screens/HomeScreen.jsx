import { Row, Col } from 'react-bootstrap';
import { useParams, Link, useLocation } from 'react-router-dom';
import Product from '../components/Product';
import Message from '../components/Message';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import './HomeScreen.css';

const HomeScreen = () => {
  const { keyword } = useParams();
  const location = useLocation();

  const isSupermarket = location.pathname.startsWith('/supermarket');
  const isPromo = location.pathname.startsWith('/promotions');

  let category = 'general';
  let promotion = 'false';
  let pageTitle = 'Derniers Produits';

  if (isSupermarket) {
    category = 'supermarket';
    pageTitle = 'Supermarché';
  } else if (isPromo) {
    promotion = 'true';
    pageTitle = 'Promotions';
    category = 'all'; // On cherche dans toutes les catégories pour les promos
  }

  if (keyword) {
    pageTitle = 'Résultats de la recherche';
  }

  const { data: products, isLoading, error } = useGetProductsQuery({
    keyword,
    category,
    promotion,
  });

  return (
    <div className='home-screen-background'>
      {keyword && <Link to={isSupermarket ? '/supermarket' : (isPromo ? '/promotions' : '/products')} className='btn btn-light mb-4'>Retour</Link>}
      
      <h1 className='home-screen-title'>{pageTitle}</h1>

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