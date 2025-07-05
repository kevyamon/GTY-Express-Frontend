import { Navbar, Nav, Container, NavDropdown, Badge, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useMemo } from 'react';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { useGetOrdersQuery, useGetMyOrdersQuery } from '../slices/orderApiSlice';
import { logout } from '../slices/authSlice';
import './Header.css';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const { data: adminOrders } = useGetOrdersQuery(undefined, { skip: !userInfo?.isAdmin, pollingInterval: 15000 });
  const { data: clientOrders } = useGetMyOrdersQuery(undefined, { skip: !userInfo || userInfo.isAdmin, pollingInterval: 15000 });

  const { totalOrders, cancelledOrders, hasNotification } = useMemo(() => {
    let totalOrders = 0, cancelledOrders = 0, hasNotification = false;
    if (userInfo?.isAdmin && adminOrders) {
      totalOrders = adminOrders.length;
      cancelledOrders = adminOrders.filter((o) => o.status === 'Annulée').length;
    } else if (userInfo && !userInfo.isAdmin && clientOrders) {
      hasNotification = clientOrders.some((o) => o.status === 'Confirmée' || o.status === 'Expédiée');
    }
    return { totalOrders, cancelledOrders, hasNotification };
  }, [userInfo, adminOrders, clientOrders]);

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
                <Nav.Link as={Link} to="/cart">🛒 Panier
                  {cartItems.length > 0 && (
                    <Badge pill bg="success" style={{ marginLeft: '5px' }}>
                      {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                    </Badge>
                  )}
                </Nav.Link>
                {userInfo ? (
                  <NavDropdown title={
                      <div className='profile-icon-container'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16"><path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/><path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/></svg>
                        {userInfo.isAdmin && totalOrders > 0 && (<Badge pill style={{ marginLeft: '5px', backgroundColor: 'purple' }}>{totalOrders}</Badge>)}
                        {userInfo.isAdmin && cancelledOrders > 0 && (<Badge pill bg='warning' text='dark' style={{ marginLeft: '5px' }}>{cancelledOrders}</Badge>)}
                        {!userInfo.isAdmin && hasNotification && (<Badge pill bg="danger" style={{ marginLeft: '5px' }}> </Badge>)}
                      </div>
                    } id="username" align="end">
                    <NavDropdown.Item as={Link} to="/profile-details">Informations personnelles</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/profile">Mes Commandes</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/products">Produits</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/favorites">Mes Favoris</NavDropdown.Item>
                    {userInfo.isAdmin && (
                      <><NavDropdown.Divider /><NavDropdown.Item as={Link} to="/admin/productlist">Gestion Produits</NavDropdown.Item><NavDropdown.Item as={Link} to="/admin/orderlist">Gestion Commandes</NavDropdown.Item></>
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
          <Form.Control
            type='text' name='q' onChange={(e) => setKeyword(e.target.value)}
            value={keyword} placeholder='Rechercher des produits...'
            className='mr-sm-2'
          ></Form.Control>
          <Button type='submit' variant='outline-success' className='p-2 ms-2'>Rechercher</Button>
        </Form>
        <div className="d-flex align-items-center mt-3">
            <Link to="/products" className="home-icon-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16"><path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z"/></svg>
            </Link>
            <Link to="/supermarket" className="supermarket-btn ms-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-cart3" viewBox="0 0 16 16"><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.49.402H3.31l-.485 2.42A.5.5 0 0 1 2 11.5H.5a.5.5 0 0 1-.5-.5zM3.14 4l.94 4.708l.004.02a.25.25 0 0 0 .25.226h8.04l.75-3.75h-9.85zM5.5 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/></svg>
                <span className="ms-2 d-none d-lg-block">Supermarché</span>
            </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;