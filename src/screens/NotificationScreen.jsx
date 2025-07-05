import { useGetNotificationsQuery } from '../slices/notificationApiSlice';
import { ListGroup, Spinner } from 'react-bootstrap';
import Message from '../components/Message';

const NotificationsScreen = () => {
  const { data: notifications, isLoading, error } = useGetNotificationsQuery();

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
            <ListGroup.Item key={notif._id} as="a" href={notif.link} variant={!notif.isRead ? 'light' : ''}>
              <p className="mb-1">{notif.message}</p>
              <small className="text-muted">{new Date(notif.createdAt).toLocaleString('fr-FR')}</small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default NotificationsScreen;