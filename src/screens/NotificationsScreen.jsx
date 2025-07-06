import { useGetNotificationsQuery, useDeleteNotificationMutation } from '../slices/notificationApiSlice';
import { ListGroup, Spinner, Button, Badge, Row, Col, Card } from 'react-bootstrap';
import Message from '../components/Message';
import { FaTrash } from 'react-icons/fa';

const NotificationsScreen = () => {
  const { data: notifications, isLoading, error } = useGetNotificationsQuery();
  const [deleteNotification] = useDeleteNotificationMutation();

  const handleDelete = async (notifId) => {
    try {
      await deleteNotification(notifId);
    } catch (err) {
      console.error('Erreur suppression notification:', err);
    }
  };

  return (
    <div>
      <h2 className="mb-4">🔔 Centre de Notifications</h2>
      {isLoading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <Row>
          {notifications.length === 0 && (
            <Message variant="info">Aucune nouvelle notification</Message>
          )}
          {notifications.map((notif) => (
            <Col key={notif.notificationId} sm={12} md={12} className="mb-3">
              <Card
                bg={!notif.isRead ? 'light' : 'dark'}
                text={!notif.isRead ? 'dark' : 'white'}
                className="shadow-sm"
              >
                <Card.Body className="d-flex justify-content-between align-items-start">
                  <div onClick={() => window.location.href = notif.link} style={{ cursor: 'pointer', flex: 1 }}>
                    <Card.Text className="mb-1">{notif.message}</Card.Text>
                    <small className="text-muted">{new Date(notif.createdAt).toLocaleString('fr-FR')}</small>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-3"
                    onClick={() => handleDelete(notif.notificationId)}
                  >
                    <FaTrash />
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default NotificationsScreen;