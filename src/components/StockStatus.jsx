import { Badge } from 'react-bootstrap';

const StockStatus = ({ countInStock }) => {
  if (countInStock <= 0) {
    return <Badge bg='danger'>Stock Épuisé</Badge>;
  }

  if (countInStock > 0 && countInStock <= 20) {
    return <Badge bg='warning' text='dark'>Stock Limité</Badge>;
  }

  // Affiche "En Stock" si la quantité est supérieure à 20
  return <Badge bg='success'>En Stock</Badge>;
};

export default StockStatus;