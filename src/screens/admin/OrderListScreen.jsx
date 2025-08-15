import React, { useState, useMemo } from 'react';
import { Button, Row, Col, Form, InputGroup, Badge, Collapse } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaSearch, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Message from '../../components/Message';
import { 
  useGetOrdersQuery, 
  useUpdateOrderStatusMutation, 
  useDeleteOrderMutation 
} from '../../slices/orderApiSlice';
import './OrderListScreen.css';

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(order =>
      (order.user?.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order._id.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [orders, searchQuery]);

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

  if (isLoading) { return <p>Chargement...</p>; }
  if (error && !orders) { return <Message variant='danger'>{error?.data?.message || error.message}</Message>; }

  return (
    <>
      <Row className='align-items-center mb-4'>
        <Col><h1>Gestion des Commandes</h1></Col>
        <Col md="auto">
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Rechercher par client ou ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>

      {(isUpdating || isDeleting) && <p>Mise à jour en cours...</p>}

      {filteredOrders.map((order) => (
        <div key={order._id} className="order-list-card">
          <div className="order-card-header" onClick={() => handleToggleDetails(order._id)}>
            <div>
              <span className="order-id">ID : {order._id.substring(0, 12)}...</span>
              <br/>
              <small>{new Date(order.createdAt).toLocaleString('fr-FR')}</small>
            </div>
            <div>
              <Badge bg={getStatusVariant(order.status)} pill className="me-3">{order.status}</Badge>
              {expandedOrderId === order._id ? <FaChevronUp /> : <FaChevronDown />}
            </div>
          </div>
          
          <Collapse in={expandedOrderId === order._id}>
            <div>
              <div className="order-card-body">
                <div className="customer-info">
                  <div className="name">{order.user ? order.user.name : 'Utilisateur Supprimé'}</div>
                  <div className="email">{order.shippingAddress.phone}</div>
                </div>
                <div className="order-total">
                  {(order.totalPrice || 0).toFixed(2)} FCFA
                </div>
              </div>
              <div className="details-cell">
                <h5>Actions :</h5>
                <div className="actions-container">
                  <Button variant="primary" size="sm" onClick={() => handleStatusChange(order._id, 'Confirmée')} disabled={order.status !== 'En attente'}>Confirmer</Button>
                  <Button variant="info" size="sm" onClick={() => handleStatusChange(order._id, 'Expédiée')} disabled={order.status === 'Annulée' || order.status === 'Livrée'}>Expédier</Button>
                  <Button variant="success" size="sm" onClick={() => handleStatusChange(order._id, 'Livrée')} disabled={order.status === 'Annulée' || order.status === 'Livrée'}>Marquer comme Livré</Button>
                  {!order.isPaid && <Button variant="success" size="sm" onClick={() => handleMarkAsPaid(order._id)} disabled={order.status === 'Annulée'}>Marquer comme Payé</Button>}
                  <Button variant="warning" size="sm" onClick={() => handleStatusChange(order._id, 'Annulée')} disabled={order.status === 'Annulée' || order.status === 'Livrée'}>Annuler</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order._id)}>Supprimer</Button>
                </div>
              </div>
            </div>
          </Collapse>
        </div>
      ))}
    </>
  );
};

export default OrderListScreen;