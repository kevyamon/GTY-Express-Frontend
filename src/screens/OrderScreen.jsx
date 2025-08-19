import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FaShippingFast, FaCreditCard, FaUser, FaAt, FaPhone } from 'react-icons/fa';
import Message from '../components/Message';
import Loader from '../components/Loader'; // --- NOUVEL IMPORT ---
import OrderStatusTracker from '../components/OrderStatusTracker';
import {
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} from '../slices/orderApiSlice';
import './OrderScreen.css';

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

  // --- MODIFICATION ICI ---
  return isLoading ? <Loader />
    : error ? <Message variant='danger'>{error?.data?.message || error.error}</Message>
    : (
    <>
      <h3 className="mb-4">Détails de la commande {order._id.substring(0, 10)}...</h3>
      <Row>
        <Col md={7}>
          <Card className="mb-4 order-card">
            <Card.Header as="h5">Suivi de la Commande</Card.Header>
            <Card.Body>
              <OrderStatusTracker order={order} />
            </Card.Body>
          </Card>

          <Card className="mb-4 order-card">
            <Card.Header as="h5">Détails de Livraison et Paiement</Card.Header>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <p><strong><FaUser className="me-2"/>Client:</strong> {order.user.name}</p>
                <p><strong><FaAt className="me-2"/>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                <p><strong><FaPhone className="me-2"/>Téléphone:</strong> {order.shippingAddress.phone}</p>
              </ListGroup.Item>
              <ListGroup.Item>
                <p><strong><FaShippingFast className="me-2"/>Adresse de livraison:</strong></p>
                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
              </ListGroup.Item>
               <ListGroup.Item>
                <p><strong><FaCreditCard className="me-2"/>Méthode de paiement:</strong> {order.paymentMethod}</p>
                {order.isPaid ? (<Message variant='success'>Payé le {new Date(order.paidAt).toLocaleDateString()}</Message>) : (<Message variant='danger'>Non payé</Message>)}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="order-summary-card">
            <Card.Header as="h4" className="text-center">Récapitulatif</Card.Header>
            <ListGroup variant='flush'>
              <ListGroup.Item className="summary-item">
                <span>Sous-total</span>
                <strong>{(order.itemsPrice || 0).toFixed(2)} FCFA</strong>
              </ListGroup.Item>
              {order.coupon && (
                <ListGroup.Item className="summary-item text-success">
                  <span>Réduction ({order.coupon.code})</span>
                  <strong>-{(order.coupon.discountAmount || 0).toFixed(2)} FCFA</strong>
                </ListGroup.Item>
              )}
              <ListGroup.Item className="summary-total">
                <span>Total</span>
                <strong>{(order.totalPrice || 0).toFixed(2)} FCFA</strong>
              </ListGroup.Item>
              {!order.isPaid && order.paymentMethod !== 'Cash' && (
                <ListGroup.Item className="p-3">
                  <Link to={`/payment-gateway/${order._id}`}>
                    <Button className='btn-primary w-100' size="lg">Terminer le paiement</Button>
                  </Link>
                </ListGroup.Item>
              )}
               {userInfo && userInfo.isAdmin && order.status !== 'Livrée' && (
                <ListGroup.Item className="p-3">
                  <Button type='button' className='btn btn-success w-100' onClick={() => updateStatusHandler('Livrée')} disabled={loadingUpdate}>
                    Marquer comme livré
                  </Button>
                  {loadingUpdate && <Loader />}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
          
          <h5 className="mt-4">Articles Commandés</h5>
          <ListGroup variant='flush'>
            {order.orderItems.map((item, index) => {
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
                <ListGroup.Item key={index} className="order-item-row">
                  <Image src={imageUrl} alt={item.name} className="order-item-image" />
                  <div className="order-item-details">
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                    <span>{item.qty} x {item.price} FCFA</span>
                  </div>
                  <strong>{(item.qty * item.price).toFixed(2)} FCFA</strong>
                </ListGroup.Item>
              )
            })}
          </ListGroup>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;