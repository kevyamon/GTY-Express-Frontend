import { Container, Row, Col, Card } from 'react-bootstrap';

const GridTest = () => {
  return (
    <Container className="my-5">
      <h1>Test de la Grille</h1>
      <Row>
        <Col md={6}>
          <Card bg="primary" text="white">
            <Card.Body>Boîte 1</Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card bg="success" text="white">
            <Card.Body>Boîte 2</Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default GridTest;