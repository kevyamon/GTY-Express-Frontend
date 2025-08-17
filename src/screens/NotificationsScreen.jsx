import { useGetNotificationsQuery, useDeleteNotificationMutation, useDeleteAllNotificationsMutation } from '../slices/notificationApiSlice';
import { Spinner, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Message from '../components/Message';
import { FaTrash, FaShoppingCart, FaExclamationCircle, FaUserShield, FaBell } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './NotificationsScreen.css'; // On importe notre nouveau fichier CSS

const NotificationsScreen = () => {
  const { data: notifications, isLoading, error } = useGetNotificationsQuery();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications, { isLoading: loadingDeleteAll }] = useDeleteAllNotificationsMutation();

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId).unwrap();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes vos notifications ?')) {
        try {
            await deleteAllNotifications().unwrap();
            toast.success('Toutes les notifications ont été supprimées');
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    }
  };
  
  // Fonction pour choisir une icône et une couleur en fonction du message
  const getNotificationIcon = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes('commande')) {
      return { icon: <FaShoppingCart />, className: 'icon-order' };
    }
    if (lowerCaseMessage.includes('réclamation')) {
      return { icon: <FaExclamationCircle />, className: 'icon-claim' };
    }
    if (lowerCaseMessage.includes('administrateur')) {
        return { icon: <FaUserShield />, className: 'icon-admin' };
    }
    return { icon: <FaBell />, className: 'icon-default' };
  };

  return (
    <div className="notifications-container">
      <Row className="align-items-center mb-4">
        <Col>
            <h2 className="mb-0">📨 Mes Notifications</h2>
        </Col>
        <Col xs="auto">
            {notifications && notifications.length > 0 && (
                <Button variant="danger" size="sm" onClick={handleDeleteAll} disabled={loadingDeleteAll}>
                    <FaTrash className="me-2" />
                    Tout supprimer
                </Button>
            )}
        </Col>
      </Row>
      
      {isLoading ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div>
          {notifications.length === 0 ? <Message>Vous n'avez aucune notification pour le moment.</Message> 
          : notifications.map((notif) => {
            const { icon, className } = getNotificationIcon(notif.message);
            return (
                <Link to={notif.link || '#'} className="text-decoration-none" key={notif._id}>
                    <div className={`notification-card ${!notif.isRead ? 'unread' : ''}`}>
                        <div className={`notification-icon-container ${className}`}>
                            {icon}
                        </div>
                        <div className="notification-content">
                            <p className="notification-message mb-0">{notif.message}</p>
                            <small className="notification-date">
                                {new Date(notif.createdAt).toLocaleString('fr-FR')}
                            </small>
                        </div>
                        <Button
                            variant="link"
                            className="notification-delete-btn"
                            onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete(notif._id);
                            }}
                        >
                            <FaTrash />
                        </Button>
                    </div>
                </Link>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsScreen;