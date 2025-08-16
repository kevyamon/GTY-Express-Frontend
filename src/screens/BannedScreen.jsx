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

    // Détermine si le compte vient d'être réactivé
    const isReactivated = userInfo?.status === 'active';

    // Logique du compte à rebours pour la redirection
    useEffect(() => {
        if (isReactivated) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);

            const redirectTimer = setTimeout(() => {
                logoutHandler(true); // se déconnecte sans message pour une redirection fluide
            }, 15000);

            // Nettoyage des timers
            return () => {
                clearInterval(timer);
                clearTimeout(redirectTimer);
            };
        }
    }, [isReactivated]);

    const logoutHandler = async (isRedirect = false) => {
        try {
          await logoutApiCall().unwrap();
          dispatch(logout());
          navigate('/login');
          if (!isRedirect) {
            // Affiche un message uniquement si la déconnexion est manuelle
            alert('Vous avez été déconnecté.');
          }
        } catch (err) { console.error(err); }
    };

    return (
        <>
            <Container className="banned-screen-container">
                {isReactivated ? (
                    // --- VUE COMPTE RÉACTIVÉ ---
                    <div className="status-card reactivated">
                        <h1><FaCheckCircle className="me-2" /> Compte Réactivé</h1>
                        <p>
                            Votre compte a été réactivé ! Vous allez être redirigé vers la page de connexion dans <strong>{countdown} secondes</strong> pour vous reconnecter.
                            Vous pouvez aussi cliquer sur "Se reconnecter" pour vous reconnecter immédiatement.
                        </p>
                        <Button className="btn-gradient-success" onClick={() => logoutHandler(true)}>
                            Se reconnecter
                        </Button>
                    </div>
                ) : (
                    // --- VUE ACCÈS REFUSÉ ---
                    <div className="status-card refused">
                        <h1>Accès Refusé</h1>
                        <p>
                            Votre compte a été suspendu ou banni.
                            Veuillez contacter l'administration ou faire une réclamation.
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