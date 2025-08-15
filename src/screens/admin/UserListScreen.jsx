import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap'; // Badge n'est plus nécessaire ici
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FaBell } from 'react-icons/fa';
import Message from '../../components/Message';
import WarningModal from '../../components/WarningModal';
import { useGetUsersQuery, useUpdateUserStatusMutation, useUpdateUserRoleMutation } from '../../slices/adminApiSlice';
import './UserListScreen.css'; // --- NOUVEL IMPORT DU STYLE ---

const UserListScreen = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);

  const handleShowWarningModal = (user) => {
    setSelectedUser(user);
    setShowWarningModal(true);
  };

  // --- LOGIQUE MISE À JOUR POUR LE TOGGLE ---
  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    try {
      await updateUserStatus({ userId, status: newStatus }).unwrap();
      toast.success(`Utilisateur ${newStatus === 'banned' ? 'banni' : 'réactivé'}.`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
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
      {(isUpdatingStatus || isUpdatingRole) && <p>Mise à jour en cours...</p>}
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
              <th>STATUT (Actif / Banni)</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={{ opacity: user.status === 'banned' ? 0.6 : 1 }}>
                <td>{user.name}</td>
                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                <td>{user.phone}</td>
                <td>{user.isAdmin ? '✅' : '❌'}</td>
                <td>
                  {/* --- REMPLACEMENT DU BADGE PAR LE TOGGLE --- */}
                  { user.email !== userInfo.email && !isSuperAdmin(user.email) ? (
                    <label className="status-toggle">
                      <input 
                        type="checkbox" 
                        checked={user.status === 'active'}
                        onChange={() => handleStatusToggle(user._id, user.status)}
                      />
                      <span className="slider"></span>
                    </label>
                  ) : (
                    <span>{user.status === 'active' ? 'Actif' : 'Banni'}</span>
                  )}
                </td>
                <td>
                  { user.email !== userInfo.email && !isSuperAdmin(user.email) && (
                    <>
                      {/* Le bouton Suspendre/Réactiver a été supprimé car le toggle le remplace */}
                      <Button
                        variant={user.isAdmin ? 'danger' : 'info'}
                        className='btn-sm me-2'
                        onClick={() => handleRoleToggle(user._id, user.isAdmin)}
                      >
                        {user.isAdmin ? 'Révoquer Admin' : 'Nommer Admin'}
                      </Button>
                      
                      <Button
                        variant='outline-danger'
                        className='btn-sm'
                        onClick={() => handleShowWarningModal(user)}
                      >
                        <FaBell />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {selectedUser && (
        <WarningModal 
          show={showWarningModal}
          handleClose={() => setShowWarningModal(false)}
          user={selectedUser}
        />
      )}
    </>
  );
};

export default UserListScreen;