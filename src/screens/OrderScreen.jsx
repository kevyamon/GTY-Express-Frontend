import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import OrderStatusTracker from '../components/OrderStatusTracker'; // On importe le nouveau composant
import {
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
} from '../slices/orderApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
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

  const updateStatusHandler = async (newStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      refetch();
      toast.success('Statut mis à jour');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return isLoading ? (
    <p>Chargement...</p>
  ) : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <h3 className="mb-4">Détails de la commande {order._id}</h3>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item className="mb-3">
              {/* ON AFFICHE LA TIMELINE DE SUIVI ICI */}
              <OrderStatusTracker order={order} />
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Livraison</h2>
              <p><strong>Nom: </strong> {order.shippingAddress.name}</p>
              <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
              <p><strong>Adresse:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}</p>
              <p><strong>Téléphone:</strong> {order.shippingAddress.phone}</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Articles Commandés</h2>
              {order.orderItems.length === 0 ? (
                <Message>La commande est vide</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row className="align-items-center">
                        <Col xs={2} md={1}>
                          <Image src={item.image.startsWith('/') ? `${import.meta.env.VITE_BACKEND_URL}${item.image}`: item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </Col>
                        <Col md={4} className="text-end">
                          {item.qty} x {item.price} FCFA = {(item.qty * item.price).toFixed(2)} FCFA
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
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
                <Row><Col>Paiement</Col><Col>{order.paymentMethod}</Col></Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {order.isPaid ? (
                  <Message variant='success'>Payé le {new Date(order.paidAt).toLocaleDateString()}</Message>
                ) : (
                  <Message variant='danger'>Non payé</Message>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <Row><Col>Total</Col><Col>{(order.totalPrice || 0).toFixed(2)} FCFA</Col></Row>
              </ListGroup.Item>
              
              {userInfo && userInfo.isAdmin && order.status !== 'Livrée' && (
                <ListGroup.Item>
                  <Button
                    type='button'
                    className='btn btn-success w-100'
                    onClick={() => updateStatusHandler('Livrée')}
                  >
                    Marquer comme livré
                  </Button>
                  {loadingUpdate && <p>Chargement...</p>}
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