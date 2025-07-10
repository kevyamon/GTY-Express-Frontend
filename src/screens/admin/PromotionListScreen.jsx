import { useState } from 'react';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import {
  useGetPromotionsQuery,
  useCreatePromotionMutation,
  useDeletePromotionMutation,
} from '../../slices/promotionApiSlice';
import './PromotionListScreen.css';

const PromotionListScreen = () => {
  const { data: promotions, isLoading, error } = useGetPromotionsQuery();
  const [createPromotion, { isLoading: loadingCreate }] = useCreatePromotionMutation();
  const [deletePromotion, { isLoading: loadingDelete }] = useDeletePromotionMutation();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const deleteHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      try {
        await deletePromotion(id).unwrap();
        toast.success('Promotion supprimée');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('Le nom de la promotion est obligatoire');
      return;
    }
    try {
      await createPromotion({ name, description }).unwrap();
      toast.success('Promotion créée');
      setName('');
      setDescription('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="promo-list-container">
      <Row className='align-items-center'>
        <Col><h1>Gestion des Promotions</h1></Col>
      </Row>

      <Form onSubmit={submitHandler} className="add-promo-form">
        <h5 className="mb-3">Créer une nouvelle promotion</h5>
        <Row>
          <Col md={6}>
            <Form.Group controlId='name'>
              <Form.Control
                type='text'
                placeholder='Nom de la promotion (ex: Soldes d`été)'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='description'>
              <Form.Control
                type='text'
                placeholder='Description (optionnel)'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Button type='submit' variant='primary' className='mt-3' disabled={loadingCreate}>
          {loadingCreate ? 'Création...' : 'Créer'}
        </Button>
      </Form>

      {isLoading || loadingDelete ? <p>Chargement...</p> : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOM</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo._id}>
                <td>{promo._id}</td>
                <td>{promo.name}</td>
                <td>
                  <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(promo._id)}>
                    🗑️
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default PromotionListScreen;