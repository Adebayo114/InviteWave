    import { Link } from "react-router-dom";
    import "../Styles/ExploreCTA.css";

    const ExploreCTA = () => {
    return (
        <section className="explore-cta">
        <h3>Ready to host your next event?</h3>
        <p>Create an event in minutes and share instantly.</p>

        <Link to="/create-event" className="cta-btn">
            Create Event
        </Link>
        </section>
    );
    };

    export default ExploreCTA;
