    import { useEffect, useMemo, useState } from "react";
    import { useLocation, useNavigate } from "react-router-dom";
    import { fetchEvents } from "../services/eventsService";
    import { Lock } from "lucide-react";
    import "../Styles/noevents.css"; // ✅ use your explore css (create if you don't have)

    const Explore = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // read ?search= from URL
    const searchQuery = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return (params.get("search") || "").trim();
    }, [location.search]);

    // read ?category= from URL
    const categoryQuery = useMemo(() => {
        const params = new URLSearchParams(location.search);
        return (params.get("category") || "").trim().toLowerCase();
    }, [location.search]);

    // fetch all events from Firestore
    useEffect(() => {
        const load = async () => {
        try {
            setLoading(true);
            const data = await fetchEvents();
            setEvents(data);
        } catch (err) {
            console.error(err);
            setEvents([]);
        } finally {
            setLoading(false);
        }
        };

        load();
    }, []);

    // filter locally based on search + category
    const filteredEvents = useMemo(() => {
        let list = [...events];

        if (categoryQuery) {
        list = list.filter(
            (e) => (e.category || "").toLowerCase() === categoryQuery
        );
        }

        if (searchQuery) {
        const q = searchQuery.toLowerCase();
        list = list.filter((e) => {
            const title = (e.title || "").toLowerCase();
            const category = (e.category || "").toLowerCase();
            const loc = (e.location || "").toLowerCase();
            return title.includes(q) || category.includes(q) || loc.includes(q);
        });
        }

        return list;
    }, [events, searchQuery, categoryQuery]);

    if (loading) {
        return (
        <div className="container explore-page">
            <h2 className="page-title">Explore Events</h2>
            <p className="muted">Loading events...</p>
        </div>
        );
    }

    return (
        <div className="container explore-page">
        <div className="explore-header">
            <h2 className="page-title">Explore Events</h2>

            {categoryQuery && (
            <p className="muted">
                Category: <strong>{categoryQuery}</strong>
            </p>
            )}

            {searchQuery && (
            <p className="muted">
                Showing results for: <strong>{searchQuery}</strong>
            </p>
            )}
        </div>

        {!filteredEvents.length ? (
            <div className="empty-state">
            <p>No events found.</p>
            <button className="primary-btn" onClick={() => navigate("/create-event")}>
                Create an Event
            </button>
            </div>
        ) : (
            <div className="explore-grid">
            {filteredEvents.map((event) => (
                <div
                key={event.id}
                className="event-card"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/event/${event.id}`)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") navigate(`/event/${event.id}`);
                }}
                >
                <div className="event-card-top">
                    <h4 className="event-title">{event.title}</h4>

                    {/* Pills row (category + lock badge) */}
                    <div className="pill-row">
                    {event.category && (
                        <span className={`pill ${event.category}`}>{event.category}</span>
                    )}

                    {event.isPrivate && (
                        <span
                        className="pill pill-private"
                        title="Private event — invite code required"
                        aria-label="Private event — invite code required"
                        >
                        <Lock size={14} />
                        <span>Private</span>
                        </span>
                    )}
                    </div>
                </div>

                <p className="muted">📍 {event.location}</p>

                <p className="muted">
                    📅 {event.date || "TBD"} · ⏰ {event.time || "TBD"}
                    {event.endTime ? ` – ${event.endTime}` : ""}
                </p>

                <button
                    className="secondary-btn"
                    onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/event/${event.id}`);
                    }}
                >
                    View Details →
                </button>
                </div>
            ))}
            </div>
        )}
        </div>
    );
    };

    export default Explore;
