import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaShippingFast, FaShieldAlt, FaHeadset, FaCheckCircle, FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';

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
              <li><Link to="/delivery">Livraison</Link></li>
              <li><Link to="/warranty">Garantie</Link></li>
              <li><Link to="/click-and-collect">Cliquez et retirez</Link></li>
              <li><Link to="/returns">Retour ou Échange</Link></li>
            </ul>
          </Col>
          <Col md={3} sm={6}>
            <h5>GTY Express</h5>
            <ul>
              <li><Link to="/about">Qui sommes nous ?</Link></li>
              <li><Link to="/promotions">Nos promotions</Link></li>
              <li><Link to="/stores">Nos magasins</Link></li>
            </ul>
          </Col>
          <Col md={3} sm={6}>
            <h5>Utilisateur</h5>
            <ul>
              <li><Link to="/profile-details">Mon compte</Link></li>
              <li><Link to="/legal-notice">Mentions légales</Link></li>
              <li><Link to="/terms">CGU / CGV</Link></li>
              <li><Link to="/privacy">Données personnelles</Link></li>
            </ul>
          </Col>
          <Col md={3} sm={6}>
            <h5>Aide & Contact</h5>
            <ul>
              <li><Link to="/how-to-buy">Comment acheter en ligne ?</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Nous contacter</Link></li>
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