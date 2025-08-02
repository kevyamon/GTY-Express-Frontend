import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from '../../slices/productsApiSlice';

const ProductListScreen = () => {
  const { data: products, isLoading, error } = useGetProductsQuery({ category: 'all' });
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();
  const navigate = useNavigate();

  const deleteHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await deleteProduct(id);
        toast.success('Produit supprimé');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Produits</h1>
        </Col>
        <Col className='text-end'>
          {/* CORRECTION DU BOUTON */}
          <Button className='my-3' onClick={() => navigate('/admin/product/add')}>
            <i className='fas fa-plus'></i> Créer un Produit
          </Button>
        </Col>
      </Row>

      {loadingDelete && <p>Suppression...</p>}
      {isLoading ? (
        <p>Chargement...</p>
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.message || error.error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NOM</th>
              <th>PRIX</th>
              <th>CATÉGORIE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id.substring(0, 10)}...</td>
                <td>{product.name}</td>
                <td>{product.price} FCFA</td>
                <td>{product.isSupermarket ? 'Supermarché' : 'Normal'}</td>
                <td>
                  <LinkContainer to={`/admin/product/${product._id}/edit`}>
                    <Button variant='light' className='btn-sm mx-2'>
                      ✏️
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='danger'
                    className='btn-sm'
                    onClick={() => deleteHandler(product._id)}
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default ProductListScreen;