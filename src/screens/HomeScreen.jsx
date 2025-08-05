import { Row, Col, Container } from 'react-bootstrap';
import { useParams, Link, useLocation } from 'react-router-dom';
import Product from '../components/Product';
import Message from '../components/Message';
import PromoBanner from '../components/PromoBanner';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useGetActiveBannerQuery } from '../slices/promoBannerApiSlice';
import './HomeScreen.css';

// Fonction pour grouper les produits par 5
const chunkProducts = (products, chunkSize) => {
    const chunks = [];
    if (!products) return chunks;
    for (let i = 0; i < products.length; i += chunkSize) {
        chunks.push(products.slice(i, i + chunkSize));
    }
    return chunks;
};

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

  if (isSupermarket) { category = 'supermarket'; pageTitle = 'Supermarché'; }
  else if (isPromo) { promotion = 'true'; pageTitle = 'Promotions'; category = 'all'; }
  if (keyword) { pageTitle = `Recherche : ${keyword}`; }

  const { data: products, isLoading, error } = useGetProductsQuery({ keyword, category, promotion });

  // On groupe les produits par 5
  const productChunks = chunkProducts(products, 5);

  return (
    <Container fluid>
      <div className='home-screen-background'>
        {isGeneralPage && !isLoadingBanner && activeBanner && <PromoBanner bannerData={activeBanner} />}
        {keyword && <Link to={isSupermarket ? '/supermarket' : (isPromo ? '/promotions' : '/products')} className='btn btn-light mb-4'>Retour</Link>}
        <h1 className='home-screen-title'>{pageTitle}</h1>

        {isLoading ? (<h2>Chargement...</h2>) 
        : error ? (<Message variant="danger">{error?.data?.message || error.error}</Message>) 
        : (
          <>
            {products && products.length === 0 ? ( <Message>Aucun produit trouvé.</Message> ) : (
              // On boucle sur les groupes de produits
              productChunks.map((chunk, chunkIndex) => (
                <Row key={chunkIndex} className="product-row-scrollable">
                  {chunk.map((product) => (
                    <Col key={product._id} xs={6} className="p-1">
                      <Product product={product} />
                    </Col>
                  ))}
                </Row>
              ))
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default HomeScreen;