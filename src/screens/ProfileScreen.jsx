import { Table, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Message from '../components/Message';
import { useGetMyOrdersQuery } from '../slices/orderApiSlice';

const ProfileScreen = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div>
      <h2>Mes Commandes</h2>
      {isLoading ? (
        <p>Chargement...</p>
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAYÉ</th>
              <th>STATUT</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.totalPrice.toFixed(2)} FCFA</td>
                <td>
                  {order.isPaid ? (
                    `Le ${new Date(order.paidAt).toLocaleDateString()}`
                  ) : (
                    <span style={{ color: 'red' }}>Non</span>
                  )}
                </td>
                <td>{order.status}</td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button className='btn-sm' variant='light'>
                      Détails
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ProfileScreen;