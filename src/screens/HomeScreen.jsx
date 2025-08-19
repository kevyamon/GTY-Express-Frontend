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

const chunkProducts = (products, size) => {
    const chunkedArr = [];
    for (let i = 0; i < products.length; i += size) {
        chunkedArr.push(products.slice(i, i + size));
    }
    return chunkedArr;
};

const HomeScreen = () => {
  const { keyword, category: categoryFromUrl } = useParams();
  const location = useLocation();
  const { data: activeBanner, isLoading: isLoadingBanner } = useGetActiveBannerQuery();

  const isSupermarket = location.pathname.startsWith('/supermarket');
  const isPromo = location.pathname.startsWith('/promotions');
  const isAllProductsPage = location.pathname === '/products';
  const isGeneralPage = !keyword && !categoryFromUrl && !isSupermarket && !isPromo;

  let category = categoryFromUrl || 'general';
  let promotion = 'false';
  let pageTitle = categoryFromUrl || 'Tous les Produits';
  if (isSupermarket) { category = 'supermarket'; pageTitle = 'Supermarché'; }
  else if (isPromo) { promotion = 'true'; pageTitle = 'Promotions'; category = 'all'; }
  if (keyword) { pageTitle = `Recherche : ${keyword}`; }

  const { data: popularProducts, isLoading: isLoadingPopular, error: errorPopular } = useGetPopularProductsQuery({ limit: 10 });
  const { data: topProducts, isLoading: isLoadingTop, error: errorTop } = useGetTopProductsQuery({ limit: 10 });
  
  const { data: products, isLoading, error } = useGetProductsQuery({
      keyword,
      category,
      promotion,
  });

  const isMobile = window.innerWidth < 767;
  const mobileProductRows = products ? chunkProducts(products, 5) : [];

  // --- NOUVELLE CONDITION : Vrai si c'est la page 'Tous les produits' ou 'Supermarché' sur mobile ---
  const showMobileHint = isMobile && (isAllProductsPage || isSupermarket);

  return (
    <Container fluid>
      <div className='home-screen-background'>
        {!isLoadingBanner && activeBanner && <PromoBanner bannerData={activeBanner} />}
        {keyword && <Link to={isSupermarket ? '/supermarket' : (isPromo ? '/promotions' : '/products')} className='btn btn-light mb-4'>Retour</Link>}

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
        
        <h1 className='home-screen-title'>{pageTitle}</h1>
        
        {/* --- DÉBUT DE L'AJOUT --- */}
        {showMobileHint && products && products.length > 0 && (
          <p className="mobile-scroll-hint">Glissez vers → pour voir plus</p>
        )}
        {/* --- FIN DE L'AJOUT --- */}

        {isLoading ? (<h2>Chargement...</h2>) 
        : error ? (<Message variant="danger">{error?.data?.message || error.error}</Message>) 
        : (
          <>
            {products && products.length === 0 ? ( <Message>Aucun produit à afficher dans cette section pour le moment.</Message> ) : (
              isMobile && isAllProductsPage ? (
                <div className="mobile-grid-container">
                  {mobileProductRows.map((row, rowIndex) => (
                    <div key={rowIndex} className="product-row-scroll-container">
                      <Row className="product-row-inner">
                        {row.map((product) => (
                          <Col key={product._id} className="p-1">
                            <Product product={product} />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  ))}
                </div>
              ) : isMobile ? (
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