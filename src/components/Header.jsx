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

  // --- LOGIQUE DES NOTIFICATIONS ---

  // 1. Pour l'ADMIN : On récupère toutes les commandes toutes les 15s
  const { data: adminOrders } = useGetOrdersQuery(undefined, {
    skip: !userInfo?.isAdmin,
    pollingInterval: 15000,
  });

  // 2. Pour le CLIENT : On récupère SES commandes toutes les 15s
  const { data: clientOrders } = useGetMyOrdersQuery(undefined, {
    skip: !userInfo || userInfo.isAdmin, // On saute si l'utilisateur n'est pas connecté ou s'il est admin
    pollingInterval: 15000,
  });

  // Calcul des compteurs et notifications
  const { totalOrders, cancelledOrders, hasNotification } = useMemo(() => {
    let totalOrders = 0;
    let cancelledOrders = 0;
    let hasNotification = false;

    if (userInfo?.isAdmin && adminOrders) {
      totalOrders = adminOrders.length;
      cancelledOrders = adminOrders.filter((o) => o.status === 'Annulée').length;
    } else if (userInfo && !userInfo.isAdmin && clientOrders) {
      // Une notification est active si une commande est confirmée ou expédiée
      hasNotification = clientOrders.some(
        (o) => o.status === 'Confirmée' || o.status === 'Expédiée'
      );
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
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container fluid>
          <Navbar.Brand as={Link} to={userInfo ? "/products" : "/"}>
            GTY Express
          </Navbar.Brand>
          
          <Form onSubmit={submitHandler} className="d-flex mx-auto">
            <Form.Control
              type='text' name='q' onChange={(e) => setKeyword(e.target.value)}
              value={keyword} placeholder='Rechercher des produits...'
              className='mr-sm-2 ml-sm-5'
            ></Form.Control>
            <Button type='submit' variant='outline-success' className='p-2 mx-2'>
              Rechercher
            </Button>
          </Form>

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
                    <>
                      {userInfo.name}
                      {/* Compteurs pour l'ADMIN */}
                      {userInfo.isAdmin && totalOrders > 0 && (
                        <Badge pill style={{ marginLeft: '5px', backgroundColor: 'purple' }}>
                          {totalOrders}
                        </Badge>
                      )}
                      {userInfo.isAdmin && cancelledOrders > 0 && (
                        <Badge pill bg='warning' text='dark' style={{ marginLeft: '5px' }}>
                          {cancelledOrders}
                        </Badge>
                      )}
                      {/* Point de notification pour le CLIENT */}
                      {!userInfo.isAdmin && hasNotification && (
                        <Badge pill bg="danger" style={{ marginLeft: '5px' }}> </Badge>
                      )}
                    </>
                  } id="username">
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