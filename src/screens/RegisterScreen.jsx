import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState(''); // Ajout de l'état pour le téléphone
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
    } else {
      try {
        const res = await register({ name, email, password, phone }).unwrap(); // On envoie le téléphone
        dispatch(setCredentials({ ...res }));
        navigate('/products');
      } catch (err) {
        toast.error(err?.data?.message || err.error || err.message);
      }
    }
  };

  return (
    <div>
      <h1>S'inscrire</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Nom</Form.Label>
          <Form.Control type='text' placeholder='Entrez votre nom' value={name} onChange={(e) => setName(e.target.value)} required></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control type='email' placeholder='Entrez votre email' value={email} onChange={(e) => setEmail(e.target.value)} required></Form.Control>
        </Form.Group>
        
        {/* CHAMP TÉLÉPHONE AJOUTÉ */}
        <Form.Group className='my-2' controlId='phone'>
          <Form.Label>Numéro de téléphone</Form.Label>
          <Form.Control type='tel' placeholder='Entrez votre numéro' value={phone} onChange={(e) => setPhone(e.target.value)} required></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Mot de passe</Form.Label>
          <Form.Control type='password' placeholder='Entrez votre mot de passe' value={password} onChange={(e) => setPassword(e.target.value)} required></Form.Control>
        </Form.Group>
        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirmer le mot de passe</Form.Label>
          <Form.Control type='password' placeholder='Confirmez le mot de passe' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' disabled={isLoading}>
          S'inscrire
        </Button>
      </Form>

      <Row className='py-3'>
        <Col>Déjà un compte? <Link to={`/login`}>Se connecter</Link></Col>
      </Row>
    </div>
  );
};

export default RegisterScreen;