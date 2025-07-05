import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Importer useNavigate
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import Message from '../components/Message';
import OrderStatusTracker from '../components/OrderStatusTracker';
import {
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation, // Importer le hook de suppression
} from '../slices/orderApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate(); // Initialiser useNavigate
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId, {
    pollingInterval: 5000,
  });

  const [updateOrderStatus, { isLoading: loadingUpdate }] = useUpdateOrderStatusMutation();
  const [deleteOrder, { isLoading: loadingDelete }] = useDeleteOrderMutation(); // Utiliser le hook
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (order) {
      const seenOrders = JSON.parse(localStorage.getItem('seenOrders')) || {};
      seenOrders[order._id] = order.updatedAt;
      localStorage.setItem('seenOrders', JSON.stringify(seenOrders));
    }
  }, [order]);

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || error.error);
    }
  }, [error]);

  const updateStatusHandler = async (newStatus) => {
    // ... la fonction ne change pas ...
  };

  // NOUVELLE FONCTION pour supprimer la commande
  const deleteHandler = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande de votre historique ?')) {
      try {
        await deleteOrder(orderId).unwrap();
        toast.success('Commande supprimée');
        navigate('/profile'); // Redirige vers la liste des commandes
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
          {/* ... Le contenu de la colonne de gauche ne change pas ... */}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              {/* ... Le récapitulatif ne change pas ... */}
              
              {/* NOUVEAU BOUTON SUPPRIMER pour le client */}
              {userInfo && !userInfo.isAdmin && (
                <ListGroup.Item>
                   <Button
                    type='button'
                    className='btn btn-danger w-100'
                    onClick={deleteHandler}
                    disabled={loadingDelete}
                  >
                    Supprimer la commande
                  </Button>
                </ListGroup.Item>
              )}

              {/* ... Les boutons de l'admin ne changent pas ... */}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;