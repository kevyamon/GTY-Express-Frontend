import React, { useState } from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaUserSlash, FaHeadset, FaFileAlt, FaSignOutAlt } from 'react-icons/fa';
import { logout } from '../slices/authSlice';
import { useLogoutMutation } from '../slices/usersApiSlice';
import ComplaintModal from '../components/ComplaintModal';
import SupportContactModal from '../components/SupportContactModal'; // NOUVEL IMPORT
import './BannedScreen.css'; // NOUVEL IMPORT

const BannedScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();

    const [showComplaintModal, setShowComplaintModal] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false); // NOUVEL ÉTAT

    const logoutHandler = async () => {
        try {
          await logoutApiCall().unwrap();
          dispatch(logout());
          navigate('/login');
        } catch (err) { console.error(err); }
    };

    return (
        <>
            <Container className="banned-screen-container">
                <div className="banned-card">
                    <div className="banned-icon">
                        <FaUserSlash />
                    </div>
                    <h1>Accès Suspendu</h1>
                    <p>
                        Votre compte a été temporairement suspendu par un administrateur pour non-respect de nos conditions d'utilisation.
                    </p>
                    <div className="banned-actions">
                        <Button variant="primary" className="mb-2" onClick={() => setShowSupportModal(true)}>
                            <FaHeadset className="me-2" /> Contacter le support
                        </Button>
                        <Button variant="outline-secondary" className="mb-2" onClick={() => setShowComplaintModal(true)}>
                           <FaFileAlt className="me-2" /> Faire une réclamation
                        </Button>
                        <Button variant="outline-danger" onClick={logoutHandler}>
                            <FaSignOutAlt className="me-2" /> Se déconnecter
                        </Button>
                    </div>
                </div>
            </Container>

            {/* Les deux modales sont prêtes à être utilisées */}
            <ComplaintModal show={showComplaintModal} handleClose={() => setShowComplaintModal(false)} />
            <SupportContactModal show={showSupportModal} handleClose={() => setShowSupportModal(false)} onContactChosen={() => {}} />
        </>
    );
};

export default BannedScreen;