import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, InputGroup, Image, Card, Spinner, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaCamera, FaBell } from 'react-icons/fa';
import { useUpdateProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { subscribeUserToPush } from '../components/PushNotificationManager';
import './ProfileDetailsScreen.css';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const SUPER_ADMIN_EMAIL = import.meta.env.VITE_SUPER_ADMIN_EMAIL;

const ProfileDetailsScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);

  const [notificationPermission, setNotificationPermission] = useState('default');

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useUpdateProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setPhone(userInfo.phone || '');
      setProfilePicture(userInfo.profilePicture || '');
    }
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, [userInfo]);

  const getUserRole = () => {
    if (!userInfo) return null;
    if (userInfo.email === SUPER_ADMIN_EMAIL) return 'Super Admin';
    if (userInfo.isAdmin) return 'Admin';
    return 'Client';
  };
  const userRole = getUserRole();

  // --- CORRECTION : La mise à jour de l'état du bouton est conditionnelle ---
  const handleSubscribe = async () => {
    const success = await subscribeUserToPush(dispatch);
    if (success) {
      setNotificationPermission(Notification.permission);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    setLoadingUpload(true);
    try {
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData, config
      );

      const res = await updateProfile({
        _id: userInfo._id,
        profilePicture: data.secure_url,
      }).unwrap();

      dispatch(setCredentials(res));
      toast.success('Photo de profil mise à jour !');
      setProfilePicture(data.secure_url);

    } catch (error) {
      toast.error("Le téléversement de l'image a échoué");
    } finally {
      setLoadingUpload(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      const res = await updateProfile({
        _id: userInfo._id, name, email, phone, password,
      }).unwrap();
      dispatch(setCredentials(res));
      toast.success('Informations mises à jour avec succès');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Row className="justify-content-md-center">
      <Col md={8} lg={6}>
        <Card className="profile-details-card">
          <Card.Body>
            <h2 className="text-center mb-4">Informations Personnelles</h2>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='profilePicture' className='my-3 text-center'>
                <div className="profile-picture-container">
                  <Image 
                    src={profilePicture || 'https://i.imgur.com/Suf6O8w.png'}
                    alt={name}
                    roundedCircle 
                    className="profile-picture-img"
                  />
                  {userRole && <Badge bg="danger" className="role-badge">{userRole}</Badge>}
                  <label htmlFor="image-upload" className="profile-picture-upload-label">
                    <FaCamera />
                  </label>
                  <Form.Control 
                    id="image-upload"
                    onChange={uploadFileHandler} 
                    type='file' 
                    hidden
                  />
                  {loadingUpload && <Spinner animation="border" className="profile-picture-spinner" />}
                </div>
              </Form.Group>

              <Form.Group className='my-3' controlId='name'>
                <Form.Label>Nom</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaUser /></InputGroup.Text>
                  <Form.Control type='text' placeholder='Entrez votre nom' value={name} onChange={(e) => setName(e.target.value)} />
                </InputGroup>
              </Form.Group>

              <Form.Group className='my-3' controlId='email'>
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                  <Form.Control type='email' placeholder='Entrez votre email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </InputGroup>
              </Form.Group>

              <Form.Group className='my-3' controlId='phone'>
                <Form.Label>Numéro de téléphone</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaPhone /></InputGroup.Text>
                  <Form.Control type='tel' placeholder='Ajoutez votre numéro' value={phone} onChange={(e) => setPhone(e.target.value)} />
                </InputGroup>
              </Form.Group>
              
              <hr className="my-4" />
              <h5 className="mb-3">Notifications</h5>
              <div className="notification-control">
                <p>Recevez des alertes sur vos commandes et les promotions.</p>
                <Button 
                  variant={notificationPermission === 'granted' ? 'success' : 'primary'}
                  onClick={handleSubscribe}
                  disabled={notificationPermission !== 'default'}
                >
                  <FaBell className="me-2" />
                  {notificationPermission === 'granted' && 'Activé'}
                  {notificationPermission === 'denied' && 'Bloqué'}
                  {notificationPermission === 'default' && 'Activer les notifications'}
                </Button>
                {notificationPermission === 'denied' && (
                    <small className="text-muted d-block mt-2">
                        Vous avez bloqué les notifications. Vous devez les réactiver dans les paramètres de votre navigateur.
                    </small>
                )}
              </div>

              <hr className="my-4" />

              <Form.Group className='my-3' controlId='password'>
                <Form.Label>Nouveau Mot de passe</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaLock /></InputGroup.Text>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Laissez vide pour ne pas changer'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </InputGroup>
              </Form.Group>

              <Form.Group className='my-3' controlId='confirmPassword'>
                <Form.Label>Confirmer le nouveau Mot de passe</Form.Label>
                <InputGroup>
                   <InputGroup.Text><FaLock /></InputGroup.Text>
                  <Form.Control type='password' placeholder='Confirmez le mot de passe' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </InputGroup>
              </Form.Group>

              <div className="d-grid mt-4">
                <Button type='submit' variant='primary' size="lg" disabled={loadingUpdateProfile}>
                  {loadingUpdateProfile ? 'Mise à jour...' : 'Sauvegarder les modifications'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default ProfileDetailsScreen;