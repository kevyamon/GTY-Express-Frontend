import React, { useState } from 'react'; // Ajout de useState
import { Container, Alert, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import { useLogoutMutation } from '../slices/usersApiSlice';
import ComplaintModal from '../components/ComplaintModal'; // NOUVEL IMPORT

const BannedScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();

    // État pour contrôler l'ouverture de la modale
    const [showComplaintModal, setShowComplaintModal] = useState(false);

    const logoutHandler = async () => {
        try {
          await logoutApiCall().unwrap();
          dispatch(logout());
          navigate('/login');
        } catch (err) { console.error(err); }
    };

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Alert variant="danger" className="text-center">
                    <Alert.Heading>Accès Refusé</Alert.Heading>
                    <p>
                        Votre compte a été temporairement suspendu par un administrateur.
                    </p>
                    <hr />
                    <p className="mb-0">
                        Si vous pensez qu'il s'agit d'une erreur, veuillez contacter le support ou faire une réclamation.
                    </p>
                    <div className="d-flex justify-content-center mt-3">
                        {/* Ce bouton ouvre maintenant la modale */}
                        <Button variant="warning" className="mx-2" onClick={() => setShowComplaintModal(true)}>
                            Faire une réclamation
                        </Button>
                        <Button variant="outline-danger" className="mx-2" onClick={logoutHandler}>Se déconnecter</Button>
                    </div>
                </Alert>
            </Container>

            {/* La modale est rendue ici */}
            <ComplaintModal show={showComplaintModal} handleClose={() => setShowComplaintModal(false)} />
        </>
    );
};

export default BannedScreen;