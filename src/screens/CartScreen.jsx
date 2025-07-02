import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';

const CartScreen = () => {
  // Pour l'instant, le panier est vide. Nous ajouterons la logique plus tard.
  const cartItems = []; 

  return (
    <Row>
      <Col md={8}>
        <h1 style={{ marginBottom: '20px' }}>Panier</h1>
        {cartItems.length === 0 ? (
          <Message>
            Votre panier est vide <Link to='/products'>Retour</Link>
          </Message>
        ) : (
          <ListGroup variant='flush'>
            {/* La liste des produits du panier s'affichera ici */}
          </ListGroup>
        )}
      </Col>
    </Row>
  );
};

export default CartScreen;
