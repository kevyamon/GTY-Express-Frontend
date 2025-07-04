import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
} from '../slices/orderApiSlice';
import './OrderScreen.css'; // On importe le nouveau style

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { data: paypal, isLoading: loadingPayPal, error: errorPayPal } = useGetPaypalClientIdQuery();

  // État local pour gérer l'affichage du pop-up PayPal
  const [showPayPal, setShowPayPal] = useState(false);

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
        toast.success('Paiement réussi, commande confirmée !');
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

  // Si on choisit un paiement en ligne, on affiche les boutons PayPal
  // au clic sur "Payer"
  const handlePayment = () => {
    setShowPayPal(true);
  };

  return isLoading ? <p>Chargement...</p> 
    : error ? <Message variant='danger'>{error?.data?.message || error.error}</Message>
    : (
    <>
      <div className="order-summary-ticket">
        <h2>{(order.totalPrice || 0).toFixed(2)} FCFA</h2>
      </div>

      <div className="order-meta-info">
        <div>
          <span>Moyen de paiement</span>
          <strong>{order.paymentMethod}</strong>
        </div>
        <div>
          <span>Articles</span>
          <strong>{order.orderItems.length}</strong>
        </div>
        <div>
          <span>N° Commande</span>
          <strong>{order._id.substring(0, 8)}...</strong>
        </div>
      </div>
      
      <div className="pay-button-container">
        {!order.isPaid ? (
            <>
              {order.paymentMethod === 'PayPal' ? (
                // Si on a pas encore cliqué sur Payer ou que PayPal charge
                !showPayPal ? (
                  <Button variant="primary" size="lg" onClick={handlePayment}>Payer</Button>
                ) : (
                  <div>
                    {loadingPay && <p>Finalisation du paiement...</p>}
                    {isPending ? <p>Chargement de PayPal...</p> : (
                      <PayPalButtons style={{ layout: 'vertical' }} createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                    )}
                  </div>
                )
              ) : (
                <Message variant='info'>Vous avez choisi de payer à la livraison.</Message>
              )}
            </>
          ) : (
            <Message variant='success'>Merci ! Votre commande est payée et en cours de traitement.</Message>
          )}
      </div>

      <hr className="my-4" />
      
      {/* Le reste de la page avec les détails */}
      <h3 className='mb-3'>Détails de la livraison et des articles</h3>
      {/* ... Le code pour afficher les détails (adresse, articles) ne change pas ... */}
    </>
  );
};

export default OrderScreen;