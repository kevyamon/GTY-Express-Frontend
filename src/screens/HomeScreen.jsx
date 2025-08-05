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

const ScrollingInfo = () => {
    const containerStyle = {
        textAlign: 'center', marginBottom: '1rem', padding: '0.5rem',
        backgroundColor: 'black', borderRadius: '8px', color: 'yellow',
        fontSize: '1rem', fontWeight: 'bold', display: 'inline-block',
        animation: 'slide-right 1.5s ease-in-out infinite alternate',
    };
    const arrowStyle = { fontSize: '1.2em', verticalAlign: 'middle' };
    return (
        <div className="d-flex justify-content-center mb-3">
            <div style={containerStyle}>
                <span>Vous pouvez glisser comme ça </span>
                <span style={arrowStyle}>➡</span>
                <style>{` @keyframes slide-right { 0% { transform: translateX(0); } 100% { transform: translateX(10px); } } `}</style>
            </div>
        </div>
    );
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
  const productChunks = chunkProducts(products, 5);
  const isMobile = window.innerWidth < 767;

  return (
    <Container fluid>
      <div className='home-screen-background'>
        {isGeneralPage && !isLoadingBanner && activeBanner && <PromoBanner bannerData={activeBanner} />}
        {keyword && <Link to={isSupermarket ? '/supermarket' : (isPromo ? '/promotions' : '/products')} className='btn btn-light mb-4'>Retour</Link>}

        <h1 className='home-screen-title'>{pageTitle}</h1>

        {isMobile && products && products.length > 0 && <ScrollingInfo />}

        {isLoading ? (<h2>Chargement...</h2>) 
        : error ? (<Message variant="danger">{error?.data?.message || error.error}</Message>) 
        : (
          <>
            {products && products.length === 0 ? ( <Message>Aucun produit trouvé.</Message> ) : (
                isMobile ? (
                    // --- VUE MOBILE AVEC SCROLL HORIZONTAL ---
                    productChunks.map((chunk, chunkIndex) => (
                        <div key={chunkIndex} className="product-row-scroll-container">
                            <Row className="product-row-inner">
                                {chunk.map((product) => (
                                <Col key={product._id} className="p-1">
                                    <Product product={product} />
                                </Col>
                                ))}
                            </Row>
                        </div>
                    ))
                ) : (
                    // --- VUE DESKTOP CLASSIQUE (AVEC PLUS DE PRODUITS PAR LIGNE) ---
                    <Row>
                        {products.map((product) => (
                        <Col key={product._id} sm={6} md={4} lg={3} xl={2} className="p-1 p-md-2">
                            <Product product={product} />
                        </Col>
                        ))}
                    </Row>
                )
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default HomeScreen;