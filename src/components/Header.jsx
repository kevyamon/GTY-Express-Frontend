import { Navbar, Nav, Container, NavDropdown, Badge, Form, Button, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useMemo, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaTag, FaComments, FaBell } from 'react-icons/fa';
import { useLogoutMutation, useGetProfileDetailsQuery } from '../slices/usersApiSlice';
import { useGetOrdersQuery } from '../slices/orderApiSlice';
import { useGetNotificationsQuery, useMarkAsReadMutation } from '../slices/notificationApiSlice';
import { useGetConversationsQuery, useMarkAllAsReadMutation } from '../slices/messageApiSlice';
import { useGetComplaintsQuery, useGetUsersQuery } from '../slices/adminApiSlice';
import { logout } from '../slices/authSlice';
import { apiSlice, useSocketQuery } from '../slices/apiSlice';
import CategoryMenu from './CategoryMenu';
import AdminMenuModal from './AdminMenuModal'; // NOUVEL IMPORT
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);

  // --- GESTION DES TIMESTAMPS POUR LES NOTIFICATIONS "NON LUES" ---
  const [lastSeen, setLastSeen] = useState(() => {
    try {
      const item = localStorage.getItem('adminLastSeen');
      return item ? JSON.parse(item) : { orders: new Date(0), users: new Date(0), complaints: new Date(0) };
    } catch (e) {
      return { orders: new Date(0), users: new Date(0), complaints: new Date(0) };
    }
  });

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  useSocketQuery(undefined, { skip: !userInfo });
  useGetProfileDetailsQuery(undefined, { skip: !userInfo });

  // --- REQUÊTES POUR LES COMPTEURS ADMIN ---
  const { data: adminOrders } = useGetOrdersQuery(undefined, { skip: !userInfo?.isAdmin });
  const { data: complaints } = useGetComplaintsQuery(undefined, { skip: !userInfo?.isAdmin });
  const { data: users } = useGetUsersQuery(undefined, { skip: !userInfo?.isAdmin });

  const { data: notifications } = useGetNotificationsQuery(undefined, { skip: !userInfo });
  const { data: conversations } = useGetConversationsQuery(undefined, { skip: !userInfo });
  
  const [logoutApiCall] = useLogoutMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllMessagesAsRead] = useMarkAllAsReadMutation();
  const homePath = userInfo ? '/products' : '/';

  // --- LOGIQUE DES COMPTEURS ---
  const newOrdersCount = useMemo(() => {
    if (userInfo?.isAdmin && Array.isArray(adminOrders)) {
      const lastSeenDate = new Date(lastSeen.orders);
      return adminOrders.filter(o => new Date(o.createdAt) > lastSeenDate).length;
    }
    return 0;
  }, [userInfo, adminOrders, lastSeen.orders]);

  const pendingComplaintsCount = useMemo(() => {
    if (userInfo?.isAdmin && Array.isArray(complaints)) {
      return complaints.filter(c => c.status === 'pending').length;
    }
    return 0;
  }, [userInfo, complaints]);

  const newUsersCount = useMemo(() => {
    if (userInfo?.isAdmin && Array.isArray(users)) {
      const lastSeenDate = new Date(lastSeen.users);
      return users.filter(u => new Date(u.createdAt) > lastSeenDate).length;
    }
    return 0;
  }, [userInfo, users, lastSeen.users]);

  const totalAdminCount = useMemo(() => {
    return newOrdersCount + pendingComplaintsCount + newUsersCount;
  }, [newOrdersCount, pendingComplaintsCount, newUsersCount]);

  const unreadMessagesCount = useMemo(() => userInfo && Array.isArray(conversations) ? conversations.filter(c => c.isUnread).length : 0, [conversations, userInfo]);
  const unreadNotifsCount = useMemo(() => userInfo && Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0, [notifications, userInfo]);

  const handleAdminNavigate = (path, key) => {
    if (key) {
      const now = new Date().toISOString();
      const newLastSeen = { ...lastSeen, [key]: now };
      localStorage.setItem('adminLastSeen', JSON.stringify(newLastSeen));
      setLastSeen(newLastSeen);
    }
    navigate(path);
  };

  const handleChatClick = async () => { /* ... (inchangé) ... */ };
  const handleNotificationClick = async () => { /* ... (inchangé) ... */ };
  const submitHandler = (e) => { /* ... (inchangé) ... */ };
  const logoutHandler = async () => { /* ... (inchangé) ... */ };

  return (
    <>
      <header className="header-layout">
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect className='pb-0'>
          <Container fluid>
            <LinkContainer to={homePath}>
              <Navbar.Brand>GTY Express</Navbar.Brand>
            </LinkContainer>
            <Nav className="me-auto">
              {userInfo && <CategoryMenu />}
            </Nav>

            {/* --- NOUVEAU BOUTON ADMIN 📢 --- */}
            {userInfo && userInfo.isAdmin && (
              <Button variant="outline-light" onClick={() => setShowAdminModal(true)} className="position-relative me-3">
                <FaBell />
                {totalAdminCount > 0 && (
                  <Badge pill bg="danger" className="icon-badge" style={{ top: '-8px', right: '-8px' }}>
                    {totalAdminCount}
                  </Badge>
                )}
              </Button>
            )}

            <LinkContainer to="/promotions">
              <Nav.Link className="text-danger fw-bold d-flex align-items-center">
                <FaTag className="me-1" /> PROMO
              </Nav.Link>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto align-items-center">
                {userInfo ? (
                  <NavDropdown title={<div className='profile-icon-container'>{userInfo.profilePicture ? <Image src={userInfo.profilePicture} alt={userInfo.name} className="profile-image" /> : '👤'}</div>} id="username" align="end">
                    <LinkContainer to="/profile-details"><NavDropdown.Item>Informations</NavDropdown.Item></LinkContainer>
                    <LinkContainer to="/profile"><NavDropdown.Item>Mes Commandes</NavDropdown.Item></LinkContainer>
                    <LinkContainer to="/favorites"><NavDropdown.Item>Mes Favoris</NavDropdown.Item></LinkContainer>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logoutHandler}>Déconnexion</NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to="/login"><Nav.Link>👤 Se Connecter</Nav.Link></LinkContainer>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div className="header-search-row bg-dark">
          <Form onSubmit={submitHandler} className="d-flex search-form">
            <Form.Control type='text' name='q' onChange={(e) => setKeyword(e.target.value)} value={keyword} placeholder='Rechercher...' className='mr-sm-2' />
            <Button type='submit' variant='outline-success' className='p-2 ms-2'>🔍</Button>
          </Form>
        </div>
      </header>

      {/* --- LE MODAL ADMIN EST DÉCLARÉ ICI --- */}
      {userInfo && userInfo.isAdmin && (
        <AdminMenuModal 
          show={showAdminModal}
          handleClose={() => setShowAdminModal(false)}
          newUsersCount={newUsersCount}
          newOrdersCount={newOrdersCount}
          pendingComplaintsCount={pendingComplaintsCount}
          onNavigate={handleAdminNavigate}
        />
      )}
    </>
  );
};
// Les fonctions inchangées sont omises ici pour la clarté, mais elles doivent rester dans votre fichier
Header.prototype.handleChatClick = async function() {
    const { unreadMessagesCount, markAllMessagesAsRead, navigate } = this.props; // Adapter les props
    try {
      if (unreadMessagesCount > 0) await markAllMessagesAsRead().unwrap();
    } catch (err) { console.error("Erreur", err); } 
    finally { navigate('/chat'); }
};
Header.prototype.handleNotificationClick = async function() {
    const { unreadNotifsCount, markAsRead, navigate } = this.props; // Adapter les props
    if (unreadNotifsCount > 0) {
      try { await markAsRead().unwrap(); } 
      catch (err) { toast.error("Erreur"); }
    }
    navigate('/notifications');
};
Header.prototype.submitHandler = function(e) {
    e.preventDefault();
    const { keyword, navigate, homePath, setKeyword } = this.props; // Adapter les props
    if (keyword.trim()) { navigate(`/search/${keyword}`); setKeyword(''); } 
    else { navigate(homePath); }
};
Header.prototype.logoutHandler = async function() {
    const { logoutApiCall, dispatch, navigate } = this.props; // Adapter les props
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      navigate('/login');
    } catch (err) { console.error(err); }
};


export default Header;