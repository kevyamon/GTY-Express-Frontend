import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import OrderStatusTracker from '../components/OrderStatusTracker';
import {
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
} from '../slices/orderApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [updateOrderStatus, { isLoading: loadingUpdate }] = useUpdateOrderStatusMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || error.error);
    }
  }, [error]);

  const deliverHandler = async () => {
    await updateOrderStatus({ orderId, status: 'Livrée' });
    refetch();
  };

  const goToPayment = () => {
    navigate(`/payment-gateway/${orderId}`);
  };

  return isLoading ? (
    <p>Chargement...</p>
  ) : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <h3 className="mb-4">Détails de la commande {order._id.substring(0, 10)}...</h3>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item className="mb-3">
              <OrderStatusTracker order={order} />
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Livraison</h2>
              <p><strong>Nom: </strong> {order.user.name}</p>
              <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
              <p><strong>Adresse:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}</p>
              <p><strong>Téléphone:</strong> {order.shippingAddress.phone}</p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Articles Commandés</h2>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row className="align-items-center">
                    <Col xs={2} md={1}><Image src={item.image.startsWith('/') ? `${import.meta.env.VITE_BACKEND_URL}${item.image}`: item.image} alt={item.name} fluid rounded /></Col>
                    <Col><Link to={`/product/${item.product}`}>{item.name}</Link></Col>
                    <Col md={4} className="text-end">{item.qty} x {item.price} FCFA = {(item.qty * item.price).toFixed(2)} FCFA</Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Récapitulatif</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row><Col>Total</Col><Col><strong>{(order.totalPrice || 0).toFixed(2)} FCFA</strong></Col></Row>
              </ListGroup.Item>
              
              <ListGroup.Item>
                {order.isPaid ? (
                  <Message variant='success'>Payé le {new Date(order.paidAt).toLocaleDateString()}</Message>
                ) : (
                  <Message variant='danger'>Non payé</Message>
                )}
              </ListGroup.Item>

              {/* BOUTON POUR TERMINER LE PAIEMENT */}
              {!order.isPaid && order.paymentMethod === 'PayPal' && (
                <ListGroup.Item>
                    <div className="d-grid">
                        <Button type='button' variant="primary" onClick={goToPayment}>
                            Terminer le Paiement
                        </Button>
                    </div>
                </ListGroup.Item>
              )}

              {/* BOUTON ADMIN */}
              {userInfo && userInfo.isAdmin && !order.isDelivered && (
                <ListGroup.Item>
                  <Button type='button' className='btn w-100' onClick={deliverHandler} disabled={loadingUpdate}>
                    Marquer comme livré
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;