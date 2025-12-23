    import { useNavigate } from "react-router-dom";
    import { getEvents } from "../utils/data";
    import BackButton from "../Components/BackButton";
    import { getAuthUser } from "../utils/auth";
    import "../Styles/MyEvents.css";

    const MyEvents = () => {
    const navigate = useNavigate();

    const events = getEvents();
//    const myEventIds = JSON.parse(localStorage.getItem("myEventIds")) || [];
 
   const user = getAuthUser();
const myEvents = events.filter((e) => e.userId === user.id);

    // ✅ Time formatter (supports "HH:mm")
    const formatTime = (time) => {
        if (!time) return "";
        const [hour, minute] = time.split(":");
        const h = Number(hour);
        const suffix = h >= 12 ? "PM" : "AM";
        const formattedHour = h % 12 || 12;
        return `${formattedHour}:${minute} ${suffix}`;
    };


    
    // helper: read your RSVP (demo on this device)
    const getMyRsvp = (eventId) => {
        const saved = localStorage.getItem(`rsvp-event-${eventId}`);
        if (!saved) return null;

        try {
        const parsed = JSON.parse(saved);
        return parsed?.response || null;
        } catch {
        return saved;
        }
    };

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

            const timeDisplay = event.endTime
                ? `${formatTime(event.time)} – ${formatTime(event.endTime)}`
                : `${formatTime(event.time)}`;

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
                    📅 {event.date} · ⏰ {timeDisplay}
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
            Note: RSVP totals are demo-only right now (this device). Firebase later will make counts global.
        </p>
        </div>
    );
    };

    export default MyEvents;
