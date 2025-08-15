import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // NOUVEAUX ÉTATS
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false); // Pour afficher les règles

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  // --- LOGIQUE DE VALIDATION DU MOT DE PASSE ---
  const validatePassword = (pass) => {
    const hasMinLength = pass.length >= 9;
    const hasNumber = /\d{2,}/.test(pass); // Au moins 2 chiffres
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return { hasMinLength, hasNumber, hasSpecialChar };
  };

  const { hasMinLength, hasNumber, hasSpecialChar } = validatePassword(password);
  const isPasswordValid = hasMinLength && hasNumber && hasSpecialChar;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error('Votre mot de passe ne respecte pas les critères de sécurité.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (!agreedToTerms) {
      toast.error('Vous devez accepter les conditions générales pour continuer.');
      return;
    }
    
    try {
      const res = await register({ name, email, password, phone }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate('/products');
    } catch (err) {
      toast.error(err?.data?.message || err.error || err.message);
    }
  };

  return (
    <div>
      <h1>S'inscrire</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Nom</Form.Label>
          <Form.Control type='text' placeholder='Entrez votre nom' value={name} onChange={(e) => setName(e.target.value)} required />
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control type='email' placeholder='Entrez votre email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>
        
        <Form.Group className='my-2' controlId='phone'>
          <Form.Label>Numéro de téléphone</Form.Label>
          <Form.Control type='tel' placeholder='Entrez votre numéro' value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Mot de passe</Form.Label>
          <InputGroup>
            <Form.Control 
              type={showPassword ? 'text' : 'password'} 
              placeholder='Entrez votre mot de passe' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              required 
            />
            <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputGroup>
          {passwordFocus && (
            <div className='password-rules'>
              <small style={{ color: hasMinLength ? 'green' : 'red' }}>✓ 9 caractères minimum</small><br/>
              <small style={{ color: hasNumber ? 'green' : 'red' }}>✓ Au moins 2 chiffres</small><br/>
              <small style={{ color: hasSpecialChar ? 'green' : 'red' }}>✓ 1 caractère spécial (!, @, #...)</small>
            </div>
          )}
        </Form.Group>

        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirmer le mot de passe</Form.Label>
          <InputGroup>
            <Form.Control 
              type={showConfirmPassword ? 'text' : 'password'} 
              placeholder='Confirmez le mot de passe' 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
            <Button variant="outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </Button>
          </InputGroup>
        </Form.Group>

        <Form.Group className="my-3" controlId="formBasicCheckbox">
          <Form.Check 
            type="checkbox" 
            label={<span>J'accepte les <Link to="/terms" target="_blank">Conditions Générales d'Utilisation</Link></span>}
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
          />
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