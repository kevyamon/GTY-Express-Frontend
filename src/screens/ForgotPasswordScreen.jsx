import { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForgotPasswordMutation } from '../slices/usersApiSlice';
import Message from '../components/Message';
import './AuthForm.css'; // On réutilise le style des formulaires d'authentification

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ email }).unwrap();
      setMessage('Un e-mail avec les instructions pour réinitialiser votre mot de passe a été envoyé. Veuillez vérifier votre boîte de réception.');
      toast.success('Email envoyé !');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='auth-container'>
      <Card className='auth-card'>
        <Card.Body>
          <h1>Mot de passe oublié</h1>
          {message ? (
            <Message variant='success'>{message}</Message>
          ) : (
            <Form onSubmit={submitHandler}>
              <Form.Group className='my-3' controlId='email'>
                <Form.Label>Adresse Email</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='Entrez votre email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                ></Form.Control>
              </Form.Group>

              <Button type='submit' variant='primary' disabled={isLoading} className='mt-2'>
                {isLoading ? 'Envoi...' : 'Envoyer le lien'}
              </Button>
            </Form>
          )}

          <Row className='py-3'>
            <Col className='auth-switch-link'>
              <Link to='/login'>Retour à la connexion</Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ForgotPasswordScreen;