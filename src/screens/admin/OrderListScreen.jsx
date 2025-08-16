import React, { useState, useMemo } from 'react';
import { Button, Row, Col, Form, InputGroup, Badge, Collapse } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaSearch, FaChevronDown, FaChevronUp, FaArchive, FaInbox } from 'react-icons/fa';
import Message from '../../components/Message';
import { 
  useGetOrdersQuery, 
  useGetArchivedOrdersQuery, // --- NOUVEL IMPORT ---
  useUpdateOrderStatusMutation, 
  useDeleteOrderMutation,
  useArchiveOrderMutation
} from '../../slices/orderApiSlice';
import './OrderListScreen.css';

const OrderListScreen = () => {
  // --- GESTION DE L'AFFICHAGE DES ARCHIVES ---
  const [showArchived, setShowArchived] = useState(false);

  const { data: activeOrders, isLoading: isLoadingActive } = useGetOrdersQuery(undefined, { skip: showArchived });
  const { data: archivedOrders, isLoading: isLoadingArchived } = useGetArchivedOrdersQuery(undefined, { skip: !showArchived });
  
  const orders = showArchived ? archivedOrders : activeOrders;
  const isLoading = showArchived ? isLoadingArchived : isLoadingActive;
  // --- FIN DE LA GESTION ---

  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [archiveOrder, { isLoading: isArchiving }] = useArchiveOrderMutation();
  
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

  const handleArchiveOrder = async (orderId, isArchived) => {
    const actionText = isArchived ? 'désarchiver' : 'archiver';
    if (window.confirm(`Êtes-vous sûr de vouloir ${actionText} cette commande ?`)) {
        try {
            await archiveOrder(orderId).unwrap();
            toast.info(`Commande ${actionText} avec succès.`);
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
  // L'erreur n'est plus pertinente ici car on gère les deux états
  // if (error && !orders) { return <Message variant='danger'>{error?.data?.message || error.message}</Message>; }

  return (
    <>
      <Row className='align-items-center mb-4'>
        <Col><h1>{showArchived ? 'Commandes Archivées' : 'Gestion des Commandes'}</h1></Col>
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
        <Col md="auto" className="text-end">
          {/* --- BOUTON POUR CHANGER DE VUE --- */}
          <Button variant="info" onClick={() => setShowArchived(!showArchived)}>
            {showArchived ? <FaInbox className="me-2"/> : <FaArchive className="me-2" />}
            {showArchived ? 'Voir les commandes actives' : 'Voir les archives'}
          </Button>
        </Col>
      </Row>

      {(isUpdating || isDeleting || isArchiving) && <p>Mise à jour en cours...</p>}

      {filteredOrders.length === 0 && (
        <Message variant='info'>{showArchived ? 'Aucune commande dans les archives.' : 'Aucune commande active à afficher.'}</Message>
      )}

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
                    {/* --- AFFICHAGE CONDITIONNEL DES ACTIONS --- */}
                    {!showArchived ? (
                        <>
                            <Button variant="primary" size="sm" onClick={() => handleStatusChange(order._id, 'Confirmée')} disabled={order.status !== 'En attente'}>Confirmer</Button>
                            <Button variant="info" size="sm" onClick={() => handleStatusChange(order._id, 'Expédiée')} disabled={order.status === 'Annulée' || order.status === 'Livrée'}>Expédier</Button>
                            <Button variant="success" size="sm" onClick={() => handleStatusChange(order._id, 'Livrée')} disabled={order.status === 'Annulée' || order.status === 'Livrée'}>Marquer comme Livré</Button>
                            {!order.isPaid && <Button variant="success" size="sm" onClick={() => handleMarkAsPaid(order._id)} disabled={order.status === 'Annulée'}>Marquer comme Payé</Button>}
                            <Button variant="warning" size="sm" onClick={() => handleStatusChange(order._id, 'Annulée')} disabled={order.status === 'Annulée' || order.status === 'Livrée'}>Annuler</Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteOrder(order._id)}>Supprimer</Button>
                            <Button variant="dark" size="sm" onClick={() => handleArchiveOrder(order._id, false)} title="Archiver la commande">
                                <FaArchive /> Archiver
                            </Button>
                        </>
                    ) : (
                        <Button variant="info" size="sm" onClick={() => handleArchiveOrder(order._id, true)} title="Désarchiver la commande">
                            <FaArchive /> Désarchiver
                        </Button>
                    )}
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