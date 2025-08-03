import { Row, Col } from 'react-bootstrap';
import { useParams, Link, useLocation } from 'react-router-dom';
import Product from '../components/Product';
import Message from '../components/Message';
import PromoBanner from '../components/PromoBanner';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useGetActiveBannerQuery } from '../slices/promoBannerApiSlice';
import './HomeScreen.css';

const HomeScreen = () => {
  const { keyword, category: categoryFromUrl } = useParams();
  const location = useLocation();

  const { data: activeBanner, isLoading: isLoadingBanner } = useGetActiveBannerQuery();

  const isSupermarket = location.pathname.startsWith('/supermarket');
  const isPromo = location.pathname.startsWith('/promotions');
  const isGeneralPage = !keyword && !categoryFromUrl && !isSupermarket && !isPromo;

  let category = categoryFromUrl || 'general';
  let promotion = 'false';
  let pageTitle = categoryFromUrl || 'Derniers Produits';

  if (isSupermarket) {
    category = 'supermarket';
    pageTitle = 'Supermarché';
  } else if (isPromo) {
    promotion = 'true';
    pageTitle = 'Promotions';
    category = 'all';
  }

  if (keyword) {
    pageTitle = `Recherche : ${keyword}`;
  }

  const { data: products, isLoading, error } = useGetProductsQuery({
    keyword,
    category,
    promotion,
  });

  return (
    <div className='home-screen-background'>
      {isGeneralPage && !isLoadingBanner && activeBanner && <PromoBanner bannerData={activeBanner} />}

      {keyword && <Link to={isSupermarket ? '/supermarket' : (isPromo ? '/promotions' : '/products')} className='btn btn-light mb-4'>Retour</Link>}

      <h1 className='home-screen-title'>{pageTitle}</h1>

      {isLoading ? (<h2>Chargement...</h2>) 
      : error ? (<Message variant="danger">{error?.data?.message || error.error}</Message>) 
      : (
        <>
          {products && products.length === 0 ? (
            <Message>Aucun produit trouvé.</Message>
          ) : (
            <Row>
              {products && products.map((product, index) => ( // On récupère l'index ici
                <Col key={product._id} xs={6} md={6} lg={4} xl={3} className="p-2">
                  {/* On passe l'index en prop */}
                  <Product product={product} productIndex={index} />
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