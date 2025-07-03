// ... dans Header.jsx ...
<NavDropdown title={userInfo.name} id='username'>
  <NavDropdown.Item as={Link} to="/products">Produits</NavDropdown.Item>
  
  {/* NOUVEAU LIEN */}
  <NavDropdown.Item as={Link} to="/favorites">Mes Favoris</NavDropdown.Item>
  
  {userInfo && userInfo.isAdmin && (
    // ...
  )}
  <NavDropdown.Divider />
  <NavDropdown.Item onClick={logoutHandler}>
    Déconnexion
  </NavDropdown.Item>
</NavDropdown>