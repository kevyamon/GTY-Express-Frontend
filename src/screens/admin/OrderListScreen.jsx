import React, { useState, useMemo } from 'react';
import { Button, Row, Col, Form, InputGroup, Badge, Collapse, ListGroup, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaSearch, FaChevronDown, FaChevronUp, FaArchive, FaInbox, FaMapMarkerAlt } from 'react-icons/fa'; // Ajout de FaMapMarkerAlt
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {
  useGetOrdersQuery,
  useGetArchivedOrdersQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useArchiveOrderMutation
} from '../../slices/orderApiSlice';
import { getOptimizedUrl } from '../../utils/cloudinaryUtils';
import './OrderListScreen.css';

const OrderListScreen = () => {
  const [showArchived, setShowArchived] = useState(false);

  const { data: activeOrders, isLoading: isLoadingActive } = useGetOrdersQuery(undefined, { skip: showArchived });
  const { data: archivedOrders, isLoading: isLoadingArchived } = useGetArchivedOrdersQuery(undefined, { skip: !showArchived });

  const orders = showArchived ? archivedOrders : activeOrders;
  const isLoading = showArchived ? isLoadingArchived : isLoadingActive;

  const [updateOrderStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [archiveOrder, { isLoading: isArchiving }] = useArchiveOrderMutation();

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(order => {
      const query = searchQuery.toLowerCase();
      const userName = order.user?.name?.toLowerCase() || '';
      const orderNumber = order.orderNumber?.toLowerCase() || '';
      const orderId = order._id?.toLowerCase() || '';

      return userName.includes(query) || orderNumber.includes(query) || orderId.includes(query);
    });
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

  if (isLoading) { return <Loader />; }

  return (
    <>
      <Row className='align-items-center mb-4'>
        <Col><h1>{showArchived ? 'Commandes Archivées' : 'Gestion des Commandes'}</h1></Col>
        <Col md="auto">
          <InputGroup>
            <InputGroup.Text><FaSearch /></InputGroup.Text>
            <Form.Control
              placeholder="Rechercher par client ou N°..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md="auto" className="text-end">
          <Button variant="info" onClick={() => setShowArchived(!showArchived)}>
            {showArchived ? <FaInbox className="me-2"/> : <FaArchive className="me-2" />}
            {showArchived ? 'Voir les commandes actives' : 'Voir les archives'}
          </Button>
        </Col>
      </Row>

      {(isUpdating || isDeleting || isArchiving) && <Loader />}

      {filteredOrders.length === 0 && (
        <Message variant='info'>{showArchived ? 'Aucune commande dans les archives.' : 'Aucune commande active à afficher.'}</Message>
      )}

      {filteredOrders.map((order) => (
        <div key={order._id} className="order-list-card">
          <div className="order-card-header" onClick={() => handleToggleDetails(order._id)}>
            <div>
              <span className="order-id">N° : {order.orderNumber || order._id}</span>
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
                {/* --- DÉBUT DE L'AJOUT --- */}
                <div className="shipping-info">
                  <FaMapMarkerAlt className="me-2" />
                  <span>
                    {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.country}
                  </span>
                </div>
                {/* --- FIN DE L'AJOUT --- */}
                <div className="order-total">
                  {(order.totalPrice || 0).toFixed(2)} FCFA
                </div>
              </div>

              <div className="details-cell items-cell">
                <h6 className="mb-3">Articles Commandés :</h6>
                <ListGroup variant="flush" className="order-items-list">
                  {order.orderItems.map((item) => (
                    <ListGroup.Item key={item._id} className="order-item-admin">
                      <Image src={getOptimizedUrl(item.image)} alt={item.name} className="order-item-image-admin" />
                      <div className="order-item-details-admin">
                        <div>{item.name}</div>
                        <small>{item.qty} x {item.price.toFixed(2)} FCFA</small>
                      </div>
                      <div className="order-item-total-admin">
                        <strong>{(item.qty * item.price).toFixed(2)} FCFA</strong>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>

              <div className="details-cell">
                <h5>Actions :</h5>
                <div className="actions-container">
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