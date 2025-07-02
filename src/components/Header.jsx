import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  // ... reste du code existant ...
  
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to="/">GTY Express</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {userInfo ? (
                <>
                  <Nav.Link as={Link} to="/cart">🛒 Panier</Nav.Link>
                  <NavDropdown title={userInfo.name} id='username'>
                    <Nav.Link as={Link} to="/products" className="dropdown-item">Produits</Nav.Link>
                    {/* LIENS ADMIN */}
                    {userInfo && userInfo.isAdmin && (
                      <>
                        <NavDropdown.Divider />
                        <Nav.Link as={Link} to='/admin/productlist' className="dropdown-item">Gestion Produits</Nav.Link>
                        {/* Ajoutez ici les futurs liens (Gestion Commandes, etc.) */}
                      </>
                    )}
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logoutHandler}>Déconnexion</NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Se Connecter</Nav.Link>
                  <Nav.Link as={Link} to="/register">S'inscrire</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
