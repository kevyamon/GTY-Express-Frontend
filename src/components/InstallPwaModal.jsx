import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaGooglePlay, FaApple, FaShareSquare, FaPlusSquare, FaUndo, FaDownload } from 'react-icons/fa';
import './InstallPwaModal.css';

const androidSteps = [
  {
    icon: '⋮',
    text: 'Appuyez sur le bouton du menu (les 3 points en haut à droite).',
  },
  {
    icon: <FaDownload />,
    text: "Sélectionnez 'Installer l'application' ou 'Ajouter à l'écran d'accueil'.",
  },
  {
    icon: '✅',
    text: "Confirmez l'ajout. L'application apparaîtra avec vos autres applis !",
  },
];

const iosSteps = [
  {
    icon: <FaShareSquare />,
    text: "Appuyez sur l'icône de Partage dans la barre d'outils de Safari.",
  },
  {
    icon: <FaPlusSquare />,
    text: "Faites défiler et sélectionnez 'Sur l'écran d'accueil'.",
  },
  {
    icon: '✅',
    text: "Confirmez l'ajout. L'icône apparaîtra sur votre écran d'accueil.",
  },
];

const InstallPwaModal = ({ show, handleClose }) => {
  const [view, setView] = useState('selection');
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [showEndButtons, setShowEndButtons] = useState(false);

  useEffect(() => {
    if (!show) {
      setTimeout(() => {
        setView('selection');
        setVisibleSteps([]);
        setShowEndButtons(false);
      }, 300);
    }
  }, [show]);

  const startInstructions = (os) => {
    setView(os);
    setVisibleSteps([]);
    setShowEndButtons(false);
    const steps = os === 'android' ? androidSteps : iosSteps;

    // --- CORRECTION DU DÉLAI ---
    const initialDelay = 100; 
    const interval = 2000;   // <-- Changé de 2500 à 2000 (2 secondes)

    steps.forEach((step, index) => {
      const delay = initialDelay + (index * interval);
      setTimeout(() => {
        setVisibleSteps((prev) => [...prev, step]);
        if (index === steps.length - 1) {
          setTimeout(() => setShowEndButtons(true), 1000);
        }
      }, delay);
    });
  };

  const restartInstructions = () => {
    const os = view;
    setVisibleSteps([]);
    setShowEndButtons(false);
    const steps = os === 'android' ? androidSteps : iosSteps;
    
    const initialDelay = 100;
    const interval = 1500;

     steps.forEach((step, index) => {
      const delay = initialDelay + (index * interval);
      setTimeout(() => {
        setVisibleSteps((prev) => [...prev, step]);
        if (index === steps.length - 1) {
          setTimeout(() => setShowEndButtons(true), 1000);
        }
      }, delay);
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered dialogClassName="install-modal">
      <Modal.Header closeButton>
        <Modal.Title>Installer GTY Express</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {view === 'selection' && (
          <div className="selection-view">
            <p>Choisissez votre appareil pour voir les instructions :</p>
            <div className="os-buttons">
              <Button className="os-button android" onClick={() => startInstructions('android')}>
                <FaGooglePlay /> Android
              </Button>
              <Button className="os-button ios" onClick={() => startInstructions('ios')}>
                <FaApple /> iPhone
              </Button>
            </div>
          </div>
        )}

        {(view === 'android' || view === 'ios') && (
          <div className="instructions-view">
            <Button variant="link" className="back-button" onClick={() => setView('selection')}>
              &larr; Retour
            </Button>
            <div className="steps-container">
              {(view === 'android' ? androidSteps : iosSteps).map((step, index) => (
                <div
                  key={index}
                  className={`step-item ${visibleSteps.length > index ? 'visible' : ''}`}
                >
                  <div className="step-icon">{step.icon}</div>
                  <div className="step-text">{step.text}</div>
                </div>
              ))}
            </div>
            
            {showEndButtons && (
                 <div className="end-buttons">
                    <Button variant='secondary' onClick={restartInstructions}>
                        <FaUndo className="me-2"/>Revoir
                    </Button>
                    <Button variant='primary' onClick={handleClose}>
                        OK, compris !
                    </Button>
                 </div>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default InstallPwaModal;