import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice';
import { useLogoutMutation } from '../slices/usersApiSlice';

const BannedScreen = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
          await logoutApiCall().unwrap();
          dispatch(logout());
          navigate('/login');
        } catch (err) { console.error(err); }
    };

    return (
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
                    <Button variant="warning" className="mx-2">Faire une réclamation</Button>
                    <Button variant="outline-danger" className="mx-2" onClick={logoutHandler}>Se déconnecter</Button>
                </div>
            </Alert>
        </Container>
    );
};

export default BannedScreen;