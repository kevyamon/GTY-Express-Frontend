import React, { useState, useEffect } from 'react';
import { Modal, Button, Stack } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetMyWarningsQuery, useDismissWarningMutation } from '../slices/warningsApiSlice';
import SupportContactModal from './SupportContactModal';
import './WarningDisplay.css';

const WarningDisplay = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: warnings, isLoading } = useGetMyWarningsQuery(undefined, {
    skip: !userInfo,
  });

  const [dismissWarning] = useDismissWarningMutation();
  const navigate = useNavigate();

  const [currentWarning, setCurrentWarning] = useState(null);
  const [showSupportModal, setShowSupportModal] = useState(false);

  useEffect(() => {
    // Affiche le premier avertissement actif de la liste (le plus récent)
    if (warnings && warnings.length > 0) {
      setCurrentWarning(warnings[0]);
    } else {
      setCurrentWarning(null);
    }
  }, [warnings]);

  const handleDismiss = async () => {
    if (!currentWarning) return;
    try {
      await dismissWarning(currentWarning._id).unwrap();
      // Le RTK Query rafraîchira automatiquement la liste,
      // et le useEffect mettra à jour le `currentWarning` avec le suivant.
    } catch (err) {
      toast.error("Impossible de fermer l'avertissement. Veuillez réessayer.");
    }
  };

  const handleVerifyProfile = () => {
    handleDismiss(); // Ferme l'avertissement
    navigate('/profile-details'); // Redirige
    toast.info('Votre profil est en cours de vérification par nos équipes.');
    
    // Simule la vérification et envoie un toast après 5 minutes
    setTimeout(() => {
      toast.success('Votre Profil a été vérifié avec succès. Soyez beaucoup plus prudent.', {
        autoClose: 10000, // Le toast reste 10 secondes
      });
    }, 5 * 60 * 1000); // 5 minutes
  };

  if (isLoading || !currentWarning) {
    return null; // N'affiche rien si pas d'avertissement
  }

  return (
    <>
      <Modal
        show={true} // Toujours visible s'il y a un currentWarning
        onHide={() => {}} // Ne se ferme pas en cliquant à côté
        backdrop="static" // Empêche la fermeture au clic
        keyboard={false} // Empêche la fermeture avec la touche Echap
        centered
        dialogClassName="warning-modal"
      >
        <Modal.Header>
          <Modal.Title className="warning-title">
            <span className="warning-icon">⚠️</span> Attention {userInfo.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="warning-message">{currentWarning.message}</p>
          <p className="warning-subtext">
            Cette notification restera visible jusqu'à ce que vous choisissiez l'une des actions ci-dessous.
          </p>
        </Modal.Body>
        <Modal.Footer className="warning-footer">
          <Stack direction="horizontal" gap={3} className="justify-content-center w-100">
            {currentWarning.actions.contactSupport && (
              <Button variant="light" onClick={() => setShowSupportModal(true)}>
                Contacter le support
              </Button>
            )}
            {currentWarning.actions.verifyProfile && (
              <Button variant="primary" onClick={handleVerifyProfile}>
                Vérifier mon Profil
              </Button>
            )}
            {/* Le bouton fermer est un fallback au cas où aucune action n'est cochée */}
            {!currentWarning.actions.contactSupport && !currentWarning.actions.verifyProfile && (
                 <Button variant="danger" onClick={handleDismiss}>Fermer</Button>
            )}
          </Stack>
        </Modal.Footer>
      </Modal>

      <SupportContactModal
        show={showSupportModal}
        handleClose={() => setShowSupportModal(false)}
        onContactChosen={handleDismiss} // Ferme l'avertissement principal quand un contact est choisi
      />
    </>
  );
};

export default WarningDisplay;