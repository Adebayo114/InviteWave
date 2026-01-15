    import { useNavigate } from "react-router-dom";
    import BackButton from "../Components/BackButton";
    import "../Styles/Legal.css";

    const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="container legal-page">
        <BackButton />
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-muted">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="legal-card">
            <h3>1. What we collect</h3>
            <ul>
            <li>Account info (e.g., name/email if you sign in)</li>
            <li>Event details you create (title, date, location, etc.)</li>
            <li>RSVP responses (Yes/Maybe/No)</li>
            <li>Basic technical data (device/browser logs) for security</li>
            </ul>
        </section>

        <section className="legal-card">
            <h3>2. How we use data</h3>
            <ul>
            <li>To create and display events and invite links</li>
            <li>To show RSVP counts and your RSVP status</li>
            <li>To prevent abuse, fraud, and improve performance</li>
            </ul>
        </section>

        <section className="legal-card">
            <h3>3. Sharing</h3>
            <p>
            We do not sell your personal data. We may share data only when required by law
            or to protect InviteWave and users from abuse.
            </p>
        </section>

        <section className="legal-card">
            <h3>4. Data retention</h3>
            <p>
            Events and RSVPs remain available while your event is active, unless you delete them.
            You can request removal of your account data through the Help Center.
            </p>
        </section>

        <section className="legal-card">
            <h3>5. Your choices</h3>
            <ul>
            <li>You can edit or delete your events at any time.</li>
            <li>You can change your RSVP anytime (and remove it).</li>
            <li>You can contact us to request account deletion.</li>
            </ul>
        </section>

        <div className="legal-actions">
            <button className="primary-btn" onClick={() => navigate("/help")}>
            Contact Support
            </button>
            <button className="secondary-btn" onClick={() => navigate("/terms-and-conditions")}>
            Terms & Conditions
            </button>
        </div>
        </div>
    );
    };

    export default PrivacyPolicy;
