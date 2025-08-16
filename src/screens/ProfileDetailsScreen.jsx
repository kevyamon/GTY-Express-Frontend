import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, InputGroup, Image, Card, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
// --- MODIFICATION : On importe les icônes ---
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaCamera } from 'react-icons/fa';
import { useUpdateProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
// --- MODIFICATION : On importe le nouveau fichier CSS ---
import './ProfileDetailsScreen.css';

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const ProfileDetailsScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);

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
  }, [userInfo]);

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
    // --- MODIFICATION : On utilise une Row pour centrer la carte ---
    <Row className="justify-content-md-center">
      <Col md={8} lg={6}>
        {/* On enveloppe tout dans une Card pour un look plus propre */}
        <Card className="profile-details-card">
          <Card.Body>
            <h2 className="text-center mb-4">Informations Personnelles</h2>
            <Form onSubmit={submitHandler}>
              {/* Zone pour la photo de profil, plus stylisée */}
              <Form.Group controlId='profilePicture' className='my-3 text-center'>
                <div className="profile-picture-container">
                  <Image 
                    src={profilePicture || 'https://i.imgur.com/Suf6O8w.png'}
                    alt={name}
                    roundedCircle 
                    className="profile-picture-img"
                  />
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

              {/* Champ Nom avec icône */}
              <Form.Group className='my-3' controlId='name'>
                <Form.Label>Nom</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaUser /></InputGroup.Text>
                  <Form.Control type='text' placeholder='Entrez votre nom' value={name} onChange={(e) => setName(e.target.value)} />
                </InputGroup>
              </Form.Group>

              {/* Champ Email avec icône */}
              <Form.Group className='my-3' controlId='email'>
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                  <Form.Control type='email' placeholder='Entrez votre email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </InputGroup>
              </Form.Group>

              {/* Champ Téléphone avec icône */}
              <Form.Group className='my-3' controlId='phone'>
                <Form.Label>Numéro de téléphone</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaPhone /></InputGroup.Text>
                  <Form.Control type='tel' placeholder='Ajoutez votre numéro' value={phone} onChange={(e) => setPhone(e.target.value)} />
                </InputGroup>
              </Form.Group>

              <hr className="my-4" />

              {/* Champ Mot de passe avec icône */}
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

              {/* Champ Confirmation avec icône */}
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