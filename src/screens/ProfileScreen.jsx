import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Message from '../components/Message';
import { toast } from 'react-toastify';
import { useGetMyOrdersQuery, useCancelOrderMutation } from '../slices/orderApiSlice';

const ProfileScreen = () => {
  const { data: orders, isLoading, error, refetch } = useGetMyOrdersQuery();
  const [cancelOrder, { isLoading: loadingCancel }] = useCancelOrderMutation();

  const cancelHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      try {
        await cancelOrder(id).unwrap();
        refetch(); // On rafraîchit la liste pour voir le nouveau statut
        toast.success('Commande annulée');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div>
      <h2>Mes Commandes</h2>
      {isLoading || loadingCancel ? (
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
                <td>{order._id}</td>
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
                  
                  {/* ON AJOUTE LE BOUTON ANNULER ICI */}
                  {order.status === 'En attente' && (
                    <Button
                      className='btn-sm ms-2'
                      variant='danger'
                      onClick={() => cancelHandler(order._id)}
                    >
                      Annuler
                    </Button>
                  )}
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