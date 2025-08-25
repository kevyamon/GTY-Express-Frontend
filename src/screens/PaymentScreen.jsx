import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaMoneyBillWave, FaMobileAlt } from 'react-icons/fa';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';
import './PaymentScreen.css';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  // --- DÉBUT DE LA MODIFICATION ---
  // On initialise avec 'CinetPay' par défaut
  const [paymentMethod, setPaymentMethod] = useState('CinetPay');
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
            {/* Option Mobile Money (anciennement PayPal) */}
            <input 
              type='radio' 
              id='CinetPay' 
              name='paymentMethod' 
              value='CinetPay' 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="payment-method-input"
              checked={paymentMethod === 'CinetPay'}
            />
            <label htmlFor="CinetPay" className='payment-method-label'>
              <FaMobileAlt className="payment-icon mobile-money" style={{color: '#0d6efd'}} />
              <div>
                <span className="fw-bold">Mobile Money</span>
                <small className="d-block text-muted">Paiement sécurisé via CinetPay</small>
              </div>
            </label>

            {/* Option Paiement à la livraison */}
            <input 
              type='radio' 
              id='Cash' 
              name='paymentMethod' 
              value='Cash' 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="payment-method-input"
              checked={paymentMethod === 'Cash'}
            />
            <label htmlFor="Cash" className='payment-method-label'>
              <FaMoneyBillWave className="payment-icon cash" />
              <div>
                <span className="fw-bold">Paiement à la livraison</span>
                <small className="d-block text-muted">Payez en espèces lors de la réception</small>
              </div>
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