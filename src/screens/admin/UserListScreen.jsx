import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import { useGetUsersQuery, useUpdateUserStatusMutation } from '../../slices/adminApiSlice';

const UserListScreen = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [updateUserStatus, { isLoading: isUpdating }] = useUpdateUserStatusMutation();

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    const actionText = newStatus === 'banned' ? 'bannir' : 'réactiver';

    if (window.confirm(`Êtes-vous sûr de vouloir ${actionText} cet utilisateur ?`)) {
      try {
        await updateUserStatus({ userId, status: newStatus }).unwrap();
        toast.success('Statut de l\'utilisateur mis à jour.');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div>
      <h1>Gestion des Utilisateurs</h1>
      {isUpdating && <p>Mise à jour...</p>}
      {isLoading ? (
        <p>Chargement...</p>
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOM</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th>STATUT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                <td>{user.isAdmin ? '✅' : '❌'}</td>
                <td>
                  <Badge bg={user.status === 'active' ? 'success' : 'danger'}>
                    {user.status === 'active' ? 'Actif' : 'Banni'}
                  </Badge>
                </td>
                <td>
                  <Button
                    variant={user.status === 'active' ? 'warning' : 'success'}
                    className='btn-sm'
                    onClick={() => handleStatusToggle(user._id, user.status)}
                  >
                    {user.status === 'active' ? 'Suspendre' : 'Réactiver'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default UserListScreen;