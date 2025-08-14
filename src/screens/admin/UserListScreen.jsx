import React, { useState } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FaBell } from 'react-icons/fa';
import Message from '../../components/Message';
import WarningModal from '../../components/admin/WarningModal'; // NOUVEL IMPORT
import { useGetUsersQuery, useUpdateUserStatusMutation, useUpdateUserRoleMutation } from '../../slices/adminApiSlice';

const UserListScreen = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();

  // --- NOUVEAUX ÉTATS POUR LE MODAL ---
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  // --- FIN DE L'AJOUT ---

  const { userInfo } = useSelector((state) => state.auth);

  // --- NOUVELLE FONCTION POUR OUVRIR LE MODAL ---
  const handleShowWarningModal = (user) => {
    setSelectedUser(user);
    setShowWarningModal(true);
  };
  // --- FIN DE L'AJOUT ---

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

  const isSuperAdmin = (email) => email === process.env.SUPER_ADMIN_EMAIL;

  return (
    <>
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
                  { user.email !== userInfo.email && !isSuperAdmin(user.email) && (
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
                        className='btn-sm me-2'
                        onClick={() => handleRoleToggle(user._id, user.isAdmin)}
                      >
                        {user.isAdmin ? 'Révoquer Admin' : 'Nommer Admin'}
                      </Button>
                      
                      {/* --- NOUVEAU BOUTON D'AVERTISSEMENT --- */}
                      <Button
                        variant='outline-danger'
                        className='btn-sm'
                        onClick={() => handleShowWarningModal(user)}
                      >
                        <FaBell />
                      </Button>
                      {/* --- FIN DE L'AJOUT --- */}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* --- DÉCLARATION DU MODAL --- */}
      {selectedUser && (
        <WarningModal 
          show={showWarningModal}
          handleClose={() => setShowWarningModal(false)}
          user={selectedUser}
        />
      )}
      {/* --- FIN DE L'AJOUT --- */}
    </>
  );
};

export default UserListScreen;