import { useGetNotificationsQuery, useDeleteNotificationMutation } from '../slices/notificationApiSlice';
import { ListGroup, Spinner, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';

const NotificationsScreen = () => {
  const { data: notifications, isLoading, error, refetch } = useGetNotificationsQuery();
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId).unwrap();
      refetch(); // 👈 recharger la liste après suppression
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  return (
    <div>
      <h1>Notifications</h1>
      {isLoading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <ListGroup>
          {notifications.length === 0 && <Message>Aucune nouvelle notification</Message>}
          {notifications.map((notif) => (
            <ListGroup.Item key={notif.notificationId} className="d-flex justify-content-between align-items-start" variant={!notif.isRead ? 'light' : ''}>
              <div>
                <a href={notif.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <p className="mb-1">{notif.message}</p>
                  <small className="text-muted">{new Date(notif.createdAt).toLocaleString('fr-FR')}</small>
                </a>
              </div>
              <Button variant="outline-danger" size="sm" onClick={() => handleDelete(notif.notificationId)}>
                <FaTrash />
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default NotificationsScreen;