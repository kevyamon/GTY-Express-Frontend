import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserSlash, FaCheckCircle, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../slices/authSlice';
import { useLogoutMutation } from '../slices/usersApiSlice';
import ComplaintModal from '../components/ComplaintModal';
import './BannedScreen.css';

const BannedScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();

    const { userInfo } = useSelector((state) => state.auth);
    const [showComplaintModal, setShowComplaintModal] = useState(false);
    const [countdown, setCountdown] = useState(15);

    // COMMENTAIRE : Détermine si le compte vient d'être réactivé en vérifiant le statut dans Redux.
    const isReactivated = userInfo?.status === 'active';

    // COMMENTAIRE : Logique du compte à rebours pour la redirection.
    useEffect(() => {
        let countdownTimer;
        let redirectTimer;

        if (isReactivated) {
            // Démarre le décompte visuel de 15 secondes.
            countdownTimer = setInterval(() => {
                setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);

            // Démarre la redirection automatique après 15 secondes.
            redirectTimer = setTimeout(() => {
                logoutHandler(true); // Se déconnecte sans message pour une redirection fluide.
            }, 15000);
        }

        // Nettoyage des timers pour éviter les fuites de mémoire.
        return () => {
            clearInterval(countdownTimer);
            clearTimeout(redirectTimer);
        };
    }, [isReactivated]);

    const logoutHandler = async (isRedirect = false) => {
        try {
          await logoutApiCall().unwrap();
          dispatch(logout());
          navigate('/login');
          if (!isRedirect) {
            // On n'affiche plus d'alerte, la redirection suffit.
          }
        } catch (err) { console.error(err); }
    };

    return (
        <>
            <Container className="banned-screen-container">
                {isReactivated ? (
                    // --- VUE COMPTE RÉACTIVÉ ---
                    <div className="status-card reactivated">
                        <h1><FaCheckCircle /> Compte Réactivé !</h1>
                        <p>
                            Bonne nouvelle ! Votre compte a été réactivé. Vous allez être redirigé vers la page de connexion dans <strong>{countdown} secondes</strong> pour pouvoir vous reconnecter.
                        </p>
                        <Button className="btn-gradient-success" onClick={() => logoutHandler(true)}>
                            Se reconnecter maintenant
                        </Button>
                    </div>
                ) : (
                    // --- VUE ACCÈS REFUSÉ ---
                    <div className="status-card refused">
                        <h1><FaUserSlash /> Accès Suspendu</h1>
                        <p>
                            Votre compte a été temporairement suspendu. Si vous pensez qu'il s'agit d'une erreur, vous pouvez nous contacter.
                        </p>
                        <Button className="btn-gradient-primary" onClick={() => setShowComplaintModal(true)}>
                            Faire une réclamation
                        </Button>
                        <Button className="btn-gradient-danger" onClick={() => logoutHandler(false)}>
                            <FaSignOutAlt className="me-2" /> Se déconnecter
                        </Button>
                    </div>
                )}
            </Container>

            <ComplaintModal show={showComplaintModal} handleClose={() => setShowComplaintModal(false)} />
        </>
    );
};

export default BannedScreen;