import { useGetNotificationsQuery, useDeleteNotificationMutation, useDeleteAllNotificationsMutation } from '../slices/notificationApiSlice';
import { ListGroup, Spinner, Button, Row, Col } from 'react-bootstrap';
import Message from '../components/Message';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

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

  return (
    <div className="container mt-4">
      <Row className="align-items-center mb-3">
        <Col>
            <h2 className="mb-0">📨 Mes Notifications</h2>
        </Col>
        <Col xs="auto">
            {notifications && notifications.length > 0 && (
                <Button variant="outline-danger" size="sm" onClick={handleDeleteAll} disabled={loadingDeleteAll}>
                    Tout supprimer
                </Button>
            )}
        </Col>
      </Row>
      
      {isLoading ? (
        <Spinner animation="border" />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <ListGroup className="shadow-sm">
          {notifications.length === 0 ? <Message>Aucune nouvelle notification</Message> 
          : notifications.map((notif) => (
            <ListGroup.Item
              key={notif._id}
              as="a"
              href={notif.link}
              action
              variant={!notif.isRead ? 'light' : ''}
              className="d-flex justify-content-between align-items-start"
            >
              <div>
                <div className="fw-bold">{notif.message}</div>
                <small className="text-muted">
                  {new Date(notif.createdAt).toLocaleString('fr-FR')}
                </small>
              </div>
              <Button
                variant="outline-danger"
                size="sm"
                className="ms-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete(notif._id);
                }}
              >
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