import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import './PaymentScreen.css'; // On importe le nouveau style

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div>
      <CheckoutSteps step={2} />
      <h1>Méthode de Paiement</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend' className='mb-3'>Sélectionnez une méthode</Form.Label>
          <Col>
            <Form.Check 
              type='radio' 
              id='PayPal' 
              name='paymentMethod' 
              value='PayPal' 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="payment-method-input" // On cache le bouton radio
              checked={paymentMethod === 'PayPal'}
            />
            <label htmlFor="PayPal" className='payment-method-label'>
              PayPal ou Carte de Crédit (Simulation)
            </label>

            <Form.Check 
              type='radio' 
              id='Cash' 
              name='paymentMethod' 
              value='Cash' 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="payment-method-input"
              checked={paymentMethod === 'Cash'}
            />
            <label htmlFor="Cash" className='payment-method-label'>
              Paiement Cache à la livraison
            </label>
          </Col>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3'>
          Continuer
        </Button>
      </Form>
    </div>
  );
};

export default PaymentScreen;