    import { useNavigate } from "react-router-dom";
    import BackButton from "../Components/BackButton";
    import "../Styles/Legal.css";

    const TermsAndCondition  = () => {
    const navigate = useNavigate();

    return (
        <div className="container legal-page">
        <BackButton />
        <h1 className="legal-title">Terms & Conditions</h1>
        <p className="legal-muted">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="legal-card">
            <h3>1. About InviteWave</h3>
            <p>
            InviteWave helps users create and share event invitations and allow guests to RSVP.
            By using this website, you agree to these Terms.
            </p>
        </section>

        <section className="legal-card">
            <h3>2. Accounts & Access</h3>
            <ul>
            <li>You’re responsible for activity on your account.</li>
            <li>Do not impersonate others or use false details to harm someone.</li>
            <li>We can suspend accounts that violate these Terms.</li>
            </ul>
        </section>

        <section className="legal-card">
            <h3>3. Events & Content</h3>
            <ul>
            <li>You own the content you post, but you must have the right to post it.</li>
            <li>No illegal events, scams, hate content, harassment, or harmful content.</li>
            <li>We may remove content that violates these Terms or applicable laws.</li>
            </ul>
        </section>

        <section className="legal-card">
            <h3>4. RSVPs & Accuracy</h3>
            <p>
            RSVP counts may not reflect real attendance. Hosts should verify details with guests.
            InviteWave is not responsible for disputes between hosts and attendees.
            </p>
        </section>

        <section className="legal-card">
            <h3>5. Disclaimers</h3>
            <p>
            InviteWave is provided “as is.” We do not guarantee uninterrupted service,
            and we are not liable for losses resulting from using the site.
            </p>
        </section>

        <section className="legal-card">
            <h3>6. Changes</h3>
            <p>
            We may update these Terms from time to time. Continued use means you accept the updated Terms.
            </p>
        </section>

        <div className="legal-actions">
            <button className="primary-btn" onClick={() => navigate("/help")}>
            Visit Help Center
            </button>
            <button className="secondary-btn" onClick={() => navigate("/privacy")}>
            Privacy Policy
            </button>
        </div>
        </div>
    );
    };

    export default TermsAndCondition;
