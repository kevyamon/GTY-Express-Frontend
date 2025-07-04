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

  const { userInfo } = useSelector((state) => state.auth);

  const [name, setName] = useState(shippingAddress?.name || userInfo?.name || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [phone, setPhone] = useState(shippingAddress?.phone || '');
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');


  const dispatch = useDispatch();
  const navigate = useNavigate();

  const countryOptions = useMemo(() => getData().map(c => ({ value: c.code, label: c.name })), []);
  const selectedCountry = countryOptions.find(opt => opt.label === country);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ name, country, city, phone, address, postalCode }));
    navigate('/payment');
  };

  return (
    <div>
      <CheckoutSteps step={1} />
      <h1>Adresse de Livraison</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Nom</Form.Label>
          <Form.Control
            type='text'
            placeholder='Entrez votre nom complet'
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='country'>
          <Form.Label>Pays</Form.Label>
          <Select
            options={countryOptions}
            value={selectedCountry}
            onChange={(selectedOption) => setCountry(selectedOption.label)}
            placeholder="Sélectionnez ou tapez un pays..."
            required
          />
        </Form.Group>

        <Form.Group className='my-2' controlId='city'>
          <Form.Label>Ville</Form.Label>
          <Form.Control
            type='text'
            placeholder='Entrez votre ville'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
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
        
        <Form.Group className='my-2' controlId='address'>
          <Form.Label>Adresse de livraison</Form.Label>
          <Form.Control
            type='text'
            placeholder='Entrez votre adresse complète (ex: quartier, rue, porte)'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='postalCode'>
          <Form.Label>Code Postal (optionnel)</Form.Label>
          <Form.Control
            type='text'
            placeholder='Entrez votre code postal'
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
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