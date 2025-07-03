import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice.js';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  // Gère le cas où le produit a été supprimé entre-temps
  useEffect(() => {
    if (error) {
      toast.error("Ce produit n'existe plus ou a été déplacé.");
      navigate('/products');
    }
  }, [error, navigate]);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success('Produit ajouté au panier !');
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/products">
        Retour
      </Link>
      {isLoading ? (
        <h2>Chargement...</h2>
      ) : error ? (
        // Affiche un écran vide pendant la redirection
        <></>
      ) : (
        <Row>
          <Col md={5}>
            <Image
              src={
                product.image.startsWith('/')
                  ? `${import.meta.env.VITE_BACKEND_URL}${product.image}`
                  : product.image
              }
              alt={product.name}
              fluid
            />
          </Col>
          <Col md={4}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>Prix: {product.price} FCFA</ListGroup.Item>
              <ListGroup.Item>Description: {product.description}</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Prix:</Col>
                    <Col><strong>{product.price} FCFA</strong></Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Statut:</Col>
                    <Col>{product.countInStock > 0 ? 'En Stock' : 'Rupture de stock'}</Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qté</Col>
                      <Col>
                        <Form.Control
                          as='select'
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
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