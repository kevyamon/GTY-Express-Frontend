import { Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Message from '../components/Message';
import { useGetPopularProductsQuery } from '../slices/productsApiSlice';
import './HomeScreen.css'; // On réutilise le style de la page d'accueil pour la grille

// Ce composant est très similaire à HomeScreen, mais ne charge que les produits populaires
const PopularProductsScreen = () => {
  // On appelle la requête sans limite pour tout récupérer
  const { data: popularProducts, isLoading, error } = useGetPopularProductsQuery();

  return (
    <Container fluid>
      <div className='home-screen-background'>
        <Link to='/products' className='btn btn-light mb-4'>
          Retour
        </Link>
        
        <h1 className='home-screen-title'>🔥 Produits Populaires</h1>

        {isLoading ? (
          <h2>Chargement...</h2>
        ) : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : (
          <>
            {popularProducts && popularProducts.length === 0 ? (
              <Message>Aucun produit populaire pour le moment. Soyez le premier à commander !</Message>
            ) : (
              <Row className="product-grid">
                {popularProducts.map((product) => (
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

export default PopularProductsScreen;