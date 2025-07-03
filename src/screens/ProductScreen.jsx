import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice.js';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import QtySelector from '../components/QtySelector'; // Importer notre nouveau composant

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  useEffect(() => {
    if (error) {
      toast.error("Ce produit n'existe plus.");
      navigate('/products');
    }
  }, [error, navigate]);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success('Produit ajouté au panier !');
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/products">Retour</Link>
      {isLoading ? (<h2>Chargement...</h2>) 
      : error ? (<></>) 
      : (
        <Row>
          {/* ... autres Col ... */}
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                {/* ... autres ListGroup.Item ... */}
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qté</Col>
                      <Col>
                        {/* On remplace l'ancien champ par notre nouveau composant */}
                        <QtySelector 
                          value={qty}
                          onChange={setQty}
                          max={product.countInStock}
                        />
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button
                    className="btn-block"
                    type="button"
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                  >
                    Ajouter au Panier
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;