import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, InputGroup, Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useUpdateProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

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

      // L'upload a réussi, on met à jour le profil immédiatement avec la nouvelle image
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
      toast.success('Profil mis à jour avec succès');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <Row className="justify-content-md-center">
      <Col md={6}>
        <h2>Informations Personnelles</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='profilePicture' className='my-3 text-center'>
            <Image 
              src={profilePicture || 'https://i.imgur.com/Suf6O8w.png'} // Affiche une image par défaut
              alt={name}
              roundedCircle 
              style={{ width: '120px', height: '120px', objectFit: 'cover', border: '3px solid #eee' }} 
            />
            <Form.Control 
              label='Choisir une nouvelle photo' 
              onChange={uploadFileHandler} 
              type='file' 
              className="mt-2" 
            />
            {loadingUpload && <p>Téléversement...</p>}
          </Form.Group>

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

          <Button type='submit' variant='primary' disabled={loadingUpdateProfile}>
            Mettre à jour les informations
          </Button>
          {loadingUpdateProfile && <p>Mise à jour...</p>}
        </Form>
      </Col>
    </Row>
  );
};

export default ProfileDetailsScreen;