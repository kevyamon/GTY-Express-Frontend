import { Row, Col, Container } from 'react-bootstrap';
import { useParams, Link, useLocation } from 'react-router-dom';
import Product from '../components/Product';
import Message from '../components/Message';
import PromoBanner from '../components/PromoBanner';
import ProductCarousel from '../components/ProductCarousel';
import Loader from '../components/Loader';
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
  const { keyword: keywordFromUrl, category: categoryFromUrl } = useParams();
  const location = useLocation();
  const { data: activeBanner, isLoading: isLoadingBanner } = useGetActiveBannerQuery();

  // --- DÉBUT DE LA MODIFICATION POUR LA CIBLE DE PARTAGE ---
  // On récupère les paramètres de l'URL (ex: ?text=mon-produit)
  const searchParams = new URLSearchParams(location.search);
  const keywordFromShare = searchParams.get('text');

  // Le mot-clé final est soit celui de l'URL, soit celui du partage, soit rien.
  const keyword = keywordFromUrl || keywordFromShare || '';
  // --- FIN DE LA MODIFICATION ---

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
        
        {showMobileHint && products && products.length > 0 && (
          <p className="mobile-scroll-hint">Glissez vers → pour voir plus</p>
        )}

        {isLoading ? (<Loader />) 
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