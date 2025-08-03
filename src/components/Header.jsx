import { Navbar, Nav, Container, NavDropdown, Badge, Form, Button, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { FaTag, FaComments } from 'react-icons/fa'; // NOUVELLE ICÔNE

// Slices & Actions
import { useLogoutMutation, useGetProfileDetailsQuery } from '../slices/usersApiSlice';
import { useGetOrdersQuery } from '../slices/orderApiSlice';
import { useGetNotificationsQuery, useMarkAsReadMutation } from '../slices/notificationApiSlice';
import { logout } from '../slices/authSlice';
import { useSocketQuery } from '../slices/apiSlice';

// Composants
import CategoryMenu from './CategoryMenu';

// CSS
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [lastSeenAdminTimestamp, setLastSeenAdminTimestamp] = useState(
    () => localStorage.getItem('lastSeenAdminTimestamp') || new Date(0).toISOString()
  );
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  useSocketQuery(undefined, { skip: !userInfo });
  useGetProfileDetailsQuery(undefined, { skip: !userInfo });
  const { data: adminOrders } = useGetOrdersQuery(undefined, { skip: !userInfo?.isAdmin });
  const { data: notifications, refetch: refetchNotifications } = useGetNotificationsQuery(undefined, { skip: !userInfo });
  const [logoutApiCall] = useLogoutMutation();
  const [markAsRead] = useMarkAsReadMutation();
  const homePath = userInfo ? '/products' : '/';

  const newOrdersCount = useMemo(() => {
    const lastSeen = new Date(lastSeenAdminTimestamp);
    if (userInfo?.isAdmin && Array.isArray(adminOrders)) {
      return adminOrders.filter(o => new Date(o.createdAt) > lastSeen).length;
    }
    return 0;
  }, [userInfo, adminOrders, lastSeenAdminTimestamp]);
  const cancelledOrdersCount = useMemo(() => {
    const lastSeen = new Date(lastSeenAdminTimestamp);
    if (userInfo?.isAdmin && Array.isArray(adminOrders)) {
      return adminOrders.filter(o => o.status === 'Annulée' && new Date(o.updatedAt) > lastSeen).length;
    }
    return 0;
  }, [userInfo, adminOrders, lastSeenAdminTimestamp]);
  const unreadNotifsCount = useMemo(() => {
    if (userInfo && Array.isArray(notifications)) {
      return notifications.filter(n => !n.isRead).length;
    }
    return 0;
  }, [userInfo, notifications]);
  const handleAdminMenuClick = () => {
    const now = new Date().toISOString();
    localStorage.setItem('lastSeenAdminTimestamp', now);
    setLastSeenAdminTimestamp(now);
  };
  const handleNotificationClick = async () => {
    if (unreadNotifsCount > 0) {
      try {
        await markAsRead().unwrap();
        refetchNotifications();
      } catch (err) {
        toast.error("Erreur lors de la mise à jour des notifications.");
        console.error('Erreur markAsRead:', err);
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
      navigate('/login');
    } catch (err) { console.error(err); }
  };

  return (
    <header className="header-layout">
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect className='pb-0'>
        <Container fluid>
          <LinkContainer to={homePath}>
            <Navbar.Brand>GTY Express</Navbar.Brand>
          </LinkContainer>
          <Nav className="me-auto">
            {userInfo && <CategoryMenu />}
          </Nav>
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
                  {userInfo.isAdmin && (
                    <>
                      <NavDropdown.Divider />
                      <LinkContainer to="/admin/productlist" onClick={handleAdminMenuClick}><NavDropdown.Item>Gestion Produits</NavDropdown.Item></LinkContainer>
                      <LinkContainer to="/admin/orderlist" onClick={handleAdminMenuClick}><NavDropdown.Item>Gestion Commandes {newOrdersCount > 0 && <Badge pill bg="primary" className="ms-2">{newOrdersCount}</Badge>}{cancelledOrdersCount > 0 && <Badge pill bg="warning" text="dark" className="ms-2">{cancelledOrdersCount}</Badge>}</NavDropdown.Item></LinkContainer>
                      <LinkContainer to="/admin/promotionlist"><NavDropdown.Item>Gestion Promotions</NavDropdown.Item></LinkContainer>
                      <LinkContainer to="/admin/promobannerlist"><NavDropdown.Item>Gestion Bannière Promo</NavDropdown.Item></LinkContainer>
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
          <Link to="/chat" className="home-icon-link position-relative">
            <FaComments />
            {/* Le compteur de messages non lus sera ajouté ici plus tard */}
          </Link>
          <div onClick={handleNotificationClick} className="home-icon-link position-relative" style={{cursor: 'pointer'}}>
            🔔
            {unreadNotifsCount > 0 && (
              <Badge pill bg="danger" className="icon-badge">{unreadNotifsCount}</Badge>
            )}
          </div>
          <Link to={homePath} className="home-icon-link">
            🏡
          </Link>
          <Link to="/supermarket" className="home-icon-link">
            🛍️
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;