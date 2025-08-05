import React, { useState } from 'react';
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
  const { data: orders, isLoading, error } = useGetOrdersQuery();
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
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleMarkAsPaid = async (orderId) => {
    try {
        await updateOrderStatus({ orderId, isPaid: true }).unwrap();
        toast.success('Commande marquée comme payée');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
        try {
            await deleteOrder(orderId).unwrap();
            toast.success('Commande supprimée');
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          }
    }
  };

  if (isLoading) { return <p>Chargement...</p>; }
  if (error && !orders) { return <Message variant='danger'>{error?.data?.message || error.message || error.error}</Message>; }

  return (
    <>
      <h1>Gestion des Commandes</h1>
      {(isUpdating || isDeleting) && <p>Mise à jour en cours...</p>}

      <Table striped bordered hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>ID</th><th>CLIENT</th><th>DATE</th><th>TOTAL</th><th>PAYÉ</th><th>STATUT</th><th></th>
          </tr>
        </thead>
        <tbody>
          {orders?.map((order) => (
            // ON REMPLACE <> PAR <React.Fragment> AVEC UNE CLÉ UNIQUE
            <React.Fragment key={order._id}>
              <tr>
                <td>{order._id.substring(0, 10)}...</td>
                <td>{order.user ? order.user.name : 'Utilisateur supprimé'}</td>
                <td>{new Date(order.createdAt).toLocaleString('fr-FR')}</td>
                <td>{order.totalPrice.toFixed(2)} FCFA</td>
                <td>{order.isPaid ? '✅' : '❌'}</td>
                <td style={{ color: order.status === 'Annulée' ? 'red' : 'inherit' }}>{order.status}</td>
                <td>
                  <Button variant='secondary' className='btn-sm' onClick={() => handleToggleDetails(order._id)}>Gérer</Button>
                </td>
              </tr>
              {expandedOrderId === order._id && (
                <tr className="details-row">
                  <td colSpan="7" className="details-cell">
                    <h5>Actions pour la commande {order._id.substring(0, 8)}...</h5>
                    <p><strong>Téléphone du client :</strong> {order.shippingAddress.phone}</p>
                    <div className="actions-container">
                      <Button variant="primary" size="sm" onClick={() => handleStatusChange(order._id, 'Confirmée')} disabled={order.status !== 'En attente'}>Confirmer</Button>
                      <Button variant="info" size="sm" onClick={() => handleStatusChange(order._id, 'Expédiée')} disabled={order.status === 'Annulée' || order.status === 'Livrée'}>Expédier</Button>
                      <Button variant="success" size="sm" onClick={() => handleStatusChange(order._id, 'Livrée')} disabled={order.status === 'Annulée' || order.status === 'Livrée'}>Marquer comme Livré</Button>
                      {!order.isPaid && <Button variant="success" size="sm" onClick={() => handleMarkAsPaid(order._id)} disabled={order.status === 'Annulée'}>Marquer comme Payé</Button>}
                      <Button variant="warning" size="sm" onClick={() => handleStatusChange(order._id, 'Annulée')} disabled={order.status === 'Annulée' || order.status === 'Livrée'}>Annuler</Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order._id)}>Supprimer</Button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default OrderListScreen;