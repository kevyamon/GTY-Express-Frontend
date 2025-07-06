import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { FaBell, FaShoppingCart, FaStore, FaHome, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useGetNotificationsQuery, useMarkAllAsReadMutation } from '../slices/notificationApiSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const [logoutApiCall] = useLogoutMutation();

  const {
    data: notifications,
    refetch,
    pollingInterval = 10000,
  } = useGetNotificationsQuery(undefined, {
    skip: !userInfo,
    pollingInterval: 10000,
  });

  const [markAsRead] = useMarkAllAsReadMutation();

  const unreadNotifsCount = notifications?.filter((notif) => !notif.isRead).length || 0;

  const handleLogout = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async () => {
    if (unreadNotifsCount > 0) {
      try {
        await markAsRead();
        refetch(); // Recharger les notifications après mise à jour
      } catch (err) {
        console.error('Erreur markAsRead:', err);
      }
    }
    navigate('/notifications');
  };

  return (
    <header>
      <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>GTY Express</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>

              {userInfo && (
                <>
                  <Nav.Link onClick={handleNotificationClick}>
                    <FaBell />
                    {unreadNotifsCount > 0 && (
                      <Badge pill bg='danger' style={{ marginLeft: '5px' }}>
                        {unreadNotifsCount}
                      </Badge>
                    )}
                  </Nav.Link>

                  <LinkContainer to='/cart'>
                    <Nav.Link>
                      <FaShoppingCart /> 
                    </Nav.Link>
                  </LinkContainer>

                  <LinkContainer to='/'>
                    <Nav.Link>
                      <FaHome />
                    </Nav.Link>
                  </LinkContainer>

                  <LinkContainer to='/supermarche'>
                    <Nav.Link>
                      <FaStore />
                    </Nav.Link>
                  </LinkContainer>
                </>
              )}

              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profil</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={handleLogout}>
                    Déconnexion
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <FaUser /> Se connecter
                  </Nav.Link>
                </LinkContainer>
              )}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>Utilisateurs</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>Produits</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>Commandes</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}

            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;