import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, InputGroup, Card, Modal } from 'react-bootstrap'; // Modal a été ajouté
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaExclamationTriangle } from 'react-icons/fa'; // FaExclamationTriangle a été ajoutée
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import './RegisterScreen.css';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import './AuthForm.css';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  // --- NOUVEL AJOUT : État pour contrôler la visibilité de la modale ---
  const [showTermsModal, setShowTermsModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const validatePassword = (pass) => {
    const hasMinLength = pass.length >= 9;
    const hasNumber = /\d{2,}/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return { hasMinLength, hasNumber, hasSpecialChar };
  };

  const { hasMinLength, hasNumber, hasSpecialChar } = validatePassword(password);
  const isPasswordValid = hasMinLength && hasNumber && hasSpecialChar;

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!phone || !isValidPhoneNumber(phone)) {
      toast.error('Veuillez entrer un numéro de téléphone valide.');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Votre mot de passe ne respecte pas les critères de sécurité.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    // --- MODIFICATION : On affiche la modale au lieu du toast ---
    if (!agreedToTerms) {
      setShowTermsModal(true);
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
    <>
      <div className='auth-container'>
        <Card className='auth-card'>
          <Card.Body>
            <h1>S'inscrire</h1>
            <Form onSubmit={submitHandler}>
              <Form.Group className='my-3' controlId='name'>
                <Form.Label>Nom</Form.Label>
                <Form.Control type='text' placeholder='Entrez votre nom' value={name} onChange={(e) => setName(e.target.value)} required />
              </Form.Group>

              <Form.Group className='my-3' controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control type='email' placeholder='Entrez votre email' value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>
              
              <Form.Group className='my-3 phone-input-container' controlId='phone'>
                <Form.Label>Numéro de téléphone</Form.Label>
                <PhoneInput
                  placeholder="Entrez votre numéro"
                  value={phone}
                  onChange={setPhone}
                  defaultCountry="CI"
                  international
                  withCountryCallingCode
                  required
                />
              </Form.Group>

              <Form.Group className='my-3' controlId='password'>
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
                  <div className='password-rules mt-2'>
                    <small style={{ color: hasMinLength ? 'green' : 'red' }}>✓ 9 caractères minimum</small><br/>
                    <small style={{ color: hasNumber ? 'green' : 'red' }}>✓ Au moins 2 chiffres</small><br/>
                    <small style={{ color: hasSpecialChar ? 'green' : 'red' }}>✓ 1 caractère spécial (!, @, #...)</small>
                  </div>
                )}
              </Form.Group>

              <Form.Group className='my-3' controlId='confirmPassword'>
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

              <Button type='submit' variant='primary' disabled={isLoading} className='mt-2'>
                {isLoading ? 'Inscription...' : "S'inscrire"}
              </Button>
            </Form>

            <Row className='py-3'>
              <Col className='auth-switch-link'>
                Déjà un compte? <Link to={`/login`}>Se connecter</Link>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>

      {/* --- NOUVEL AJOUT : La modale d'erreur --- */}
      <Modal show={showTermsModal} onHide={() => setShowTermsModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <FaExclamationTriangle className="me-2 text-danger" /> Attention
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-4">
          <h4>Vous devez accepter les conditions générales pour continuer.</h4>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="danger" onClick={() => setShowTermsModal(false)}>
            J'ai compris
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RegisterScreen;