import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import OrderStatusTracker from '../components/OrderStatusTracker';
import { useGetOrderDetailsQuery } from '../slices/orderApiSlice';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './OrderScreen.css';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  // --- TOUTE LA LOGIQUE DE PAIEMENT CINETPAY EST SUPPRIMÉE D'ICI ---

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (order && !order.isPaid && order.paymentMethod !== 'Cash') {
      const interval = setInterval(() => {
        refetch();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [order, refetch]);
  
  // --- DÉBUT DE L'AJOUT : GESTION DE L'ÉCHEC DE PAIEMENT ---
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (order && order.paymentAttemptFailed) {
      setShowErrorModal(true);
    }
  }, [order]);

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    // On pourrait ajouter une logique pour réinitialiser le statut côté backend
    // mais pour l'instant, on se contente de fermer la modale.
  };

  const handleRetryPayment = () => {
    setShowErrorModal(false);
    navigate(`/payment-gateway/${orderId}`); // Redirige vers la logique de paiement
  };
  // --- FIN DE L'AJOUT ---


  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error.data.message || error.error}</Message>
  ) : (
    <>
      <h2 className='mb-4'>Commande <span className="order-id-highlight">{order.orderNumber}</span></h2>
      <Row>
        <Col md={8}>
          <Card className="order-card">
            <Card.Header as="h5">Détails de la Commande</Card.Header>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>Livraison</h3>
                <p><strong>Nom: </strong> {order.user.name}</p>
                <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
                <p><strong>Adresse: </strong>{order.shippingAddress.address}, {order.shippingAddress.city}{' '}{order.shippingAddress.country}</p>
                <p><strong>Téléphone: </strong> {order.shippingAddress.phone}</p>
                {order.isDelivered ? (
                  <Message variant='success'>Livré le {format(new Date(order.deliveredAt), 'd MMMM yyyy à HH:mm', { locale: fr })}</Message>
                ) : (
                  <Message variant='warning'>Non livré</Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <h3>Paiement</h3>
                <p><strong>Méthode: </strong>{order.paymentMethod === 'CinetPay' ? 'Mobile Money' : 'Paiement à la livraison'}</p>
                {order.isPaid ? (
                  <Message variant='success'>Payé le {format(new Date(order.paidAt), 'd MMMM yyyy à HH:mm', { locale: fr })}</Message>
                ) : (
                  <Message variant='warning'>Non payé</Message>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
          
          <Card className="order-card mt-4">
            <Card.Header as="h5">Articles</Card.Header>
            <ListGroup variant='flush'>
              {order.orderItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row className="align-items-center">
                    <Col md={2}>
                      <Image src={getOptimizedUrl(item.image)} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={4} className="text-md-end">
                      {item.qty} x {item.price.toLocaleString('fr-FR')} FCFA = <strong>{(item.qty * item.price).toLocaleString('fr-FR')} FCFA</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>

        </Col>
        <Col md={4}>
          <Card className="order-summary-card">
            <Card.Header as="h5">Résumé de la Commande</Card.Header>
            <ListGroup variant='flush'>
              <ListGroup.Item><Row><Col>Articles</Col><Col>{order.itemsPrice.toLocaleString('fr-FR')} FCFA</Col></Row></ListGroup.Item>
              {order.coupon && order.coupon.code && (
                <ListGroup.Item><Row className="text-success"><Col>Réduction ({order.coupon.code})</Col><Col>- {order.coupon.discountAmount.toLocaleString('fr-FR')} FCFA</Col></Row></ListGroup.Item>
              )}
              <ListGroup.Item><Row><Col><strong>Total</strong></Col><Col><strong>{order.totalPrice.toLocaleString('fr-FR')} FCFA</strong></Col></Row></ListGroup.Item>
              
              {/* --- LE BOUTON DE PAIEMENT EST SUPPRIMÉ D'ICI --- */}
              
            </ListGroup>
          </Card>
          
          <Card className="mt-4">
              <Card.Body>
                  <OrderStatusTracker order={order} />
              </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* --- MODALE D'ERREUR DE PAIEMENT --- */}
      <Modal show={showErrorModal} onHide={handleCloseErrorModal} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">❌ Échec du Paiement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Nous n'avons pas pu confirmer votre paiement car le montant reçu ne correspondait pas au total de la commande.</p>
          <p>Veuillez réessayer en vous assurant de valider le montant exact demandé.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseErrorModal}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleRetryPayment}>
            Réessayer de Payer
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default OrderScreen;