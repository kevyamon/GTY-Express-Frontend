import { Navbar, Nav, Container, NavDropdown, Badge, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useMemo, useEffect } from 'react';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { useGetOrdersQuery, useGetMyOrdersQuery } from '../slices/orderApiSlice';
import { logout } from '../slices/authSlice';
import './Header.css';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const { data: adminOrders } = useGetOrdersQuery(undefined, {
    skip: !userInfo?.isAdmin,
    pollingInterval: 15000,
  });

  const { data: clientOrders } = useGetMyOrdersQuery(undefined, {
    skip: !userInfo || userInfo.isAdmin,
    pollingInterval: 15000,
  });

  const [lastSeenData, setLastSeenData] = useState(() => {
    const saved = localStorage.getItem('lastSeenData');
    return saved ? JSON.parse(saved) : { lastSeenTimestamp: new Date(0).toISOString() };
  });

  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [cancelledOrdersCount, setCancelledOrdersCount] = useState(0);
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    if (userInfo?.isAdmin && adminOrders) {
      const lastSeenTimestamp = localStorage.getItem('lastSeenAdminTimestamp') || new Date(0).toISOString();
      const newOrders = adminOrders.filter(o => new Date(o.createdAt) > new Date(lastSeenTimestamp));
      const newCancelled = adminOrders.filter(o => o.status === 'Annulée' && new Date(o.updatedAt) > new Date(lastSeenTimestamp));
      setNewOrdersCount(newOrders.length);
      setCancelledOrdersCount(newCancelled.length);
    } else if (userInfo && !userInfo.isAdmin && clientOrders) {
      const seenOrders = JSON.parse(localStorage.getItem('seenOrders')) || {};
      const newUpdate = clientOrders.some(order => {
        const lastSeenTime = seenOrders[order._id];
        return !lastSeenTime || new Date(order.updatedAt) > new Date(lastSeenTime);
      });
      setHasNotification(newUpdate);
    }
  }, [userInfo, adminOrders, clientOrders, lastSeenData]);

  const handleAdminMenuClick = () => {
    localStorage.setItem('lastSeenAdminTimestamp', new Date().toISOString());
    setNewOrdersCount(0);
    setCancelledOrdersCount(0);
  };

  const handleClientMenuClick = () => {
    if (clientOrders) {
      const updatedSeenOrders = JSON.parse(localStorage.getItem('seenOrders')) || {};
      clientOrders.forEach(order => {
        updatedSeenOrders[order._id] = order.updatedAt;
      });
      localStorage.setItem('seenOrders', JSON.stringify(updatedSeenOrders));
      setHasNotification(false);
    }
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [logoutApiCall] = useLogoutMutation();

  const submitHandler = (e) => {
    e.preventDefault();
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
    } catch (err) { console.error(err); }
  };

  return (
    <header className="header-layout">
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect className='pb-0'>
        <Container fluid>
          <div className="header-top-row">
            <Navbar.Brand as={Link} to="/">GTY Express</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link as={Link} to="/cart">
                  🛒 Panier
                  {cartItems.length > 0 && (<Badge pill bg="success" style={{ marginLeft: '5px' }}>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</Badge>)}
                </Nav.Link>
                {userInfo ? (
                  <NavDropdown title={
                      <div className='profile-icon-container'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/></svg>
                        {userInfo.isAdmin && newOrdersCount > 0 && (<Badge pill style={{ marginLeft: '5px', backgroundColor: 'purple' }}>{newOrdersCount}</Badge>)}
                        {userInfo.isAdmin && cancelledOrdersCount > 0 && (<Badge pill bg='warning' text='dark' style={{ marginLeft: '5px' }}>{cancelledOrdersCount}</Badge>)}
                        {!userInfo.isAdmin && hasNotification && (<Badge pill bg="danger" style={{ marginLeft: '5px' }}> </Badge>)}
                      </div>
                    } id="username" align="end">
                    <NavDropdown.Item as={Link} to="/profile" onClick={handleClientMenuClick}>Mes Commandes</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/profile-details">Informations personnelles</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/products">Produits</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/favorites">Mes Favoris</NavDropdown.Item>
                    {userInfo.isAdmin && (
                      <>
                        <NavDropdown.Divider />
                        <NavDropdown.Item as={Link} to="/admin/productlist" onClick={handleAdminMenuClick}>Gestion Produits</NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin/orderlist" onClick={handleAdminMenuClick}>Gestion Commandes</NavDropdown.Item>
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
          <Form.Control type='text' name='q' onChange={(e) => setKeyword(e.target.value)} value={keyword} placeholder='Rechercher...' className='mr-sm-2'></Form.Control>
          <Button type='submit' variant='outline-success' className='p-2 ms-2'>OK</Button>
        </Form>
        <div className="d-flex align-items-center mt-3">
            <Link to="/products" className="home-icon-link"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16"><path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z"/></svg></Link>
            <Link to="/supermarket" className="supermarket-btn ms-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 256 256"><path d="M213.6,218.4a8.1,8.1,0,0,1-10.4,2.4L160,200H96L52.8,220.8a7.9,7.9,0,0,1-10.4-2.4,7.9,7.9,0,0,1-2.4-10.4l48-112A8,8,0,0,1,96,92h64a8,8,0,0,1,7.2,4.8l48,112A7.9,7.9,0,0,1,213.6,218.4ZM183,184,152,108h-48L73,184Z"></path></svg>
              <span className="ms-2 d-none d-lg-block">Supermarché</span>
            </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;