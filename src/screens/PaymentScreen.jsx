import { useState, useEffect } from 'react';
import { Form, Button, Col, Modal } from 'react-bootstrap'; // Ajout de Modal
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaMoneyBillWave, FaMobileAlt, FaInfoCircle } from 'react-icons/fa'; // Ajout de FaInfoCircle
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
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // On met "Cash" par défaut
  const [showDevModal, setShowDevModal] = useState(false); // État pour la modale
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };
  
  const handleMobileMoneyClick = () => {
    setShowDevModal(true); // Ouvre la modale au lieu de sélectionner l'option
  };

  return (
    <>
      <div>
        <CheckoutSteps step={2} />
        <h1>Méthode de Paiement</h1>
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label as='legend' className='mb-3'>Sélectionnez une méthode</Form.Label>
            <Col>
              {/* Option Paiement à la livraison (maintenant la première option active) */}
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

              {/* Option Mobile Money (maintenant désactivée et cliquable) */}
              <div className='payment-method-label disabled' onClick={handleMobileMoneyClick}>
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

      {/* La Modale d'information */}
      <Modal show={showDevModal} onHide={() => setShowDevModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaInfoCircle className="me-2 text-primary" /> Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <h4>Cette option de paiement est en cours de finalisation et sera bientôt disponible.</h4>
          <p className="text-muted">Merci pour votre patience !</p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary" onClick={() => setShowDevModal(false)}>
            J'ai compris
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
  // --- FIN DE LA MODIFICATION ---
};

export default PaymentScreen;