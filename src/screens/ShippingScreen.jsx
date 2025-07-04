import { useState, useMemo } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'; // On importe le nouveau composant
import { getData } from 'country-list'; // On importe la liste des pays
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // On prépare la liste des pays pour le composant Select
  const countryOptions = useMemo(() => getData().map(c => ({ value: c.code, label: c.name })), []);
  const selectedCountry = countryOptions.find(opt => opt.label === country);


  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div>
      <h1>Livraison</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='address'>
          <Form.Label>Adresse</Form.Label>
          <Form.Control
            type='text'
            placeholder='Entrez votre adresse'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
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

        <Form.Group className='my-2' controlId='postalCode'>
          <Form.Label>Code Postal</Form.Label>
          <Form.Control
            type='text'
            placeholder='Entrez votre code postal'
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='country'>
          <Form.Label>Pays</Form.Label>
          {/* ON REMPLACE L'ANCIEN CHAMP PAR LE NOUVEAU COMPOSANT */}
          <Select
            options={countryOptions}
            value={selectedCountry}
            onChange={(selectedOption) => setCountry(selectedOption.label)}
            placeholder="Sélectionnez ou tapez un pays..."
            isSearchable
          />
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-2'>
          Continuer
        </Button>
      </Form>
    </div>
  );
};

export default ShippingScreen;