import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import OrderStatusTracker from '../components/OrderStatusTracker';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
  useUpdateOrderStatusMutation,
} from '../slices/orderApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useUpdateOrderStatusMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = () => {
        paypalDispatch({
          type: 'resetOptions',
          value: { 'client-id': paypal.clientId, currency: 'USD' },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        toast.success('Paiement réussi');
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  const deliverHandler = async () => {
    await deliverOrder({ orderId, status: 'Livrée' });
    refetch();
  };

  return isLoading ? <p>Chargement...</p> 
    : error ? <Message variant='danger'>{error?.data?.message || error.error}</Message>
    : (
    <>
      <h3 className="mb-4">Détails de la commande {order._id}</h3>
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
              <ListGroup.Item><h2>Récapitulatif</h2></ListGroup.Item>
              <ListGroup.Item><Row><Col>Total</Col><Col>{(order.totalPrice || 0).toFixed(2)} FCFA</Col></Row></ListGroup.Item>
              
              {!order.isPaid ? (
                <ListGroup.Item>
                  {loadingPay && <p>Chargement...</p>}
                  {isPending ? (
                    <p>Chargement de PayPal...</p>
                  ) : order.paymentMethod === 'PayPal' ? (
                    <div>
                      <p className='text-muted small'>Finalisez votre paiement ci-dessous.</p>
                      <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                    </div>
                  ) : (
                    <Message>Le paiement se fera à la livraison.</Message>
                  )}
                </ListGroup.Item>
              ) : (
                <Message variant='success'>Payé le {new Date(order.paidAt).toLocaleDateString()}</Message>
              )}

              {userInfo && userInfo.isAdmin && !order.isDelivered && (
                <ListGroup.Item>
                  <Button type='button' className='btn w-100' onClick={deliverHandler}>
                    Marquer comme livré
                  </Button>
                  {loadingDeliver && <p>Chargement...</p>}
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