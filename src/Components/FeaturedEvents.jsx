    import { Link } from "react-router-dom";
    import { getEvents } from "../utils/data";
    import "../Styles/FeaturedEvents.css";

    const FeaturedEvents = () => {
    // ✅ READ EVENTS INSIDE COMPONENT
    const events = getEvents();

    const featuredEvents = events.filter(event => event.featured);

    // ✅ EMPTY STATE
    if (featuredEvents.length === 0) {
        return (
        <section className="featured-events empty">
            <h3>No featured events yet</h3>
            <p>Be the first to create an event and get featured.</p>

            <Link to="/create-event" className="empty-cta">
            Create an Event
            </Link>
        </section>
        );
    }

    return (
        <section className="featured-events">
        <h3>Featured Events</h3>

        <div className="event-grid">
            {featuredEvents.map(event => (
            <div key={event.id} className="event-card">
                <div className="event-img"></div>

                <div className="event-info">
                <h4>{event.title}</h4>
                <p>{event.location}</p>
                <small>{event.date}</small>
                </div>
            </div>
            ))}
        </div>
        </section>
    );
    };

    export default FeaturedEvents;
