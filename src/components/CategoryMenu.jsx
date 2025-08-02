import React from 'react';
import { NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaTh, FaTshirt, FaFutbol, FaHeartbeat, FaHome, FaShoppingCart, FaStar } from 'react-icons/fa';
import './CategoryMenu.css';

const categories = [
  { name: 'Électronique', icon: <FaTh /> },
  { name: 'Vêtements et Accessoires', icon: <FaTshirt /> },
  { name: 'Sports et Loisirs', icon: <FaFutbol /> },
  { name: 'Beauté et Santé', icon: <FaHeartbeat /> },
  { name: 'Maison et Cuisine', icon: <FaHome /> },
  { name: 'Supermarché', icon: <FaShoppingCart /> },
  { name: 'Autres', icon: <FaStar /> },
];

const CategoryMenu = () => {
  return (
    <NavDropdown title={<><FaTh className="me-2" /> Toutes les catégories</>} id="category-dropdown" className="category-menu">
      {categories.map((category) => (
        <LinkContainer to={category.name === 'Supermarché' ? '/supermarket' : `/category/${category.name}`} key={category.name}>
          <NavDropdown.Item>
            {category.icon}
            <span className="category-name">{category.name}</span>
          </NavDropdown.Item>
        </LinkContainer>
      ))}
    </NavDropdown>
  );
};

export default CategoryMenu;