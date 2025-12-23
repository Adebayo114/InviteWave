    import { useParams, useNavigate } from "react-router-dom";
    import { useState } from "react";
    import { getEvents } from "../utils/data";
    import "../Styles/EventDetails.css";

    const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // ✅ Always read events dynamically
    const events = getEvents();
    const event = events.find((e) => e.id === Number(id));

    // ✅ Time formatter (supports "HH:mm")
    const formatTime = (time) => {
        if (!time) return "";
        const [hour, minute] = time.split(":");
        const h = Number(hour);
        const suffix = h >= 12 ? "PM" : "AM";
        const formattedHour = h % 12 || 12;
        return `${formattedHour}:${minute} ${suffix}`;
    };

    // =========================
    // RSVP STORAGE (demo only)
    // =========================
    const storageKey = `rsvp-event-${id}`;
    const savedData = localStorage.getItem(storageKey);
    const savedRsvp = savedData ? JSON.parse(savedData).response : null;

    const [rsvp, setRsvp] = useState(savedRsvp);

    const [counts, setCounts] = useState(() => ({
        yes: savedRsvp === "yes" ? 1 : 0,
        maybe: savedRsvp === "maybe" ? 1 : 0,
        no: savedRsvp === "no" ? 1 : 0,
    }));

    const eventUrl = `${window.location.origin}/event/${id}`;

    if (!event) {
        return (
        <div className="container">
            <p>Event not found.</p>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
        );
    }

    // RSVP HANDLER
    const handleRSVP = (choice) => {
        if (rsvp === choice) return;

        setCounts((prev) => ({
        ...prev,
        [choice]: prev[choice] + 1,
        ...(rsvp ? { [rsvp]: prev[rsvp] - 1 } : {}),
        }));

        setRsvp(choice);

        localStorage.setItem(
        storageKey,
        JSON.stringify({
            response: choice,
            timestamp: Date.now(),
        })
        );
    };

    // ✅ MAP LINK (uses saved link if provided)
    const mapLink =
        event.mapUrl && event.mapUrl.trim() !== ""
        ? event.mapUrl
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`;

    // ✅ Time display: start – end (if end exists)
    const timeDisplay = event.endTime
        ? `${formatTime(event.time)} – ${formatTime(event.endTime)}`
        : `${formatTime(event.time)}`;

    const isHost = JSON.parse(localStorage.getItem("myEventIds") || "[]").includes(event.id);

    return (
        <div className="container event-details">
        {/* BACK */}
        <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
        </button>

        {/* HOST CONTROLS */}
        {isHost && (
            <div className="host-controls">
            <button className="secondary-btn" onClick={() => navigate(`/edit-event/${event.id}`)}>
                Edit Event
            </button>

            <button
                className="danger-btn"
                onClick={() => {
                const confirmDelete = window.confirm("Are you sure you want to delete this event?");
                if (!confirmDelete) return;

                const events = JSON.parse(localStorage.getItem("events")) || [];
                const myEventIds = JSON.parse(localStorage.getItem("myEventIds")) || [];

                const updatedEvents = events.filter((e) => e.id !== event.id);
                const updatedIds = myEventIds.filter((eid) => eid !== event.id);

                localStorage.setItem("events", JSON.stringify(updatedEvents));
                localStorage.setItem("myEventIds", JSON.stringify(updatedIds));

                navigate("/my-events");
                }}
            >
                Delete Event
            </button>
            </div>
        )}

        {/* EVENT INFO */}
        <h1>{event.title}</h1>

        <p className="event-meta">
            📅 {event.date} · ⏰ {timeDisplay}
        </p>

        <p className="event-meta">📍 {event.location}</p>

        <p className="event-host">
            Hosted by <strong>{event.host}</strong>
        </p>

        <p className="event-description">{event.description}</p>

        {/* MAP */}
        <a href={mapLink} target="_blank" rel="noopener noreferrer" className="map-btn">
            📍 Open in Google Maps
        </a>

        {/* RSVP SECTION */}
        <div className="rsvp-section">
            <h3>Will you attend?</h3>

            <div className="rsvp-buttons">
            <button className={`yes ${rsvp === "yes" ? "active" : ""}`} onClick={() => handleRSVP("yes")}>
                Yes
            </button>

            <button className={`maybe ${rsvp === "maybe" ? "active" : ""}`} onClick={() => handleRSVP("maybe")}>
                Maybe
            </button>

            <button className={`no ${rsvp === "no" ? "active" : ""}`} onClick={() => handleRSVP("no")}>
                No
            </button>
            </div>

            {rsvp && (
            <p className="rsvp-feedback">
                You responded: <strong>{rsvp.toUpperCase()}</strong>
            </p>
            )}

            <div className="rsvp-counts">
            <span>✅ {counts.yes} going</span>
            <span>🤔 {counts.maybe} maybe</span>
            <span>❌ {counts.no} not coming</span>
            </div>
        </div>

        {/* GUEST PREVIEW */}
        <div className="guest-preview">
            <h3>Guest Responses</h3>
            <ul>
            <li>✅ Going: {counts.yes}</li>
            <li>🤔 Maybe: {counts.maybe}</li>
            <li>❌ Not coming: {counts.no}</li>
            </ul>
        </div>

        {/* INVITE SHARING */}
        <div className="invite-section">
            <h3>Invite others</h3>

            <div className="invite-actions">
            <button
                onClick={() => {
                navigator.clipboard.writeText(eventUrl);
                alert("Invite link copied!");
                }}
            >
                Copy Link
            </button>

            <a
                href={`https://wa.me/?text=${encodeURIComponent(`You're invited to ${event.title}! 🎉\n\n${eventUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                Share on WhatsApp
            </a>

            <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`You're invited to ${event.title}! 🎉\n\n${eventUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                Share on X
            </a>
            </div>
        </div>
        </div>
    );
    };

    export default EventDetails;
