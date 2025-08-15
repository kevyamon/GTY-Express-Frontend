import React, { useState, useMemo } from 'react';
import { Button, Form, InputGroup, Image } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { FaBell, FaSearch, FaUserShield, FaUserCog, FaInfoCircle } from 'react-icons/fa';
import Message from '../../components/Message';
import WarningModal from '../../components/WarningModal';
import UserInfoModal from '../../components/UserInfoModal';
import { useGetUsersQuery, useUpdateUserStatusMutation, useUpdateUserRoleMutation } from '../../slices/adminApiSlice';
import './UserListScreen.css';

const UserListScreen = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();
  const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  // --- CORRECTION DE LA LOGIQUE DE FILTRAGE ---
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.phone && user.phone.includes(searchQuery)) // On vérifie si user.phone existe
    );
  }, [users, searchQuery]);
  // --- FIN DE LA CORRECTION ---

  const handleShowWarningModal = (user) => {
    setSelectedUser(user);
    setShowWarningModal(true);
  };

  const handleShowInfoModal = (user) => {
    setSelectedUser(user);
    setShowInfoModal(true);
  };

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
    const actionText = newIsAdmin ? 'promouvoir en admin' : 'révoquer les droits admin de';
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
      <div className="user-list-header">
        <h1>Gestion des Utilisateurs</h1>
        <InputGroup className="search-input-group">
          <InputGroup.Text><FaSearch /></InputGroup.Text>
          <Form.Control
            placeholder="Rechercher par nom, email, téléphone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </InputGroup>
      </div>

      {isLoading ? (<p>Chargement...</p>) 
       : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) 
       : (
        <div>
          {filteredUsers.map((user) => (
            <div key={user._id} className="user-card" style={{ opacity: user.status === 'banned' ? 0.6 : 1 }}>
              <div className="user-details-row">
                <Image src={user.profilePicture || 'https://i.imgur.com/Suf6O8w.png'} alt={user.name} className="user-avatar" />
                <div className="user-info">
                  <div className="name">{user.name}</div>
                  <div className="email">{user.email}</div>
                </div>
              </div>

              { user.email !== userInfo.email && !isSuperAdmin(user.email) ? (
                <>
                  <div className="user-status">
                    <label className="status-toggle">
                      <input 
                        type="checkbox" 
                        checked={user.status === 'active'}
                        onChange={() => handleStatusToggle(user._id, user.status)}
                        disabled={isUpdatingStatus}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="user-actions">
                    <button
                      className="action-btn"
                      onClick={() => handleShowInfoModal(user)}
                      title="Voir les détails"
                    >
                      <FaInfoCircle />
                    </button>
                    <button 
                      className={`action-btn ${user.isAdmin ? 'role-admin' : 'role-user'}`} 
                      onClick={() => handleRoleToggle(user._id, user.isAdmin)}
                      disabled={isUpdatingRole}
                      title={user.isAdmin ? "Révoquer Admin" : "Nommer Admin"}
                    >
                      {user.isAdmin ? <FaUserShield /> : <FaUserCog />}
                    </button>
                    <button 
                      className="action-btn warning" 
                      onClick={() => handleShowWarningModal(user)}
                      title="Envoyer un avertissement"
                    >
                      <FaBell />
                    </button>
                  </div>
                </>
              ) : (
                <div className='user-status'><strong>{user.isAdmin ? "Super Admin" : "Connecté"}</strong></div>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <>
          <WarningModal 
            show={showWarningModal}
            handleClose={() => setShowWarningModal(false)}
            user={selectedUser}
          />
          <UserInfoModal
            show={showInfoModal}
            handleClose={() => setShowInfoModal(false)}
            user={selectedUser}
          />
        </>
      )}
    </>
  );
};

export default UserListScreen;