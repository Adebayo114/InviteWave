    import "../Styles/Footer.css";
    import { Link } from "react-router-dom";
    import image from "../assets/Logo/logo1.png";
    import { Instagram, Twitter, Facebook } from "lucide-react";

    const Footer = () => {
    return (
        <footer className="footer">
        <div className="footer-container">

            {/* Brand */}
            <div className="footer-section">
            <img src={image} alt="InviteWave logo" className="navbar-logo" />
            <p className="footer-desc">
                Create, share, and discover amazing events around you.
            </p>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/explore">Explore</Link></li>
                <li><Link to="/create-event">Create Event</Link></li>
            </ul>
            </div>

            {/* Support */}
            <div className="footer-section">
            <h4>Support</h4>
            <ul>
                <li><Link to="/help">Help Center</Link></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms-and-conditions">Terms & Conditions</Link></li>
            </ul>
            </div>

        </div>

        {/* Bottom */}
        <div className="footer-bottom">
            <p>© {new Date().getFullYear()} InviteWave. All rights reserved.</p>

            <div className="footer-socials">
            <Instagram />
            <Twitter />
            <Facebook />
            </div>
        </div>
        </footer>
    );
    };

    export default Footer;
