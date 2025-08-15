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
    } catch (err) {
      toast.error("Impossible de fermer l'avertissement. Veuillez réessayer.");
    }
  };

  // --- CORRECTION APPLIQUÉE ICI ---
  const handleVerifyProfile = async () => {
    await handleDismiss(); // 1. On ATTEND que l'avertissement soit fermé
    
    navigate('/profile-details'); // 2. On redirige SEULEMENT APRÈS
    
    toast.info('Votre profil est en cours de vérification par nos équipes.');
    
    setTimeout(() => {
      toast.success('Votre Profil a été vérifié avec succès. Soyez beaucoup plus prudent.', {
        autoClose: 10000,
      });
    }, 5 * 60 * 1000);
  };
  // --- FIN DE LA CORRECTION ---

  if (isLoading || !currentWarning) {
    return null;
  }

  return (
    <>
      <Modal
        show={true}
        onHide={() => {}}
        backdrop="static"
        keyboard={false}
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
            {!currentWarning.actions.contactSupport && !currentWarning.actions.verifyProfile && (
                 <Button variant="danger" onClick={handleDismiss}>Fermer</Button>
            )}
          </Stack>
        </Modal.Footer>
      </Modal>

      <SupportContactModal
        show={showSupportModal}
        handleClose={() => setShowSupportModal(false)}
        onContactChosen={handleDismiss}
      />
    </>
  );
};

export default WarningDisplay;