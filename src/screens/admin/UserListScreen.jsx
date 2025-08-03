import React from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux'; // NOUVEL IMPORT
import Message from '../../components/Message';
import { useGetUsersQuery, useUpdateUserStatusMutation, useUpdateUserRoleMutation } from '../../slices/adminApiSlice';

const UserListScreen = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();

  const { userInfo } = useSelector((state) => state.auth);

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

  const handleRoleToggle = async (userId, currentIsAdmin) => {
    const newIsAdmin = !currentIsAdmin;
    const actionText = newIsAdmin ? 'nommer admin' : 'révoquer les droits admin de';
    if (window.confirm(`Êtes-vous sûr de vouloir ${actionText} cet utilisateur ?`)) {
        try {
          await updateUserRole({ userId, isAdmin: newIsAdmin }).unwrap();
          toast.success('Rôle de l\'utilisateur mis à jour.');
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      }
  };

  const isSuperAdmin = (email) => email === 'kevyamon@gmail.com'; // Remplacez par votre email de super admin

  return (
    <div>
      <h1>Gestion des Utilisateurs</h1>
      {(isUpdatingStatus || isUpdatingRole) && <p>Mise à jour...</p>}
      {isLoading ? (
        <p>Chargement...</p>
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>NOM</th>
              <th>EMAIL</th>
              <th>TÉLÉPHONE</th>
              <th>ADMIN</th>
              <th>STATUT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                <td>{user.phone}</td>
                <td>{user.isAdmin ? '✅' : '❌'}</td>
                <td>
                  <Badge bg={user.status === 'active' ? 'success' : 'danger'}>
                    {user.status === 'active' ? 'Actif' : 'Banni'}
                  </Badge>
                </td>
                <td>
                  {/* On ne peut pas modifier le Super Admin, sauf soi-même */}
                  { !isSuperAdmin(user.email) && (
                    <>
                        <Button
                            variant={user.status === 'active' ? 'warning' : 'success'}
                            className='btn-sm me-2'
                            onClick={() => handleStatusToggle(user._id, user.status)}
                        >
                            {user.status === 'active' ? 'Suspendre' : 'Réactiver'}
                        </Button>

                        <Button
                            variant={user.isAdmin ? 'danger' : 'info'}
                            className='btn-sm'
                            onClick={() => handleRoleToggle(user._id, user.isAdmin)}
                        >
                            {user.isAdmin ? 'Révoquer Admin' : 'Nommer Admin'}
                        </Button>
                    </>
                  )}
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