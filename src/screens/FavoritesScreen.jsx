import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Product from '../components/Product';
import Message from '../components/Message';

const FavoritesScreen = () => {
  const { favoriteItems } = useSelector((state) => state.favorites);

  return (
    <>
      <h1>Mes Favoris</h1>
      {favoriteItems.length === 0 ? (
        <Message>
          Vous n'avez aucun favori. <Link to="/products">Voir les produits</Link>
        </Message>
      ) : (
        <Row>
          {favoriteItems.map((product) => (
            <Col key={product._id} xs={6} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default FavoritesScreen;