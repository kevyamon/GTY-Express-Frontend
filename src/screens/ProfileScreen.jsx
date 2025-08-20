import { useEffect } from 'react';
import { Button, Row, Col, Card, Badge, ListGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useGetMyOrdersQuery, useCancelOrderMutation, useDeleteOrderMutation } from '../slices/orderApiSlice';
import { FaHashtag, FaCalendar, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaEdit, FaTrashAlt, FaCommentDots } from 'react-icons/fa';
import './ProfileScreen.css'; // NOUVEL IMPORT

const ProfileScreen = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();
  const [cancelOrder, { isLoading: loadingCancel }] = useCancelOrderMutation();
  const [deleteOrder, { isLoading: loadingDelete }] = useDeleteOrderMutation();

  const cancelHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      try {
        await cancelOrder(id).unwrap();
        toast.success('Commande annulée');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande de votre historique ? Cette action est irréversible.')) {
        try {
            await deleteOrder(id).unwrap();
            toast.success('Commande supprimée de votre historique');
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          }
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Livrée': return 'success';
      case 'Confirmée': return 'primary';
      case 'Expédiée': return 'info';
      case 'En attente': return 'warning';
      case 'Annulée': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <h2 className="mb-4">Mes Commandes</h2>
      {isLoading || loadingCancel || loadingDelete ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Row>
          {orders.length === 0 ? (
             <Col>
                <Message>Vous n'avez pas encore de commandes. <Link to="/products">Commencez vos achats !</Link></Message>
             </Col>
          ) : (
            orders.map((order) => (
              <Col key={order._id} sm={12} md={6} className="mb-4">
                <Card className="order-card-profile h-100">
                  <Card.Header as="div" className="d-flex justify-content-between align-items-center">
                    <div>
                      <FaHashtag className="me-1" />
                      <strong>COMMANDE</strong> {order.orderNumber || order._id.substring(18)}
                    </div>
                    <Badge bg={getStatusVariant(order.status)}>{order.status}</Badge>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <FaCalendar className="icon-blue" />
                        <div>
                            <strong>Date:</strong>
                            <span className="ms-2">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <FaMoneyBillWave className="icon-blue" />
                        <div>
                            <strong>Total:</strong>
                            <span className="ms-2 fw-bold">{order.totalPrice.toFixed(2)} FCFA</span>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        {order.isPaid ? <FaCheckCircle className="text-success" /> : <FaTimesCircle className="text-danger" />}
                        <div className="ms-2">
                            <strong>Payé:</strong>
                            <span className="ms-2">{order.isPaid ? `Le ${new Date(order.paidAt).toLocaleDateString('fr-FR')}` : 'Non'}</span>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                  <Card.Footer>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant='dark' size="sm">Détails</Button>
                    </LinkContainer>
                    
                    {order.status === 'En attente' && (
                      <Button variant='warning' size="sm" onClick={() => cancelHandler(order._id)}>
                        <FaTimesCircle className="me-1" /> Annuler
                      </Button>
                    )}

                    {order.status === 'Livrée' && (
                      <LinkContainer to={`/product/${order.orderItems[0].product}`}>
                          <Button variant='info' size="sm">
                              <FaCommentDots className="me-1" /> Laisser un avis
                          </Button>
                      </LinkContainer>
                    )}
                    
                    {(order.status === 'Livrée' || order.status === 'Annulée') && (
                      <Button variant='danger' size="sm" onClick={() => deleteHandler(order._id)}>
                        <FaTrashAlt className="me-1" /> Supprimer
                      </Button>
                    )}
                  </Card.Footer>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </div>
  );
};

export default ProfileScreen;