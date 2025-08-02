import { Container, Row, Col } from 'react-bootstrap';
import { FaShippingFast, FaShieldAlt, FaHeadset, FaCheckCircle, FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css'; // Importation du nouveau fichier CSS

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer-container">
      <Container>
        {/* Section des services */}
        <Row className="service-blurbs">
          <Col md={3} sm={6} className="mb-4 mb-md-0">
            <div className="service-blurb">
              <FaShippingFast />
              <h5>Livraison Express</h5>
              <p>Faites-vous livrer vos produits rapidement où que vous soyez en Côte d'ivoire.</p>
            </div>
          </Col>
          <Col md={3} sm={6} className="mb-4 mb-md-0">
            <div className="service-blurb">
              <FaShieldAlt />
              <h5>Paiement Sécurisé</h5>
              <p>Payez en toute confiance grâce à nos options de paiement sécurisées.</p>
            </div>
          </Col>
          <Col md={3} sm={6} className="mb-4 mb-md-0">
            <div className="service-blurb">
              <FaHeadset />
              <h5>Service Client</h5>
              <p>Notre équipe est à votre écoute pour répondre à toutes vos questions.</p>
            </div>
          </Col>
          <Col md={3} sm={6} className="mb-4 mb-md-0">
            <div className="service-blurb">
              <FaCheckCircle />
              <h5>Garantie Qualité</h5>
              <p>Nous sélectionnons les meilleurs produits pour vous satisfaire.</p>
            </div>
          </Col>
        </Row>

        {/* Section des liens */}
        <Row className="footer-links">
          <Col md={3} sm={6}>
            <h5>Nos Services</h5>
            <ul>
              <li><a href="#!">Livraison</a></li>
              <li><a href="#!">Garantie</a></li>
              <li><a href="#!">Cliquez et retirez</a></li>
              <li><a href="#!">Retour ou Échange</a></li>
            </ul>
          </Col>
          <Col md={3} sm={6}>
            <h5>GTY Express</h5>
            <ul>
              <li><a href="#!">Qui sommes nous ?</a></li>
              <li><a href="#!">Nos promotions</a></li>
              <li><a href="#!">Nos magasins</a></li>
            </ul>
          </Col>
          <Col md={3} sm={6}>
            <h5>Utilisateur</h5>
            <ul>
              <li><a href="#!">Mon compte</a></li>
              <li><a href="#!">Mentions légales</a></li>
              <li><a href="#!">CGU / CGV</a></li>
              <li><a href="#!">Données personnelles</a></li>
            </ul>
          </Col>
          <Col md={3} sm={6}>
            <h5>Aide & Contact</h5>
            <ul>
              <li><a href="#!">Comment acheter en ligne ?</a></li>
              <li><a href="#!">FAQ</a></li>
              <li><a href="#!">Nous contacter</a></li>
            </ul>
          </Col>
        </Row>

        {/* Section du bas */}
        <Row className="footer-bottom align-items-center">
          <Col md={8}>
            <h5>GTY Express</h5>
            <p>Le meilleur pour vous, livré rapidement. De la sélection des produits à la logistique, nous nous occupons de tout pour vous offrir une expérience d'achat imbattable.</p>
          </Col>
          <Col md={4} className="text-md-end text-center">
            <h5>Nous suivre</h5>
            <div className="social-icons">
              <a href="#!" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#!" aria-label="YouTube"><FaYoutube /></a>
              <a href="#!" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
          </Col>
        </Row>

        {/* Copyright */}
        <Row>
          <Col>
            <p className="copyright">GTY Express &copy; {currentYear}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;