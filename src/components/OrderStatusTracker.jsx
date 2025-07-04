import React from 'react';
import './OrderStatusTracker.css';

const OrderStatusTracker = ({ order }) => {
  const statuses = ['En attente', 'Confirmée', 'Expédiée', 'Livrée'];
  const currentStatusIndex = statuses.indexOf(order.status);

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStepDate = (stepName) => {
    if (stepName === 'En attente') return formatDate(order.createdAt);
    if (stepName === 'Livrée') return formatDate(order.deliveredAt);
    // Pour les autres statuts, il faudrait ajouter des champs de date dans le modèle
    // Pour l'instant, on met la date de création
    return formatDate(order.createdAt);
  };

  return (
    <div className="tracker-container">
      <h4>État de la commande</h4>
      {statuses.map((status, index) => {
        const isCompleted = index <= currentStatusIndex;
        return (
          <div className="step" key={status}>
            <div className="step-icon-container">
              <div className={`step-icon ${isCompleted ? 'completed' : ''}`}>
                {isCompleted ? '✓' : '●'}
              </div>
              <div className="step-line"></div>
            </div>
            <div className="step-content">
              <h5>{status}</h5>
              {isCompleted && <p>{getStepDate(status)}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusTracker;