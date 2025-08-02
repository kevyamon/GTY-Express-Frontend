import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './StaticPage.css'; // On importe le style

const StoresScreen = () => {
  return (
    <div className="static-page-container">
      <Container>
        <Row className="justify-content-md-center">
          <Col md={10}>
            <h1>Nos Magasins</h1>
            <p className="lead mt-4">
              Retrouvez-nous dans nos points de vente physiques à Abidjan pour découvrir nos produits et bénéficier des conseils de nos experts.
            </p>

            <Row>
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>GTY Express - Cocody</Card.Title>
                    <Card.Text>
                      <strong>Adresse :</strong> Boulevard Latrille, II Plateaux<br/>
                      <strong>Horaires :</strong> Lundi - Samedi : 9h00 - 20h00
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>GTY Express - Marcory</Card.Title>
                    <Card.Text>
                      <strong>Adresse :</strong> Centre Commercial Playce, Bd VGE<br/>
                      <strong>Horaires :</strong> Lundi - Dimanche : 10h00 - 21h00
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default StoresScreen;