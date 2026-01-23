    import { useEffect, useState } from "react";
    import { useNavigate } from "react-router-dom";
    import { Lock } from "lucide-react";
    import { fetchRecommendedEvents } from "../services/eventsService";
    import { getCategoriesLabel } from "../utils/categoriesLabel";
    import "../Styles/RecommendedEvents.css";

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

    const RecommendedEvents = ({ currentEventId, category }) => {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
        try {
            setLoading(true);
            const data = await fetchRecommendedEvents(category, currentEventId, 6);
            setItems(data);
        } catch (e) {
            console.error(e);
            setItems([]);
        } finally {
            setLoading(false);
        }
        };

        load();
    }, [category, currentEventId]);

    if (loading) {
        return (
        <section className="recommended-events">
            <h3>Recommended</h3>
            <p className="muted" style={{ textAlign: "center" }}>
            Loading recommendations...
            </p>
        </section>
        );
    }

    if (!items.length) return null;

    return (
        <section className="recommended-events">
        <h3>Recommended</h3>

        <div className="recommended-grid">
            {items.map((event) => (
            <div
                key={event.id}
                className="recommended-card"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/event/${event.id}`)}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/event/${event.id}`)}
            >
                <div
                className="recommended-img"
                style={{
                    backgroundImage: `url(${getEventImage(event.category)})`,
                }}
                />

                <div className="recommended-info">
                <div className="recommended-top">
                    <h4 className="recommended-title">{event.title}</h4>

                    <div className="recommended-pills">
                    {event.category && (
                        <span className={`pill ${event.category}`}>
                        {getCategoriesLabel(event.category)}
                        </span>
                    )}

                    {event.isPrivate && (
                        <span className="pill pill-private">
                        <Lock size={14} />
                        <span>Private</span>
                        </span>
                    )}
                    </div>
                </div>

                <p className="muted">📍 {event.location}</p>
                <small className="muted">📅 {event.date || "TBD"}</small>
                </div>
            </div>
            ))}
        </div>
        </section>
    );
    };

    export default RecommendedEvents;
