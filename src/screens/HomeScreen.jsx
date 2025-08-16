import { Row, Col, Container } from 'react-bootstrap';
import { useParams, Link, useLocation } from 'react-router-dom';
import Product from '../components/Product';
import Message from '../components/Message';
import PromoBanner from '../components/PromoBanner';
import ProductCarousel from '../components/ProductCarousel';
import {
  useGetProductsQuery,
  useGetTopProductsQuery,
  useGetPopularProductsQuery,
} from '../slices/productsApiSlice';
import { useGetActiveBannerQuery } from '../slices/promoBannerApiSlice';
import './HomeScreen.css';

const ScrollingInfo = () => {
    const containerStyle = {
        textAlign: 'center', marginBottom: '1rem', padding: '0.5rem',
        backgroundColor: 'black', borderRadius: '8px', color: 'yellow',
        fontSize: '1rem', fontWeight: 'bold', display: 'inline-block',
    };
    const arrowStyle = { fontSize: '1.2em', verticalAlign: 'middle' };
    return (
        <div className="d-flex justify-content-center mb-3">
            <div style={containerStyle}>
                <span>Glissez pour voir plus </span>
                <span style={arrowStyle}>➡</span>
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
  let pageTitle = categoryFromUrl || 'Tous les Produits';
  if (isSupermarket) { category = 'supermarket'; pageTitle = 'Supermarché'; }
  else if (isPromo) { promotion = 'true'; pageTitle = 'Promotions'; category = 'all'; }
  if (keyword) { pageTitle = `Recherche : ${keyword}`; }

  // --- NOUVELLE LOGIQUE D'APPEL API ---
  const { data: popularProducts, isLoading: isLoadingPopular, error: errorPopular } = useGetPopularProductsQuery({ limit: 10 });
  const { data: topProducts, isLoading: isLoadingTop, error: errorTop } = useGetTopProductsQuery({ limit: 10 });
  const { data: products, isLoading, error } = useGetProductsQuery({
      keyword,
      category: isGeneralPage ? '' : category, // Pour la grille principale, on ne filtre pas par catégorie 'general'
      promotion,
      pageType: isGeneralPage ? 'mainGrid' : '' // On spécifie qu'on veut la grille principale
  });

  const isMobile = window.innerWidth < 767;

  return (
    <Container fluid>
      <div className='home-screen-background'>
        {!isLoadingBanner && activeBanner && <PromoBanner bannerData={activeBanner} />}
        {keyword && <Link to={isSupermarket ? '/supermarket' : (isPromo ? '/promotions' : '/products')} className='btn btn-light mb-4'>Retour</Link>}

        {/* --- Affichage conditionnel des carrousels --- */}
        {isGeneralPage && (
          <>
            <ProductCarousel 
              title="🔥 Produits Populaires" 
              products={popularProducts} 
              isLoading={isLoadingPopular} 
              error={errorPopular}
              linkTo="/products/popular"
              limit={10}
            />
            <ProductCarousel 
              title="⭐ Mieux Notés" 
              products={topProducts} 
              isLoading={isLoadingTop} 
              error={errorTop}
              linkTo="/products/top-rated"
              limit={10}
            />
          </>
        )}
        
        {/* --- Affichage de la grille principale ou des résultats de recherche --- */}
        <h1 className='home-screen-title'>{pageTitle}</h1>

        {isMobile && products && products.length > 5 && <ScrollingInfo />}

        {isLoading ? (<h2>Chargement...</h2>) 
        : error ? (<Message variant="danger">{error?.data?.message || error.error}</Message>) 
        : (
          <>
            {products && products.length === 0 ? ( <Message>Aucun produit à afficher dans cette section pour le moment.</Message> ) : (
              isMobile ? (
                  <div className="product-row-scroll-container">
                      <Row className="product-row-inner">
                          {products.map((product) => (
                          <Col key={product._id} className="p-1">
                              <Product product={product} />
                          </Col>
                          ))}
                      </Row>
                  </div>
              ) : (
                  <Row className="product-grid">
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