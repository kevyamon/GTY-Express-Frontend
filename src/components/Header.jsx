import { Navbar, Nav, Container, NavDropdown, Badge, Form, Button, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { useGetOrdersQuery, useGetMyOrdersQuery } from '../slices/orderApiSlice';
import { useMarkAsReadMutation, useGetNotificationsQuery } from '../slices/notificationApiSlice';
import { logout } from '../slices/authSlice';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [logoutApiCall] = useLogoutMutation();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const { data: adminOrders } = useGetOrdersQuery(undefined, {
    skip: !userInfo?.isAdmin,
    pollingInterval: 5000,
  });

  const { data: clientOrders } = useGetMyOrdersQuery(undefined, {
    skip: !userInfo || userInfo.isAdmin,
    pollingInterval: 5000,
  });

  const { data: notifications, refetch } = useGetNotificationsQuery(undefined, {
    skip: !userInfo,
    pollingInterval: 5000,
  });

  const [markAsRead] = useMarkAsReadMutation();

  const [lastSeenAdminTimestamp, setLastSeenAdminTimestamp] = useState(
    () => localStorage.getItem('lastSeenAdminTimestamp') || new Date(0).toISOString()
  );

  const { newOrdersCount, cancelledOrdersCount, unreadNotifsCount } = useMemo(() => {
    let newOrders = 0;
    let cancelledOrders = 0;
    let unreadNotifs = 0;
    const lastSeen = new Date(lastSeenAdminTimestamp);

    if (userInfo?.isAdmin && Array.isArray(adminOrders)) {
      newOrders = adminOrders.filter(o => new Date(o.createdAt) > lastSeen).length;
      cancelledOrders = adminOrders.filter(o => o.status === 'Annulée' && new Date(o.updatedAt) > lastSeen).length;
    }

    if (userInfo && Array.isArray(notifications)) {
      unreadNotifs = notifications.filter(n => !n.isRead).length;
    }

    return {
      newOrdersCount: newOrders,
      cancelledOrdersCount: cancelledOrders,
      unreadNotifsCount: unreadNotifs,
    };
  }, [userInfo, adminOrders, notifications, lastSeenAdminTimestamp]);

  const handleAdminMenuClick = () => {
    const now = new Date().toISOString();
    localStorage.setItem('lastSeenAdminTimestamp', now);
    setLastSeenAdminTimestamp(now);
  };

  const handleNotificationClick = async () => {
    if (unreadNotifsCount > 0) {
      try {
        await markAsRead();
        refetch();
      } catch (err) {
        console.error('Erreur markAsRead:', err);
      }
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('Veuillez vous connecter pour faire une recherche.');
      navigate('/login');
      return;
    }
    const currentPath = window.location.pathname;
    const isSupermarket = currentPath.startsWith('/supermarket');
    if (keyword.trim()) {
      const searchPath = isSupermarket ? `/supermarket/search/${keyword}` : `/search/${keyword}`;
      navigate(searchPath);
      setKeyword('');
    } else {
      const basePath = isSupermarket ? '/supermarket' : '/products';
      navigate(basePath);
    }
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="header-layout">
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect className='pb-0'>
        <Container fluid>
          <div className="header-top-row">
            <Navbar.Brand as={Link} to="/">GTY Express</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto align-items-center">
                {userInfo ? (
                  <NavDropdown
                    title={
                      <div className='profile-icon-container'>
                        {/* AFFICHE L'IMAGE DE PROFIL OU L'ICÔNE PAR DÉFAUT */}
                        {userInfo.profilePicture ? (
                          <Image src={userInfo.profilePicture} alt={userInfo.name} className="profile-image" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
                        )}
                      </div>
                    }
                    id="username"
                    align="end"
                  >
                    <NavDropdown.Item as={Link} to="/profile-details">Informations personnelles</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/profile">Mes Commandes</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/favorites">Mes Favoris</NavDropdown.Item>

                    {userInfo.isAdmin && (
                      <>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="/admin/productlist" onClick={handleAdminMenuClick}>
                          Gestion Produits
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin/orderlist" onClick={handleAdminMenuClick}>
                          Gestion Commandes
                          {newOrdersCount > 0 && (<Badge pill bg="primary" className="ms-2">{newOrdersCount}</Badge>)}
                          {cancelledOrdersCount > 0 && (<Badge pill bg="warning" text="dark" className="ms-2">{cancelledOrdersCount}</Badge>)}
                        </NavDropdown.Item>
                      </>
                    )}
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logoutHandler}>Déconnexion</NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Nav.Link as={Link} to="/login">👤 Se Connecter</Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </div>
        </Container>
      </Navbar>

      <div className="header-center-row bg-dark">
        <Form onSubmit={submitHandler} className="d-flex search-form">
          <Form.Control type='text' name='q' onChange={(e) => setKeyword(e.target.value)} value={keyword} placeholder='Rechercher...' className='mr-sm-2' />
          <Button type='submit' variant='outline-success' className='p-2 ms-2'>🔍</Button>
        </Form>
        {userInfo && (
          <div className="d-flex align-items-center mt-3">
            <Link to="/cart" className="home-icon-link me-4">
              <span style={{ position: 'relative' }}>
                🛒
                {cartItems.length > 0 && (
                  <Badge pill bg="success" style={{ position: 'absolute', top: '-8px', right: '-8px', fontSize: '0.6em' }}>
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </Badge>
                )}
              </span>
            </Link>
            <Link to="/notifications" onClick={handleNotificationClick} className="home-icon-link me-4">
              <span style={{ position: 'relative' }}>
                🔔
                {unreadNotifsCount > 0 && (<Badge pill bg="danger" style={{ position: 'absolute', top: '-5px', right: '-8px' }}>{unreadNotifsCount}</Badge>)}
              </span>
            </Link>
            <Link to="/products" className="home-icon-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16"><path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z"/></svg>
            </Link>
            <Link to="/supermarket" className="supermarket-btn ms-4">
              🛍️<span className="ms-2 d-none d-lg-block">Supermarché</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;