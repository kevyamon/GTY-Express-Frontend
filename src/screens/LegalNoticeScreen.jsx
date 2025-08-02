import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const LegalNoticeScreen = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h1>Mentions Légales</h1>
          <h5 className="mt-4">Éditeur du site</h5>
          <p>
            GTY Express Inc. <br />
            Adresse : 123 Rue du Commerce, Abidjan, Côte d'Ivoire <br />
            Email : contact@gty-express.com
          </p>

          <h5 className="mt-4">Hébergement</h5>
          <p>
            Ce site est hébergé par OnRender.
          </p>

          <h5 className="mt-4">Propriété Intellectuelle</h5>
          <p>
            L'ensemble de ce site relève de la législation ivoirienne et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default LegalNoticeScreen;