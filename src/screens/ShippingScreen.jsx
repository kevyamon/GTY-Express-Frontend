import { useState, useMemo } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { getData } from 'country-list';
import { saveShippingAddress } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  const [phone, setPhone] = useState(shippingAddress?.phone || ''); // NOUVEAU

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const countryOptions = useMemo(() => getData().map(c => ({ value: c.code, label: c.name })), []);
  const selectedCountry = countryOptions.find(opt => opt.label === country);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country, phone })); // NOUVEAU
    navigate('/payment');
  };

  return (
    <div>
      <CheckoutSteps step={1} />
      <h1>Adresse de Livraison</h1>
      <Form onSubmit={submitHandler}>
        {/* ... champs adresse, ville, code postal ... */}
        
        <Form.Group className='my-2' controlId='country'>
          <Form.Label>Pays</Form.Label>
          <Select
            options={countryOptions}
            value={selectedCountry}
            onChange={(selectedOption) => setCountry(selectedOption.label)}
            placeholder="Sélectionnez ou tapez un pays..."
            isSearchable
            required
          />
        </Form.Group>

        <Form.Group className='my-2' controlId='phone'>
          <Form.Label>Numéro de Téléphone</Form.Label>
          <Form.Control
            type='tel'
            placeholder='Entrez votre numéro de téléphone'
            value={phone}
            required
            onChange={(e) => setPhone(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-2'>
          Continuer
        </Button>
      </Form>
    </div>
  );
};

export default ShippingScreen;