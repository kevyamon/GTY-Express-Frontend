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
  useDeleteOrderMutation,
} from '../slices/orderApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const {
    data: order,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [updateOrderStatus, { isLoading: loadingUpdate }] = useUpdateOrderStatusMutation();
  const [deleteOrder, { isLoading: loadingDelete }] = useDeleteOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (order) {
      const seenOrders = JSON.parse(localStorage.getItem('seenOrders')) || {};
      if (!seenOrders[order._id] || new Date(order.updatedAt) > new Date(seenOrders[order._id])) {
          seenOrders[order._id] = order.updatedAt;
          localStorage.setItem('seenOrders', JSON.stringify(seenOrders));
      }
    }
  }, [order]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || error.error);
    }
  }, [error]);

  const updateStatusHandler = async (newStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      toast.success('Statut mis à jour');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const deleteHandler = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande de votre historique ?')) {
      try {
        await deleteOrder(orderId).unwrap();
        toast.success('Commande supprimée');
        navigate('/profile');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return isLoading ? <p>Chargement...</p> 
    : error ? <Message variant='danger'>{error?.data?.message || error.error}</Message>
    : (
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
              {order.orderItems.map((item, index) => {
                // LOGIQUE D'IMAGE CORRIGÉE
                let imageToDisplay = 'https://via.placeholder.com/150';
                if (item.images && item.images.length > 0) {
                  imageToDisplay = item.images[0];
                } else if (item.image) {
                  imageToDisplay = item.image;
                }
                const imageUrl = imageToDisplay.startsWith('/')
                  ? `${import.meta.env.VITE_BACKEND_URL}${imageToDisplay}`
                  : imageToDisplay;

                return (
                  <ListGroup.Item key={index}>
                    <Row className="align-items-center">
                      <Col xs={2} md={1}>
                        <Image src={imageUrl} alt={item.name} fluid rounded />
                      </Col>
                      <Col>
                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                      </Col>
                      <Col md={4} className="text-end">
                        {item.qty} x {item.price} FCFA = {(item.qty * item.price).toFixed(2)} FCFA
                      </Col>
                    </Row>
                  </ListGroup.Item>
                );
              })}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item><h2>Récapitulatif</h2></ListGroup.Item>
              <ListGroup.Item><Row><Col>Total</Col><Col><strong>{(order.totalPrice || 0).toFixed(2)} FCFA</strong></Col></Row></ListGroup.Item>
              <ListGroup.Item>
                <h4>Statut du Paiement</h4>
                {order.isPaid ? (<Message variant='success'>Payé le {new Date(order.paidAt).toLocaleDateString()}</Message>) : (<Message variant='danger'>Non payé</Message>)}
              </ListGroup.Item>
              {!order.isPaid && order.paymentMethod !== 'Cash' && (
                <ListGroup.Item><Link to={`/payment-gateway/${order._id}`}><Button className='btn-primary w-100'>Terminer le paiement</Button></Link></ListGroup.Item>
              )}
              {userInfo && userInfo.isAdmin && order.status !== 'Livrée' && (
                <ListGroup.Item>
                  <Button type='button' className='btn btn-success w-100' onClick={() => updateStatusHandler('Livrée')} disabled={loadingUpdate}>Marquer comme livré</Button>
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