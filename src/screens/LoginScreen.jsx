import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, InputGroup, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import './AuthForm.css'; // On importe le style commun

const LoginScreen = () => {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ loginIdentifier, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/products');
    } catch (err) {
      toast.error(err?.data?.message || err.error || err.message);
    }
  };

  return (
    <div className='auth-container'>
      <Card className='auth-card'>
        <Card.Body>
          <h1>Se connecter</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className='my-2' controlId='loginIdentifier'>
              <Form.Label>Email ou Numéro de téléphone</Form.Label>
              <Form.Control
                type='text'
                placeholder='Entrez votre email ou numéro'
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='password'>
              <Form.Label>Mot de passe</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Entrez votre mot de passe'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                ></Form.Control>
                <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            {/* --- DÉBUT DE L'AJOUT --- */}
            <div className='text-end mt-2'>
                <Link to='/forgot-password'>Mot de passe oublié ?</Link>
            </div>
            {/* --- FIN DE L'AJOUT --- */}

            <Button type='submit' variant='primary' disabled={isLoading} className='mt-3'>
              {isLoading ? 'Connexion...' : 'Se Connecter'}
            </Button>
          </Form>
          <Row className='py-3'>
            <Col className='auth-switch-link'>
              Nouveau client? <Link to='/register'>S'inscrire</Link>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginScreen;