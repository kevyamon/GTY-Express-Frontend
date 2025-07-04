import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import { useGetOrderDetailsQuery } from '../slices/orderApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  return isLoading ? <p>Chargement...</p> : error ? <Message variant='danger'>{error.data.message}</Message>
  : (
    <>
      <h1>Commande {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Livraison</h2>
              <p><strong>Nom: </strong> {order.user.name}</p>
              <p><strong>Email: </strong>{' '}<a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
              <p><strong>Adresse:</strong>{order.shippingAddress.address}, {order.shippingAddress.city}{' '}{order.shippingAddress.postalCode},{' '}{order.shippingAddress.country}</p>
              {order.isDelivered ? (<Message variant='success'>Livré le {order.deliveredAt}</Message>) : (<Message variant='danger'>Non livré</Message>)}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Paiement</h2>
              <p><strong>Méthode: </strong>{order.paymentMethod}</p>
              {order.isPaid ? (<Message variant='success'>Payé le {order.paidAt}</Message>) : (<Message variant='danger'>Non payé</Message>)}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Articles</h2>
              {order.orderItems.length === 0 ? (<Message>La commande est vide</Message>
              ) : (
                <ListGroup variant='flush'>{order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}><Row><Col md={1}><Image src={item.image} alt={item.name} fluid rounded /></Col><Col><Link to={`/product/${item.product}`}>{item.name}</Link></Col><Col md={4}>{item.qty} x {item.price} FCFA = {item.qty * item.price} FCFA</Col></Row></ListGroup.Item>
                  ))}</ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item><h2>Récapitulatif</h2></ListGroup.Item>
              <ListGroup.Item><Row><Col>Articles</Col><Col>{order.itemsPrice.toFixed(2)} FCFA</Col></Row></ListGroup.Item>
              <ListGroup.Item><Row><Col>Frais de port</Col><Col>{order.shippingPrice.toFixed(2)} FCFA</Col></Row></ListGroup.Item>
              <ListGroup.Item><Row><Col>Taxes</Col><Col>{order.taxPrice.toFixed(2)} FCFA</Col></Row></ListGroup.Item>
              <ListGroup.Item><Row><Col>Total</Col><Col>{order.totalPrice.toFixed(2)} FCFA</Col></Row></ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;