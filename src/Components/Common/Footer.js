import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import "../../Styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Left: Logo and About */}
        <div className="footer-section about">
          <h2>WorkaFlow</h2>
          <p>Connecting professionals with great opportunities.</p>
        </div>

        {/* Center: Quick Links */}
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/jobs">Find Jobs</Link></li>
            <li><Link to="/post-job">Post a Job</Link></li>
            <li><Link to="/categories">Categories</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Right: Social Media */}
        <div className="footer-section social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaLinkedin /></a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <p>© 2025 WorkaFlow. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
