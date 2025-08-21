import { useState } from 'react';
import { Form, Button, Card, Row, Col, InputGroup } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useResetPasswordMutation } from '../slices/usersApiSlice';
import './AuthForm.css'; // On réutilise le même style

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false); // --- AJOUT ---

  const { token } = useParams();
  const navigate = useNavigate();

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // --- DÉBUT DE L'AJOUT : LOGIQUE DE VALIDATION ---
  const validatePassword = (pass) => {
    const hasMinLength = pass.length >= 9;
    const hasNumber = /\d{2,}/.test(pass); // Au moins 2 chiffres
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return { hasMinLength, hasNumber, hasSpecialChar };
  };

  const { hasMinLength, hasNumber, hasSpecialChar } = validatePassword(password);
  const isPasswordValid = hasMinLength && hasNumber && hasSpecialChar;
  // --- FIN DE L'AJOUT ---

  const submitHandler = async (e) => {
    e.preventDefault();

    // --- AJOUT : Vérification de la validité avant soumission ---
    if (!isPasswordValid) {
      toast.error('Votre mot de passe ne respecte pas les critères de sécurité.');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }
    try {
      await resetPassword({ token, password }).unwrap();
      toast.success('Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='auth-container'>
      <Card className='auth-card'>
        <Card.Body>
          <h1>Nouveau mot de passe</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className='my-3' controlId='password'>
              <Form.Label>Nouveau mot de passe</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Entrez votre nouveau mot de passe'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocus(true)} // --- AJOUT ---
                  onBlur={() => setPasswordFocus(false)}  // --- AJOUT ---
                  required
                />
                <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
              
              {/* --- DÉBUT DE L'AJOUT : AFFICHAGE DES EXIGENCES --- */}
              {passwordFocus && (
                  <div className='password-rules mt-2'>
                    <small style={{ color: hasMinLength ? 'green' : 'red' }}>✓ 9 caractères minimum</small><br/>
                    <small style={{ color: hasNumber ? 'green' : 'red' }}>✓ Au moins 2 chiffres</small><br/>
                    <small style={{ color: hasSpecialChar ? 'green' : 'red' }}>✓ 1 caractère spécial (!, @, #...)</small>
                  </div>
                )}
              {/* --- FIN DE L'AJOUT --- */}

            </Form.Group>

            <Form.Group className='my-3' controlId='confirmPassword'>
              <Form.Label>Confirmer le mot de passe</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Confirmez le nouveau mot de passe'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button variant="outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Button type='submit' variant='primary' disabled={isLoading} className='mt-2'>
              {isLoading ? 'Sauvegarde...' : 'Réinitialiser le mot de passe'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ResetPasswordScreen;