import { useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import { useGetMyOrdersQuery, useCancelOrderMutation, useDeleteOrderMutation } from '../slices/orderApiSlice';

const ProfileScreen = () => {
  const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery();
  const [cancelOrder, { isLoading: loadingCancel }] = useCancelOrderMutation();
  const [deleteOrder, { isLoading: loadingDelete }] = useDeleteOrderMutation();

  useEffect(() => {
    if (orders) {
      const seenOrders = JSON.parse(localStorage.getItem('seenOrders')) || {};
      orders.forEach(order => {
        seenOrders[order._id] = order.updatedAt;
      });
      localStorage.setItem('seenOrders', JSON.stringify(seenOrders));
    }
  }, [orders]);

  const cancelHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      try {
        await cancelOrder(id).unwrap();
        refetch();
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

  return (
    <div>
      <h2>Mes Commandes</h2>
      {isLoading || loadingCancel || loadingDelete ? (
        <p>Chargement...</p>
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAYÉ</th>
              <th>STATUT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 10)}...</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.totalPrice.toFixed(2)} FCFA</td>
                <td>
                  {order.isPaid ? (
                    `Le ${new Date(order.paidAt).toLocaleDateString()}`
                  ) : (
                    <span style={{ color: 'red' }}>Non</span>
                  )}
                </td>
                <td>{order.status}</td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button className='btn-sm' variant='light'>
                      Détails
                    </Button>
                  </LinkContainer>
                  
                  {order.status === 'En attente' && (
                    <Button
                      className='btn-sm ms-2'
                      variant='warning'
                      onClick={() => cancelHandler(order._id)}
                    >
                      Annuler
                    </Button>
                  )}

                  {/* CORRECTION : Le bouton est maintenant toujours visible */}
                  <Button
                    className='btn-sm ms-2'
                    variant='danger'
                    onClick={() => deleteHandler(order._id)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ProfileScreen;