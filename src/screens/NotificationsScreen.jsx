import { useGetNotificationsQuery, useDeleteNotificationMutation } from '../slices/notificationApiSlice';
import { ListGroup, Spinner, Button } from 'react-bootstrap';
import Message from '../components/Message';

const NotificationsScreen = () => {
  const { data: notifications, isLoading, error, refetch } = useGetNotificationsQuery();
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      refetch(); // met à jour après suppression
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Notifications</h1>
      {isLoading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <ListGroup>
          {notifications.length === 0 && <Message>Aucune nouvelle notification</Message>}
          {notifications.map((notif) => (
            <ListGroup.Item
              key={notif._id}
              as="div"
              variant={!notif.isRead ? 'light' : ''}
              className="d-flex justify-content-between align-items-start"
            >
              <a href={notif.link} className="flex-grow-1 text-decoration-none text-reset">
                <p className="mb-1">{notif.message}</p>
                <small className="text-muted">{new Date(notif.createdAt).toLocaleString('fr-FR')}</small>
              </a>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(notif._id)}
                className="ms-3"
              >
                🗑️
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default NotificationsScreen;