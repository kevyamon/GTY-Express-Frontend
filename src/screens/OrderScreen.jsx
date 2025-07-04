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
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [deliverOrder, { isLoading: loadingDeliver }] = useUpdateOrderStatusMutation();

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || error.error);
    }
  }, [error]);

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
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
    await updateOrderStatus({ orderId, status: 'Livrée' });
    refetch();
  };

  return isLoading ? (
    <p>Chargement...</p>
  ) : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <>
      <h3 className='mb-4'>Commande {order._id.substring(0, 10)}...</h3>
      <Row>
        <Col md={7}>
          {/* ... Le code pour la timeline, la livraison et les articles ne change pas ... */}
        </Col>
        <Col md={5}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Récapitulatif</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Total</strong>
                  </Col>
                  <Col>
                    <strong>{(order.totalPrice || 0).toFixed(2)} FCFA</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <p>Finalisation...</p>}
                  
                  {/* On affiche un message si le chargement de PayPal échoue */}
                  {errorPayPal && (
                    <Message variant='danger'>
                      Erreur de chargement du module de paiement.
                    </Message>
                  )}
                  
                  {loadingPayPal || isPending ? (
                    <p>Chargement du système de paiement...</p>
                  ) : order.paymentMethod === 'PayPal' ? (
                    <div>
                      <p className='text-muted small my-2'>
                        Finalisez votre paiement ci-dessous.
                      </p>
                      <PayPalButtons
                        style={{ layout: 'vertical' }}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  ) : (
                    <Message>Le paiement se fera à la livraison.</Message>
                  )}
                </ListGroup.Item>
              )}

              {/* ... Le reste du code pour l'admin ne change pas ... */}

            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;