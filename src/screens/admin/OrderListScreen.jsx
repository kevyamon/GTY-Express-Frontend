import { useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import { 
  useGetOrdersQuery, 
  useUpdateOrderStatusMutation, 
  useDeleteOrderMutation 
} from '../../slices/orderApiSlice';
import './OrderListScreen.css';

const OrderListScreen = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const handleToggleDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ orderId, status: newStatus }).unwrap();
      toast.success('Statut de la commande mis à jour');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleMarkAsPaid = async (orderId) => {
    try {
        await updateOrderStatus({ orderId, isPaid: true }).unwrap();
        toast.success('Commande marquée comme payée');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.')) {
        try {
            await deleteOrder(orderId).unwrap();
            toast.success('Commande supprimée');
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          }
    }
  };

  return (
    <>
      <h1>Gestion des Commandes</h1>
      {isLoading || isUpdating || isDeleting ? <p>Chargement...</p> : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>CLIENT</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAYÉ</th>
              <th>STATUT</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <>
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user ? order.user.name : 'Utilisateur supprimé'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>{order.totalPrice.toFixed(2)} FCFA</td>
                  <td>{order.isPaid ? '✅' : '❌'}</td>
                  <td>{order.status}</td>
                  <td>
                    <Button
                      variant='secondary'
                      className='btn-sm'
                      onClick={() => handleToggleDetails(order._id)}
                    >
                      Gérer
                    </Button>
                  </td>
                </tr>
                {expandedOrderId === order._id && (
                  <tr className="details-row">
                    <td colSpan="7" className="details-cell">
                      <h5>Actions pour la commande {order._id.substring(0, 8)}...</h5>
                      <div className="actions-container">
                        <Button variant="primary" size="sm" onClick={() => handleStatusChange(order._id, 'Confirmée')}>Confirmer</Button>
                        <Button variant="info" size="sm" onClick={() => handleStatusChange(order._id, 'Expédiée')}>Expédier</Button>
                        <Button variant="success" size="sm" onClick={() => handleStatusChange(order._id, 'Livrée')}>Marquer comme Livré</Button>
                        {!order.isPaid && <Button variant="success" size="sm" onClick={() => handleMarkAsPaid(order._id)}>Marquer comme Payé</Button>}
                        <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order._id)}>Supprimer</Button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;