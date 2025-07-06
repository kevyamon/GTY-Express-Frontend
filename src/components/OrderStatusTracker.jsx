import React from 'react';
import './OrderStatusTracker.css';

const OrderStatusTracker = ({ order }) => {
  // La liste des statuts possibles dans l'ordre chronologique
  const statuses = ['En attente', 'Confirmée', 'Expédiée', 'Livrée'];
  
  // On trouve l'index du statut actuel de la commande
  const currentStatusIndex = statuses.indexOf(order.status);

  // Une fonction simple pour formater joliment la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStepDate = (status) => {
    if (status === 'En attente') {
      return formatDate(order.createdAt);
    }
    if (status === 'Livrée') {
      return formatDate(order.deliveredAt);
    }
    // Pour les statuts intermédiaires, on peut afficher la date de dernière mise à jour
    return formatDate(order.updatedAt);
  };

  return (
    <div className="tracker-container">
      <h4>État de la commande</h4>
      {statuses.map((status, index) => {
        const isCompleted = index <= currentStatusIndex;
        // La commande annulée est un cas spécial
        if (order.status === 'Annulée' && status !== 'En attente') {
          return null; // On n'affiche pas les étapes suivantes si c'est annulé
        }

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

      {/* On ajoute un statut spécial si la commande est annulée */}
      {order.status === 'Annulée' && (
        <div className="step">
            <div className="step-icon-container">
              <div className="step-icon completed" style={{ backgroundColor: '#dc3545' }}>
                X
              </div>
            </div>
            <div className="step-content">
              <h5>Annulée</h5>
              <p>{formatDate(order.updatedAt)}</p>
            </div>
          </div>
      )}
    </div>
  );
};

export default OrderStatusTracker;