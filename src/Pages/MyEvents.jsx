    import { useNavigate } from "react-router-dom";
    import { useEffect, useState } from "react";

    import BackButton from "../Components/BackButton";
    import { useAuth } from "../context/useAuth";
    import { fetchMyEvents } from "../services/eventsService";

    import "../Styles/MyEvents.css";

    const MyEvents = () => {
    const navigate = useNavigate();
    const { user, authLoading } = useAuth();

    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    // helper: read your RSVP (demo on this device)
    const getMyRsvp = (eventId) => {
        const saved = localStorage.getItem(`rsvp-event-${eventId}`);
        if (!saved) return null;

        try {
        const parsed = JSON.parse(saved);
        return parsed?.response || null;
        } catch {
        return null;
        }
    };

    useEffect(() => {
        const load = async () => {
        try {
            setLoading(true);

            // If somehow this page is reached without login
            if (!user?.uid) {
            setMyEvents([]);
            return;
            }

            const data = await fetchMyEvents(user.uid); // ✅ Firebase uid
            setMyEvents(data);
        } catch (err) {
            console.error(err);
            setMyEvents([]);
        } finally {
            setLoading(false);
        }
        };

        // wait until auth is resolved so it doesn't flash "Please login"
        if (!authLoading) load();
    }, [user?.uid, authLoading]);

    if (authLoading || loading) {
        return (
        <div className="container my-events">
            <BackButton />
            <h2 className="page-title">My Events</h2>
            <p className="muted">Loading your events...</p>
        </div>
        );
    }

    if (!user?.uid) {
        return (
        <div className="container my-events">
            <BackButton />
            <h2 className="page-title">My Events</h2>

            <div className="empty-state">
            <p>Please login to see your events.</p>
            <button className="primary-btn" onClick={() => navigate("/login")}>
                Go to Login
            </button>
            </div>
        </div>
        );
    }

    if (myEvents.length === 0) {
        return (
        <div className="container my-events">
            <BackButton />
            <h2 className="page-title">My Events</h2>

            <div className="empty-state">
            <p>You haven’t created any events yet.</p>
            <button className="primary-btn" onClick={() => navigate("/create-event")}>
                Create your first event
            </button>
            </div>

            <p className="note">
            Note: RSVP totals are demo-only right now (this device). Firebase later will
            make counts global.
            </p>
        </div>
        );
    }

    return (
        <div className="container my-events">
        <BackButton />
        <h2 className="page-title">My Events</h2>

        <div className="my-events-grid">
            {myEvents.map((event) => {
            const myRsvp = getMyRsvp(event.id);

            return (
                <div
                key={event.id}
                className="my-event-card"
                onClick={() => navigate(`/event/${event.id}`)}
                role="button"
                tabIndex={0}
                >
                <div className="card-top">
                    <h4 className="event-title">{event.title}</h4>
                    <span className={`pill ${event.category}`}>{event.category}</span>
                </div>

                <p className="muted">📍 {event.location}</p>

                <p className="muted">
                    📅 {event.date} · ⏰ {event.time}
                    {event.endTime ? ` – ${event.endTime}` : ""}
                </p>

                <div className="card-bottom">
                    <div className="mini">
                    <span className="mini-label">Your RSVP:</span>{" "}
                    <span className={`mini-value ${myRsvp || "none"}`}>
                        {myRsvp ? myRsvp.toUpperCase() : "None"}
                    </span>
                    </div>

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
                </div>
            );
            })}
        </div>

        <p className="note">
            Note: RSVP totals are demo-only right now (this device). Firebase later will make
            counts global.
        </p>
        </div>
    );
    };

    export default MyEvents;
