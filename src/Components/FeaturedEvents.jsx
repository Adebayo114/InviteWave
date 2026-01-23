    import { useEffect, useState } from "react";
    import { useNavigate } from "react-router-dom";
    import { fetchFeaturedEvents } from "../services/eventsService";
    import "../Styles/FeaturedEvents.css";

    const FeaturedEvents = () => {
    const navigate = useNavigate();

    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const categoryImages = {
    birthday:
        "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=60",
    wedding:
        "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=1200&q=60",
    graduation:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=60",
    party:
        "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1200&q=60",
    "baby-shower":
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=60",
    corporate:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=60",
    concert:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=60",
    sports:
        "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=60",
    default:
        "https://images.unsplash.com/photo-1515165562835-c4c6b4b1d36a?auto=format&fit=crop&w=1200&q=60",
    };

    const getEventImage = (category) => {
    const key = (category || "").toLowerCase();
    return categoryImages[key] || categoryImages.default;
    };

    useEffect(() => {
        const load = async () => {
        try {
            setLoading(true);
            const data = await fetchFeaturedEvents();
            setFeaturedEvents(data);
        } catch (err) {
            console.error(err);
            setFeaturedEvents([]);
        } finally {
            setLoading(false);
        }
        };

        load();
    }, []);

    // Loading state
    if (loading) {
        return (
        <section className="featured-events">
            <h3>Featured Events</h3>
            <p style={{ textAlign: "center" }} className="muted">
            Loading featured events...
            </p>
        </section>
        );
    }

    // Empty state
    if (featuredEvents.length === 0) {
        return (
        <section className="featured-events empty">
            <h3>No featured events yet</h3>
            <p>Featured events will show here once an event is marked as featured.</p>

            <button className="empty-cta" onClick={() => navigate("/create-event")}>
            Create an Event
            </button>
        </section>
        );
    }

    return (
        <section className="featured-events">
        <h3>Featured Events</h3>

        <div className="event-grid">
            {featuredEvents.map((event) => (
            <div
                key={event.id}
                className="event-card"
                onClick={() => navigate(`/event/${event.id}`)}
                role="button"
                tabIndex={0}
            >
                <div
                    className="event-img"
                    style={{
                        backgroundImage: `url(${getEventImage(event.category)})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                    />


                <div className="event-info">
                <h4>{event.title}</h4>
                <p>📍 {event.location}</p>
                <small>📅 {event.date || "TBD"}</small>
                </div>
            </div>
            ))}
        </div>
        </section>
    );
    };

    export default FeaturedEvents;
