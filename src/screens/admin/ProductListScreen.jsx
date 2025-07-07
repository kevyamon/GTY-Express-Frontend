import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from '../../slices/productsApiSlice';

const ProductListScreen = () => {
  // CORRECTION : On demande tous les produits sans filtre de catégorie
  const { data: products, isLoading, error, refetch } = useGetProductsQuery({ category: 'all' });
  
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
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

  const createProductHandler = async () => {
    if (window.confirm('Un nouveau produit va être créé. Vous serez redirigé pour le modifier. Continuer ?')) {
      try {
        const newProduct = await createProduct().unwrap();
        navigate(`/admin/product/${newProduct._id}/edit`);
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
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Créer un Produit
          </Button>
        </Col>
      </Row>

      {loadingCreate && <p>Création...</p>}
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