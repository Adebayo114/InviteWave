    import { useParams, useNavigate } from "react-router-dom";
    import { useEffect, useState } from "react";
    import {
    fetchEventById,
    deleteEvent,
    setFeatured,
    } from "../services/eventsService";
    import { useAuth } from "../context/useAuth";
    import "../Styles/EventDetails.css";
    import RecommendedEvents from "../Components/RecommendedEvents";

    import {
    saveRSVP,
    removeRSVP,
    fetchRSVPCounts,
    fetchUserRSVP,
    } from "../services/rsvpService";

    const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // EVENT
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // RSVP (Firestore)
    const [rsvp, setRsvp] = useState(null);
    const [counts, setCounts] = useState({ yes: 0, maybe: 0, no: 0 });
    const [rsvpLoading, setRsvpLoading] = useState(true);

    // Private unlock (local)
    const [accessGranted, setAccessGranted] = useState(false);
    const [codeInput, setCodeInput] = useState("");
    const [codeError, setCodeError] = useState("");

    // LOAD EVENT
    useEffect(() => {
        const load = async () => {
        try {
            setLoading(true);
            const data = await fetchEventById(id);
            setEvent(data || null);
        } catch (err) {
            console.error(err);
            setEvent(null);
        } finally {
            setLoading(false);
        }
        };
        load();
    }, [id]);

    // HOST CHECK
    const isHost = user?.uid && event?.userId && user.uid === event.userId;

    // ✅ DELETE
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this event?");
        if (!confirmDelete) return;

        try {
        await deleteEvent(event.id);
        navigate("/my-events");
        } catch (err) {
        console.error(err);
        alert("Failed to delete event. Please try again.");
        }
    };

    // ✅ FEATURE TOGGLE
    const handleToggleFeatured = async () => {
        try {
        await setFeatured(event.id, !event.featured);
        setEvent((prev) => ({ ...prev, featured: !prev.featured }));
        } catch (e) {
        console.error(e);
        alert("Failed to update featured status.");
        }
    };

    // TIME FORMAT
    const formatTime = (time) => {
        if (!time) return "";
        const [hour, minute] = time.split(":");
        const h = Number(hour);
        const suffix = h >= 12 ? "PM" : "AM";
        const formattedHour = h % 12 || 12;
        return `${formattedHour}:${minute} ${suffix}`;
    };

    // check local unlock after event loads
    useEffect(() => {
        if (!event?.id) return;
        const accessKey = `event-access-${event.id}`;
        setAccessGranted(localStorage.getItem(accessKey) === "true");
    }, [event?.id]);

    // LOAD RSVP (Firestore) when event+user ready
    useEffect(() => {
        const loadRSVP = async () => {
        if (!event?.id) return;

        try {
            setRsvpLoading(true);

            const c = await fetchRSVPCounts(event.id);
            setCounts(c);

            if (user?.uid) {
            const my = await fetchUserRSVP(event.id, user.uid);
            setRsvp(my);
            } else {
            setRsvp(null);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setRsvpLoading(false);
        }
        };

        loadRSVP();
    }, [event?.id, user?.uid]);

    // UI STATES
    if (loading) return <div className="container">Loading...</div>;

    if (!event) {
        return (
        <div className="container">
            <p>Event not found.</p>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
        );
    }

    // PRIVATE LOCK SCREEN
    if (event.isPrivate && !isHost && !accessGranted) {
        const accessKey = `event-access-${event.id}`;

        return (
        <div className="container event-details">
            <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
            </button>

            <div className="private-lock">
            <h2>🔒 Private Event</h2>
            <p className="muted">Enter the invite code to view this event.</p>

            <div className="code-box">
                <input
                className="code-input"
                placeholder="Enter invite code"
                value={codeInput}
                onChange={(e) => {
                    setCodeInput(e.target.value);
                    setCodeError("");
                }}
                />

                <button
                className="primary-btn"
                onClick={() => {
                    const correct = (event.inviteCode || "").trim().toUpperCase();
                    const typed = codeInput.trim().toUpperCase();

                    if (!typed) return setCodeError("Please enter the code.");
                    if (typed !== correct) return setCodeError("Wrong code. Try again.");

                    localStorage.setItem(accessKey, "true");
                    setAccessGranted(true);
                }}
                >
                Unlock
                </button>

                {codeError && <p className="error-text">{codeError}</p>}
            </div>
            </div>
        </div>
        );
    }

    // MAP + TIME
    const mapLink =
        event.mapUrl && event.mapUrl.trim() !== ""
        ? event.mapUrl
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            event.location || ""
            )}`;

    const timeDisplay = event.endTime
        ? `${formatTime(event.time)} – ${formatTime(event.endTime)}`
        : `${formatTime(event.time)}`;

    const eventUrl = `${window.location.origin}/event/${id}`;

    // RSVP HANDLER (Firestore)
    const handleRSVP = async (choice) => {
        if (!user?.uid) {
        alert("Please login to RSVP.");
        navigate("/login");
        return;
        }

        try {
        if (rsvp === choice) {
            await removeRSVP(event.id, user.uid);
            setRsvp(null);
        } else {
            await saveRSVP(event.id, user.uid, choice);
            setRsvp(choice);
        }

        const updatedCounts = await fetchRSVPCounts(event.id);
        setCounts(updatedCounts);
        } catch (err) {
        console.error(err);
        alert("Failed to update RSVP. Try again.");
        }
    };

    return (
        <div className="container event-details">
        <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
        </button>

        {/* HOST CONTROLS */}
        {isHost && (
            <div className="host-controls">
            <button
                className="secondary-btn"
                onClick={() => navigate(`/edit-event/${event.id}`)}
            >
                Edit Event
            </button>

            <button className="secondary-btn" onClick={handleToggleFeatured}>
                {event.featured ? "Unfeature" : "Feature"} Event
            </button>

            <button className="danger-btn" onClick={handleDelete}>
                Delete Event
            </button>
            </div>
        )}

        <h1>{event.title}</h1>

        <p className="event-meta">
            📅 {event.date} · ⏰ {timeDisplay}
            {event.isPrivate ? " · 🔒 Private" : ""}
            {event.featured ? " · ⭐ Featured" : ""}
        </p>

        <p className="event-meta">📍 {event.location}</p>

        <p className="event-host">
            Hosted by <strong>{event.host}</strong>
        </p>

        <p className="event-description">{event.description}</p>

        <a href={mapLink} target="_blank" rel="noopener noreferrer" className="map-btn">
            📍 Open in Google Maps
        </a>

        {/* RSVP */}
        <div className="rsvp-section">
            <h3>Will you attend?</h3>

            {rsvpLoading ? (
            <p className="muted">Loading RSVP...</p>
            ) : (
            <>
                <div className="rsvp-buttons">
                <button
                    className={`yes ${rsvp === "yes" ? "active" : ""}`}
                    onClick={() => handleRSVP("yes")}
                >
                    Yes
                </button>

                <button
                    className={`maybe ${rsvp === "maybe" ? "active" : ""}`}
                    onClick={() => handleRSVP("maybe")}
                >
                    Maybe
                </button>

                <button
                    className={`no ${rsvp === "no" ? "active" : ""}`}
                    onClick={() => handleRSVP("no")}
                >
                    No
                </button>
                </div>

                {rsvp && (
                <p className="rsvp-feedback">
                    You responded: <strong>{rsvp.toUpperCase()}</strong> (click again to remove)
                </p>
                )}

                <div className="rsvp-counts">
                <span>✅ {counts.yes} going</span>
                <span>🤔 {counts.maybe} maybe</span>
                <span>❌ {counts.no} not coming</span>
                </div>
            </>
            )}
        </div>

        {/* INVITE */}
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
                href={`https://wa.me/?text=${encodeURIComponent(
                `You're invited to ${event.title}! 🎉\n\n${eventUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                Share on WhatsApp
            </a>

            <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `You're invited to ${event.title}! 🎉\n\n${eventUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                Share on X
            </a>
            </div>

            {/* show code only to host */}
            {isHost && event.isPrivate && (
            <p className="muted" style={{ marginTop: "10px" }}>
                Invite Code: <strong>{event.inviteCode}</strong>
            </p>
            )}
        </div>

        {/* ✅ RECOMMENDED (put it inside return like this) */}
        <RecommendedEvents
        currentEventId={event.id} category={event.category}
        />
        </div>
    );
    };

    export default EventDetails;
