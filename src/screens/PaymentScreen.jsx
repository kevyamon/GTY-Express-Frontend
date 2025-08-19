import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaPaypal, FaMoneyBillWave, FaMobileAlt } from 'react-icons/fa';
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

  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  const mobileMoneyHandler = () => {
    toast.info("Mobile Money n'est pas encore disponible, mais le sera bientôt !");
  };

  return (
    <div>
      <CheckoutSteps step={2} />
      <h1>Méthode de Paiement</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as='legend' className='mb-3'>Sélectionnez une méthode</Form.Label>
          <Col>
            {/* --- CORRECTION : Remplacement de Form.Check par un input standard --- */}
            <input 
              type='radio' 
              id='PayPal' 
              name='paymentMethod' 
              value='PayPal' 
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="payment-method-input"
              checked={paymentMethod === 'PayPal'}
            />
            <label htmlFor="PayPal" className='payment-method-label'>
              <FaPaypal className="payment-icon paypal" />
              <div>
                <span className="fw-bold">PayPal ou Carte de Crédit</span>
                <small className="d-block text-muted">Paiement sécurisé en ligne (Simulation)</small>
              </div>
            </label>

            {/* --- CORRECTION : Remplacement de Form.Check par un input standard --- */}
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

            <div className='payment-method-label disabled' onClick={mobileMoneyHandler}>
              <FaMobileAlt className="payment-icon mobile-money" />
              <div>
                <span className="fw-bold">Mobile Money</span>
                <small className="d-block text-muted">Bientôt disponible</small>
              </div>
            </div>
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