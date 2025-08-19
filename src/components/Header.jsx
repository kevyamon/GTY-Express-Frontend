import { Navbar, Nav, Container, NavDropdown, Badge, Form, Button, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useMemo, useContext } from 'react';
import { toast } from 'react-toastify';
import { FaTag, FaComments, FaBell, FaSyncAlt, FaDownload, FaBars } from 'react-icons/fa';
import { useLogoutMutation, useGetProfileDetailsQuery } from '../slices/usersApiSlice';
import { useGetOrdersQuery } from '../slices/orderApiSlice';
import { useGetNotificationsQuery, useMarkAsReadMutation } from '../slices/notificationApiSlice';
import { useGetConversationsQuery, useMarkAllAsReadMutation } from '../slices/messageApiSlice';
import { useGetComplaintsQuery, useGetUsersQuery } from '../slices/adminApiSlice';
import { useGetSuggestionsQuery } from '../slices/suggestionApiSlice';
import { logout } from '../slices/authSlice';
import { apiSlice } from '../slices/apiSlice';
import { VersionContext } from '../contexts/VersionContext';
import CategoryMenu from './CategoryMenu';
import AdminMenuModal from './AdminMenuModal';
import SuggestionModal from './SuggestionModal';
import MobileMenuModal from './MobileMenuModal';
import './Header.css';

const Header = ({ handleShowInstallModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const { isUpdateAvailable, isUpdateInProgress, updateDeclined, openUpdateModal } = useContext(VersionContext);

  // ✅ CORRECTION : La logique pour le bouton est correcte, mais on la rend plus robuste.
  // La mise à jour est terminée quand aucune de ces conditions n'est vraie.
  const isUpdateFinished = !isUpdateAvailable && !isUpdateInProgress;

  const showUpdateButton = isUpdateAvailable || isUpdateInProgress;
  const shouldBlink = isUpdateInProgress || (isUpdateAvailable && updateDeclined);

  const getUpdateVariant = () => {
    if (isUpdateInProgress) return 'warning'; // Jaune pendant l'installation
    if (updateDeclined) return 'danger'; // Rouge si refusé
    if (isUpdateAvailable) return 'success'; // Vert si disponible
    return 'outline-secondary'; // Gris (état final)
  };

  const [lastSeen, setLastSeen] = useState(() => {
    try {
      const item = localStorage.getItem('adminLastSeen');
      return item ? JSON.parse(item) : { orders: new Date(0), users: new Date(0), suggestions: new Date(0) };
    } catch (e) {
      return { orders: new Date(0), users: new Date(0), suggestions: new Date(0) };
    }
  });

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  
  apiSlice.useSocketQuery(undefined, { skip: !userInfo });
  useGetProfileDetailsQuery(undefined, { skip: !userInfo });
  
  const { data: adminOrders } = useGetOrdersQuery(undefined, { skip: !userInfo?.isAdmin });
  const { data: complaints } = useGetComplaintsQuery(undefined, { skip: !userInfo?.isAdmin });
  const { data: users } = useGetUsersQuery(undefined, { skip: !userInfo?.isAdmin });
  const { data: suggestions } = useGetSuggestionsQuery(undefined, { skip: !userInfo?.isAdmin });
  const { data: notifications } = useGetNotificationsQuery(undefined, { skip: !userInfo });
  const { data: conversations } = useGetConversationsQuery(undefined, { skip: !userInfo });
  
  const [logoutApiCall] = useLogoutMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllMessagesAsRead] = useMarkAllAsReadMutation();
  const homePath = userInfo ? '/products' : '/';

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
  
  const newSuggestionsCount = useMemo(() => {
    if (userInfo?.isAdmin && Array.isArray(suggestions)) {
      return suggestions.filter(s => !s.archivedBy.includes(userInfo._id)).length;
    }
    return 0;
  }, [userInfo, suggestions]);

  const totalAdminCount = useMemo(() => {
    return newOrdersCount + pendingComplaintsCount + newUsersCount + newSuggestionsCount;
  }, [newOrdersCount, pendingComplaintsCount, newUsersCount, newSuggestionsCount]);
  
  const unreadMessagesCount = useMemo(() => userInfo && Array.isArray(conversations) ? conversations.filter(c => c.isUnread).length : 0, [conversations, userInfo]);
  const unreadNotifsCount = useMemo(() => userInfo && Array.isArray(notifications) ? notifications.filter(n => !n.isRead).length : 0, [notifications, userInfo]);

  const handleMarkAsSeen = (key) => {
    if (key) {
      const now = new Date().toISOString();
      const newLastSeen = { ...lastSeen, [key]: now };
      localStorage.setItem('adminLastSeen', JSON.stringify(newLastSeen));
      setLastSeen(newLastSeen);
    }
  };

  const handleChatClick = async () => {
    try {
      if (unreadMessagesCount > 0) {
        await markAllMessagesAsRead().unwrap();
      }
    } catch (err) {
      console.error("Erreur", err);
    } finally {
      navigate('/chat');
    }
  };

  const handleNotificationClick = async () => {
    if (unreadNotifsCount > 0) {
      try {
        await markAsRead().unwrap();
      } catch (err) {
        toast.error("Erreur");
      }
    }
    navigate('/notifications');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) { navigate(`/search/${keyword}`); setKeyword(''); } 
    else { navigate(homePath); }
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      navigate('/login');
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <header className="header-layout">
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect className='pb-0'>
          <Container fluid>
            <LinkContainer to={homePath}>
              <Navbar.Brand>GTY Express</Navbar.Brand>
            </LinkContainer>

            <Button variant="outline-info" size="sm" className="install-app-btn" onClick={handleShowInstallModal}>
              <FaDownload/>
            </Button>
            
            {userInfo && (
              <Button 
                variant="dark" 
                onClick={() => setShowMobileMenu(true)} 
                className="d-lg-none ms-auto mobile-hamburger-menu"
                aria-label="Ouvrir le menu"
              >
                <FaBars />
              </Button>
            )}

            <Nav className="me-auto d-none d-lg-flex align-items-center">
              {userInfo && <CategoryMenu />}
              
              {/* ✅ CORRECTION : Le bouton est maintenant ici, visible sur tous les écrans */}
              {userInfo && (showUpdateButton || isUpdateFinished) && (
                <Button 
                    variant={getUpdateVariant()} 
                    onClick={openUpdateModal}
                    className={`ms-3 d-flex align-items-center ${shouldBlink ? 'update-available-blink' : ''}`} 
                    size="sm"
                    disabled={isUpdateFinished} // On le grise si la MàJ est finie
                >
                  <FaSyncAlt className="me-1" />
                  {isUpdateInProgress ? 'Installation...' : (isUpdateFinished ? 'À jour' : 'Màj Dispo')}
                </Button>
              )}

              <LinkContainer to="/promotions">
                <Nav.Link className="text-danger fw-bold d-flex align-items-center ms-3">
                  <FaTag className="me-1" /> PROMO
                </Nav.Link>
              </LinkContainer>
            </Nav>

            <Navbar.Toggle aria-controls="basic-navbar-nav" className="d-none" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto align-items-center d-none d-lg-flex">
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

                {userInfo ? (
                  <NavDropdown title={<div className='profile-icon-container'>{userInfo.profilePicture ? <Image src={userInfo.profilePicture} alt={userInfo.name} className="profile-image" /> : '👤'}</div>} id="username" align="end">
                    <LinkContainer to="/profile-details"><NavDropdown.Item>Informations</NavDropdown.Item></LinkContainer>
                    <LinkContainer to="/profile"><NavDropdown.Item>Mes Commandes</NavDropdown.Item></LinkContainer>
                    <LinkContainer to="/favorites"><NavDropdown.Item>Mes Favoris</NavDropdown.Item></LinkContainer>
                    {!userInfo.isAdmin && (
                      <>
                        <LinkContainer to="/profile/suggestions">
                          <NavDropdown.Item>Mes Suggestions</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Item onClick={() => setShowSuggestionModal(true)}>
                          Faire une suggestion
                        </NavDropdown.Item>
                      </>
                    )}
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

        {userInfo && (
          <div className="header-icon-row bg-dark">
            <Link to="/cart" className="home-icon-link position-relative">
              🛒
              {cartItems.length > 0 && (
                <Badge pill bg="success" className="icon-badge">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </Badge>
              )}
            </Link>
            <div onClick={handleChatClick} className="home-icon-link position-relative" style={{cursor: 'pointer'}}>
              <FaComments />
              {unreadMessagesCount > 0 && (
                <Badge pill bg="danger" className="icon-badge">{unreadMessagesCount}</Badge>
              )}
            </div>
            <div onClick={handleNotificationClick} className="home-icon-link position-relative" style={{cursor: 'pointer'}}>
              🔔
              {unreadNotifsCount > 0 && (
                <Badge pill bg="danger" className="icon-badge">{unreadNotifsCount}</Badge>
              )}
            </div>
            <Link to={homePath} className="home-icon-link">🏡</Link>
            <Link to="/supermarket" className="home-icon-link">🛍️</Link>
          </div>
        )}
      </header>
      
      {userInfo && (
        <MobileMenuModal
          show={showMobileMenu}
          handleClose={() => setShowMobileMenu(false)}
          userInfo={userInfo}
          totalAdminCount={totalAdminCount}
          logoutHandler={logoutHandler}
          handleAdminModal={() => setShowAdminModal(true)}
        />
      )}

      <SuggestionModal 
        show={showSuggestionModal} 
        handleClose={() => setShowSuggestionModal(false)} 
      />

      {userInfo && userInfo.isAdmin && (
        <AdminMenuModal 
          show={showAdminModal}
          handleClose={() => setShowAdminModal(false)}
          newUsersCount={newUsersCount}
          newOrdersCount={newOrdersCount}
          pendingComplaintsCount={pendingComplaintsCount}
          newSuggestionsCount={newSuggestionsCount}
          onNavigate={handleMarkAsSeen}
        />
      )}
    </>
  );
};

export default Header;