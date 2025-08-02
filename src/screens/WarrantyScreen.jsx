import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const WarrantyScreen = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h1>Garantie des Produits</h1>
          <p className="lead mt-4">
            Votre satisfaction est notre priorité. Tous nos produits sont couverts par une garantie pour vous assurer une tranquillité d'esprit.
          </p>

          <h5>Garantie Constructeur</h5>
          <p>
            La plupart de nos produits électroniques et électroménagers bénéficient d'une garantie constructeur. La durée et les conditions de cette garantie sont indiquées sur la page de chaque produit. En cas de défaut, nous vous assisterons dans les démarches auprès du fabricant.
          </p>

          <h5>Garantie GTY Express</h5>
          <p>
            Pour les produits non couverts par une garantie constructeur, GTY Express offre une garantie commerciale de 30 jours contre les défauts de fabrication. Si vous rencontrez un problème avec votre produit durant cette période, nous nous engageons à le réparer, le remplacer ou le rembourser.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default WarrantyScreen;