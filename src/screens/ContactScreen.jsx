import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './StaticPage.css'; // On importe le style

const ContactScreen = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Merci pour votre message ! (Fonctionnalité en cours de développement)");
  };

  return (
    <div className="static-page-container">
      <Container>
        <Row className="justify-content-md-center">
          <Col md={10}>
            <h1>Nous Contacter</h1>
            <p className="mt-4">
              Une question ? Une suggestion ? N'hésitez pas à nous contacter via le formulaire ci-dessous ou directement par email. Notre équipe vous répondra dans les meilleurs délais.
            </p>
            <p><strong>Email :</strong> contact@gty-express.com</p>

            <Form onSubmit={handleSubmit} className="mt-4">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="contactFormName">
                    <Form.Label>Votre nom</Form.Label>
                    <Form.Control type="text" placeholder="Entrez votre nom" required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="contactFormEmail">
                    <Form.Label>Votre email</Form.Label>
                    <Form.Control type="email" placeholder="Entrez votre email" required />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3" controlId="contactFormSubject">
                <Form.Label>Sujet</Form.Label>
                <Form.Control type="text" placeholder="Sujet de votre message" required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="contactFormMessage">
                <Form.Label>Message</Form.Label>
                <Form.Control as="textarea" rows={5} placeholder="Votre message" required />
              </Form.Group>
              <Button variant="primary" type="submit">
                Envoyer le message
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ContactScreen;