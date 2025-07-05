import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap'; // Ajouter InputGroup
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useUpdateProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const ProfileDetailsScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // État pour voir/cacher le mdp

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPhone(userInfo.phone || ''); // On pré-remplit le téléphone
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id, name, email, phone, password,
        }).unwrap();
        dispatch(setCredentials(res));
        toast.success('Profil mis à jour avec succès');
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Row className="justify-content-md-center">
      <Col md={6}>
        <h2>Informations Personnelles</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group className='my-3' controlId='name'>
            <Form.Label>Nom</Form.Label>
            <Form.Control type='text' placeholder='Entrez votre nom' value={name} onChange={(e) => setName(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group className='my-3' controlId='email'>
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' placeholder='Entrez votre email' value={email} onChange={(e) => setEmail(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group className='my-3' controlId='phone'>
            <Form.Label>Numéro de téléphone</Form.Label>
            <Form.Control type='tel' placeholder='Ajoutez votre numéro' value={phone} onChange={(e) => setPhone(e.target.value)}></Form.Control>
          </Form.Group>
          
          <hr />

          <Form.Group className='my-3' controlId='password'>
            <Form.Label>Nouveau Mot de passe</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder='Laissez vide pour ne pas changer'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
              <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁️'}
              </Button>
            </InputGroup>
          </Form.Group>

          <Form.Group className='my-3' controlId='confirmPassword'>
            <Form.Label>Confirmer le nouveau Mot de passe</Form.Label>
            <Form.Control type='password' placeholder='Confirmez le mot de passe' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' disabled={isLoading}>
            Mettre à jour
          </Button>
          {isLoading && <p>Mise à jour...</p>}
        </Form>
      </Col>
    </Row>
  );
};

export default ProfileDetailsScreen;