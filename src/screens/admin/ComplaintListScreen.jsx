import React, { useState } from 'react';
import { Table, Button, Badge, Collapse, Card, Image, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import Message from '../../components/Message';
import { useGetComplaintsQuery, useDeleteComplaintMutation, useDeleteAllComplaintsMutation } from '../../slices/adminApiSlice';
import { FaTrash } from 'react-icons/fa';

const ComplaintListScreen = () => {
  const { data: complaints, isLoading, error } = useGetComplaintsQuery();
  const [deleteComplaint, { isLoading: isDeleting }] = useDeleteComplaintMutation();
  const [deleteAllComplaints, { isLoading: isDeletingAll }] = useDeleteAllComplaintsMutation();
  const [openComplaintId, setOpenComplaintId] = useState(null);

  const toggleComplaint = (id) => {
    setOpenComplaintId(openComplaintId === id ? null : id);
  };

  const handleDelete = async (id) => {
    try {
        await deleteComplaint(id).unwrap();
        toast.info('Réclamation supprimée');
    } catch (err) {
        toast.error(err?.data?.message || err.error);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer TOUTES les réclamations ?')) {
        try {
            await deleteAllComplaints().unwrap();
            toast.info('Toutes les réclamations ont été supprimées');
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }
  };

  return (
    <div>
      <Row className="align-items-center">
        <Col><h1>Gestion des Réclamations</h1></Col>
        <Col xs="auto">
            {complaints && complaints.length > 0 && (
                <Button variant="danger" onClick={handleDeleteAll} disabled={isDeletingAll}>
                    Tout Supprimer
                </Button>
            )}
        </Col>
      </Row>

      {isLoading ? ( <p>Chargement...</p> ) : 
       error ? ( <Message variant='danger'>{error?.data?.message || error.error}</Message> ) : (
        <Table striped bordered hover responsive className='table-sm mt-4'>
          <thead>
            <tr>
              <th>DATE</th>
              <th>UTILISATEUR</th>
              <th>STATUT</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <React.Fragment key={complaint._id}>
                <tr>
                  <td>{new Date(complaint.createdAt).toLocaleString('fr-FR')}</td>
                  <td>{complaint.user.name} ({complaint.user.email})</td>
                  <td>
                    <Badge bg={complaint.status === 'pending' ? 'warning' : 'success'}>
                      {complaint.status === 'pending' ? 'En attente' : 'Résolu'}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="secondary" className='btn-sm' onClick={() => toggleComplaint(complaint._id)}>
                      {openComplaintId === complaint._id ? 'Fermer' : 'Voir'}
                    </Button>
                    <Button variant="outline-danger" className='btn-sm ms-2' onClick={() => handleDelete(complaint._id)} disabled={isDeleting}>
                        <FaTrash />
                    </Button>
                  </td>
                </tr>
                <Collapse in={openComplaintId === complaint._id}>
                  <tr>
                    <td colSpan="5">
                      <Card>
                        <Card.Body>
                          <Card.Text><strong>Message :</strong></Card.Text>
                          <p style={{ whiteSpace: 'pre-wrap' }}>{complaint.text}</p>
                          {complaint.images.length > 0 && (
                            <>
                              <hr />
                              <Card.Text><strong>Pièces jointes :</strong></Card.Text>
                              <Row>
                                {complaint.images.map((img, index) => (
                                  <Col key={index} xs={4} md={2} className="mb-2">
                                    <a href={img} target="_blank" rel="noopener noreferrer">
                                      <Image src={img} thumbnail />
                                    </a>
                                  </Col>
                                ))}
                              </Row>
                            </>
                          )}
                        </Card.Body>
                      </Card>
                    </td>
                  </tr>
                </Collapse>
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ComplaintListScreen;