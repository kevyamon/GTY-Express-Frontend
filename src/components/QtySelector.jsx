import React from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import './QtySelector.css';

const QtySelector = ({ value, onChange, max }) => {
  const increment = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const decrement = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const handleManualChange = (e) => {
    let newValue = Number(e.target.value);
    if (newValue < 1) {
      newValue = 1;
    } else if (newValue > max) {
      newValue = max;
    }
    onChange(newValue);
  };

  return (
    <InputGroup className="qty-selector">
      <Button variant="outline-secondary" onClick={decrement}>-</Button>
      <Form.Control
        type="number"
        value={value}
        onChange={handleManualChange}
      />
      <Button variant="outline-secondary" onClick={increment}>+</Button>
    </InputGroup>
  );
};

export default QtySelector;