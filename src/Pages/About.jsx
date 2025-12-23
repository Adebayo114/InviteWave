    import { useNavigate } from "react-router-dom";
    import BackButton from "../Components/BackButton";
    import "../Styles/About.css";

    const About = () => {
    const navigate = useNavigate();

    return (
        <div className="container about-page">
        <BackButton />

        <h1 className="about-title">About InviteWave</h1>

        <p className="about-intro">
            InviteWave is a simple event platform that helps you create, manage,
            and share events effortlessly.
        </p>

        <section className="about-section">
            <h3>What InviteWave Does</h3>
            <p>
            InviteWave lets you create events, add locations, set start and end
            times, share invite links, and track guest responses — all in one place.
            </p>
        </section>

        <section className="about-section">
            <h3>Who It’s For</h3>
            <ul>
            <li>🎉 Birthday & party hosts</li>
            <li>💍 Wedding & engagement planners</li>
            <li>🎓 Graduation celebrations</li>
            <li>🏢 Corporate & community events</li>
            </ul>
        </section>

        <section className="about-section">
            <h3>How It Works</h3>
            <ol>
            <li>Create your event</li>
            <li>Share your invite link</li>
            <li>Guests respond with RSVP</li>
            </ol>
        </section>

        <section className="about-section highlight">
            <h3>Why InviteWave?</h3>
            <p>
            No stress. No confusion. Just clean event planning and simple invites.
            </p>
        </section>

        <div className="about-actions">
            <button className="primary-btn" onClick={() => navigate("/create-event")}>
            Create an Event
            </button>

            <button className="secondary-btn" onClick={() => navigate("/explore")}>
            Explore Events
            </button>
        </div>
        </div>
    );
    };

    export default About;
