import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

// Ce composant sert maintenant de redirection vers la page de commande principale.
const PaymentGatewayScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Dès que le composant est monté, on redirige l'utilisateur
    // vers la page de commande où se trouve la logique de paiement CinetPay.
    if (orderId) {
      navigate(`/order/${orderId}`);
    } else {
      // S'il n'y a pas d'ID de commande, on redirige vers la page d'accueil.
      navigate('/');
    }
  }, [navigate, orderId]);

  // On affiche un simple loader pendant la redirection.
  return <Loader />;
};

export default PaymentGatewayScreen;