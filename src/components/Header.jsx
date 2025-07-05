import { Navbar, Nav, Container, NavDropdown, Badge, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useMemo } from 'react';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { useGetOrdersQuery, useGetMyOrdersQuery } from '../slices/orderApiSlice';
import { logout } from '../slices/authSlice';

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
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setKeyword('');
    } else {
      navigate('/products');
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
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container fluid>
          <Navbar.Brand as={Link} to={userInfo ? "/products" : "/"}>GTY Express</Navbar.Brand>
          
          <div className="d-flex flex-grow-1 justify-content-center">
            <Form onSubmit={submitHandler} className="d-flex" style={{ maxWidth: '500px', width: '100%' }}>
              <Form.Control
                type='text' name='q' onChange={(e) => setKeyword(e.target.value)}
                value={keyword} placeholder='Rechercher des produits...'
                className='mr-sm-2'
              ></Form.Control>
              <Button type='submit' variant='outline-success' className='p-2 ms-2'>Rechercher</Button>
            </Form>
          </div>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/cart">
                🛒 Panier
                {cartItems.length > 0 && (
                  <Badge pill bg="success" style={{ marginLeft: '5px' }}>
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                  </Badge>
                )}
              </Nav.Link>

              {userInfo ? (
                <NavDropdown title={
                    <div className='d-flex align-items-center'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                        <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                      </svg>
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
                    <>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/admin/productlist">Gestion Produits</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/orderlist">Gestion Commandes</NavDropdown.Item>
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
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;