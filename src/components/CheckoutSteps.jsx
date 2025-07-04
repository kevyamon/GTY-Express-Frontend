import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './CheckoutSteps.css';

const CheckoutSteps = ({ step }) => {
  return (
    <div className='checkout-steps d-flex justify-content-center mb-4'>
      {/* Étape 1 : Livraison */}
      <Button
        as={Link}
        to='/shipping'
        variant={step >= 1 ? 'success' : 'light'}
        disabled={false} // Toujours cliquable
      >
        {step > 1 && '✅ '}Livraison
      </Button>

      {/* Étape 2 : Paiement */}
      <Button
        as={Link}
        to='/payment'
        variant={step >= 2 ? (step === 2 ? 'primary' : 'success') : 'light'}
        disabled={step < 2}
      >
        {step > 2 && '✅ '}Paiement
      </Button>

      {/* Étape 3 : Valider */}
      <Button
        as={Link}
        to='/placeorder'
        variant={step >= 3 ? (step === 3 ? 'primary' : 'success') : 'light'}
        disabled={step < 3}
      >
        Valider
      </Button>
    </div>
  );
};

export default CheckoutSteps;