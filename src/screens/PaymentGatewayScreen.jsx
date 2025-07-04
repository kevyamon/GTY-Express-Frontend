import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Card, Button } from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
} from '../slices/orderApiSlice';
import './PaymentGatewayScreen.css';

const PaymentGatewayScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = () => {
        paypalDispatch({ type: 'resetOptions', value: { 'client-id': paypal.clientId, currency: 'USD' } });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) { loadPaypalScript(); }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details }).unwrap();
        refetch();
        toast.success('Paiement réussi !');
        navigate(`/order/${orderId}`); // Redirige vers la page de suivi après succès
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    });
  }

  function onError(err) { toast.error(err.message); }

  function createOrder(data, actions) {
    return actions.order.create({ purchase_units: [{ amount: { value: order.totalPrice } }] })
      .then((orderID) => { return orderID; });
  }

  return isLoading ? <p>Chargement...</p> 
    : error ? <Message variant='danger'>{error?.data?.message || error.error}</Message>
    : (
    <div className="payment-gateway">
      <div className="ticket">
        <span>Montant total à payer</span>
        <h2>{(order.totalPrice || 0).toFixed(2)} FCFA</h2>
      </div>

      <div className="meta-info">
        <div><span>Paiement via</span><strong>{order.paymentMethod}</strong></div>
        <div><span>Articles</span><strong>{order.orderItems.length}</strong></div>
        <div><span>Commande N°</span><strong>{order._id.substring(0, 8)}...</strong></div>
      </div>
      
      <div>
        {loadingPay && <p>Finalisation du paiement...</p>}
        {isPending || loadingPayPal ? <p>Chargement de PayPal...</p> : (
          <div>
            <PayPalButtons
              style={{ layout: 'vertical' }}
              createOrder={createOrder}
              onApprove={onApprove}
              onError={onError}
            ></PayPalButtons>
          </div>
        )}
        {errorPayPal && <Message variant='danger'>Erreur de chargement du module de paiement.</Message>}
      </div>
    </div>
  );
};

export default PaymentGatewayScreen;