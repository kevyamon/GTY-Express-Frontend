import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useGetOrderDetailsQuery,
  useInitiateCinetpayPaymentMutation,
} from '../slices/orderApiSlice';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Assurez-vous que ces images existent dans le dossier src/assets/images/
import orangeMoneyLogo from '../assets/images/orange-money.png';
import mtnMoneyLogo from '../assets/images/mtn-money.png';
import moovMoneyLogo from '../assets/images/moov-money.png';
import waveLogo from '../assets/images/wave.png';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [initiateCinetpay, { isLoading: loadingCinetpay }] =
    useInitiateCinetpayPaymentMutation();

  useEffect(() => {
    // Rafraîchit périodiquement les détails de la commande si elle n'est pas encore payée
    if (order && !order.isPaid) {
      const interval = setInterval(() => {
        refetch();
      }, 5000); // Toutes les 5 secondes
      return () => clearInterval(interval);
    }
  }, [order, refetch]);

  const onCinetpayPayment = async () => {
    try {
      const res = await initiateCinetpay(orderId).unwrap();
      // Redirige l'utilisateur vers la page de paiement sécurisée de CinetPay
      window.location.href = res.payment_url;
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Une erreur est survenue lors de l\'initialisation du paiement.');
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error.data.message || error.error}</Message>
  ) : (
    <>
      <h2 className='text-primary'>Commande N°{order.orderNumber}</h2>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h3>Livraison</h3>
              <p>
                <strong>Nom: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Adresse: </strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              <p>
                <strong>Téléphone: </strong> {order.shippingAddress.phone}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Livré le {format(new Date(order.deliveredAt), 'd MMMM yyyy à HH:mm', { locale: fr })}
                </Message>
              ) : (
                <Message variant='warning'>Non livré</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Paiement</h3>
              <p>
                <strong>Méthode: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>
                  Payé le {format(new Date(order.paidAt), 'd MMMM yyyy à HH:mm', { locale: fr })}
                </Message>
              ) : (
                <Message variant='warning'>Non payé</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h3>Articles</h3>
              {order.orderItems.length === 0 ? (
                <Message>Votre commande est vide</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {item.price.toLocaleString('fr-FR')} FCFA = {(item.qty * item.price).toLocaleString('fr-FR')} FCFA
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
                <h2>Résumé</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Articles</Col>
                  <Col>{order.itemsPrice.toLocaleString('fr-FR')} FCFA</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Livraison</Col>
                  <Col>{order.shippingPrice.toLocaleString('fr-FR')} FCFA</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Taxes</Col>
                  <Col>{order.taxPrice.toLocaleString('fr-FR')} FCFA</Col>
                </Row>
              </ListGroup.Item>
              {order.coupon && order.coupon.code && (
                <ListGroup.Item>
                    <Row>
                        <Col className='text-success'>Réduction ({order.coupon.code})</Col>
                        <Col className='text-success'>- {order.coupon.discountAmount.toLocaleString('fr-FR')} FCFA</Col>
                    </Row>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Row>
                  <Col>
                    <strong>Total</strong>
                  </Col>
                  <Col>
                    <strong>{order.totalPrice.toLocaleString('fr-FR')} FCFA</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              
              {!order.isPaid && (
                <ListGroup.Item>
                   {loadingCinetpay && <Loader />}

                    <div>
                      <Button
                        onClick={onCinetpayPayment}
                        className='btn-block btn-success w-100'
                        disabled={loadingCinetpay}
                      >
                        Payer par Mobile Money
                      </Button>
                      <div className='text-center mt-3 d-flex justify-content-around align-items-center'>
                        {/* --- MODIFICATION ICI --- */}
                        <Image src={orangeMoneyLogo} alt='Orange Money' fluid style={{ maxWidth: '40px', borderRadius: '50%' }} />
                        <Image src={mtnMoneyLogo} alt='MTN Mobile Money' fluid style={{ maxWidth: '40px', borderRadius: '50%' }} />
                        <Image src={moovMoneyLogo} alt='Moov Money' fluid style={{ maxWidth: '40px', borderRadius: '50%' }} />
                        <Image src={waveLogo} alt='Wave' fluid style={{ maxWidth: '40px', borderRadius: '50%' }} />
                      </div>
                      <p className='text-center mt-1 text-muted' style={{fontSize: '0.8rem'}}>Paiement sécurisé via CinetPay</p>
                    </div>
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