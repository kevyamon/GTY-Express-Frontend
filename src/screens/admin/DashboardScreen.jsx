import React from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUsers, FaBoxOpen, FaClipboardList, FaBullhorn, FaExclamationTriangle } from 'react-icons/fa';
import Message from '../../components/Message';
import { useGetStatsQuery } from '../../slices/adminApiSlice';
import './DashboardScreen.css'; // Nous créerons ce fichier de style juste après

const StatCard = ({ to, icon, title, value, variant }) => {
  return (
    <Col xs={6} md={4} lg={3} className="mb-4">
      <Link to={to} className="text-decoration-none">
        <Card className={`stat-card stat-card-${variant}`}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div className="stat-card-icon">{icon}</div>
              <div className="text-end">
                <div className="stat-card-value">{value}</div>
                <div className="stat-card-title">{title}</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
};

const DashboardScreen = () => {
  const { data: stats, isLoading, error } = useGetStatsQuery();

  if (isLoading) {
    return <div className="text-center"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <Message variant='danger'>{error?.data?.message || error.error}</Message>;
  }

  // S'assure que orderStats existe et a des valeurs par défaut
  const orderStats = stats?.orderStats || {};
  const totalOrders = Object.values(orderStats).reduce((a, b) => a + b, 0);

  return (
    <Container fluid className="dashboard-container">
      <h1 className="mb-4">📊 Tableau de Bord</h1>

      <Row>
        <StatCard
          to="/admin/userlist"
          icon={<FaUsers />}
          title="Total Utilisateurs"
          value={stats?.totalUsers || 0}
          variant="primary"
        />
        <StatCard
          to="/admin/orderlist"
          icon={<FaClipboardList />}
          title="Total Commandes"
          value={totalOrders}
          variant="success"
        />
         <StatCard
          to="/admin/productlist"
          icon={<FaBoxOpen />}
          title="Total Produits"
          value={stats?.totalProducts || 0}
          variant="info"
        />
        <StatCard
          to="/admin/promotionlist"
          icon={<FaBullhorn />}
          title="Promotions Actives"
          value={stats?.totalPromotions || 0}
          variant="warning"
        />
      </Row>

      <h3 className="mt-4 mb-3">Statut des Commandes</h3>
      <Row>
         <StatCard
          to="/admin/orderlist"
          icon={<FaClipboardList />}
          title="En attente"
          value={orderStats['En attente'] || 0}
          variant="secondary"
        />
        <StatCard
          to="/admin/orderlist"
          icon={<FaClipboardList />}
          title="Confirmées"
          value={orderStats['Confirmée'] || 0}
          variant="primary"
        />
        <StatCard
          to="/admin/orderlist"
          icon={<FaClipboardList />}
          title="Expédiées"
          value={orderStats['Expédiée'] || 0}
          variant="info"
        />
         <StatCard
          to="/admin/orderlist"
          icon={<FaClipboardList />}
          title="Livrées"
          value={orderStats['Livrée'] || 0}
          variant="success"
        />
        <StatCard
          to="/admin/orderlist"
          icon={<FaClipboardList />}
          title="Annulées"
          value={orderStats['Annulée'] || 0}
          variant="danger"
        />
         <StatCard
          to="/admin/complaintlist"
          icon={<FaExclamationTriangle />}
          title="Réclamations"
          value={stats?.pendingComplaints || 0}
          variant="danger"
        />
      </Row>
    </Container>
  );
};

export default DashboardScreen;