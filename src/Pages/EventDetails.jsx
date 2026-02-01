    import { useParams, useNavigate } from "react-router-dom";
    import { useEffect, useState } from "react";
    import {
    fetchEventById,
    deleteEvent,
    setFeatured,
    } from "../services/eventsService";
    import {
    alertConfirm,
    alertSuccess,
    toastSuccess,
    alertError,
    alertInfo,
    } from "../utils/alert";
    import { useAuth } from "../context/useAuth";
    import "../Styles/EventDetails.css";
    import RecommendedEvents from "../Components/RecommendedEvents";

    import {
    saveRSVP,
    removeRSVP,
    fetchRSVPCounts,
    fetchUserRSVP,
    } from "../services/rsvpService";

    import { countMyFeaturedEvents } from "../services/eventsService";

    const FREE_FEATURED_LIMIT = 1; // ✅ change later

    const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    // EVENT
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // RSVP
    const [rsvp, setRsvp] = useState(null);
    const [counts, setCounts] = useState({ yes: 0, maybe: 0, no: 0 });
    const [rsvpLoading, setRsvpLoading] = useState(true);

    // Private unlock (local)
    const [accessGranted, setAccessGranted] = useState(false);
    const [codeInput, setCodeInput] = useState("");
    const [codeError, setCodeError] = useState("");

    // Load event
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

    // Host check
    const isHost = user?.uid && event?.userId && user.uid === event.userId;

    // Time formatter
    const formatTime = (time) => {
        if (!time) return "";
        const [hour, minute] = time.split(":");
        const h = Number(hour);
        const suffix = h >= 12 ? "PM" : "AM";
        const formattedHour = h % 12 || 12;
        return `${formattedHour}:${minute} ${suffix}`;
    };

    const timeDisplay = event?.endTime
        ? `${formatTime(event?.time)} – ${formatTime(event?.endTime)}`
        : `${formatTime(event?.time)}`;

        const isOnlineEvent =
    (event?.location || "").toLowerCase().includes("online") ||
    (event?.location || "").toLowerCase().includes("virtual");

    const mapLink =
    !isOnlineEvent && event?.mapUrl && event.mapUrl.trim() !== ""
        ? event.mapUrl
        : !isOnlineEvent && (event?.location || "").trim() !== ""
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            event.location
        )}`
        : null;

    const eventUrl = `${window.location.origin}/event/${id}`;


    // Check local unlock
    useEffect(() => {
        if (!event?.id) return;
        const accessKey = `event-access-${event.id}`;
        setAccessGranted(localStorage.getItem(accessKey) === "true");
    }, [event?.id]);

    // Load RSVP
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

    // Delete
    const handleDelete = async () => {
        const ok = await alertConfirm({
        title: "Delete this event?",
        text: "This cannot be undone.",
        confirmText: "Yes, delete",
        });

        if (!ok) return;

        try {
        await deleteEvent(event.id);
        toastSuccess("Event deleted");
        navigate("/my-events");
        } catch (err) {
        console.error(err);
        alertError("Delete failed", "Please try again.");
        }
    };

    // Toggle featured (with limit)
    const handleToggleFeatured = async () => {
        try {
        if (!user?.uid) {
            return alertInfo("Login required", "Please login to manage featured events.");
        }

        // turning ON featured
        if (!event.featured) {
            const count = await countMyFeaturedEvents(user.uid);

            if (count >= FREE_FEATURED_LIMIT) {
            return alertError(
                "Pro Feature",
                `Free plan allows only ${FREE_FEATURED_LIMIT} featured event. Upgrade to feature more.`
            );
            }
        }

        await setFeatured(event.id, !event.featured);
        setEvent((prev) => ({ ...prev, featured: !prev.featured }));

        if (!event.featured) {
            alertSuccess("Featured!", "Your event is now featured.");
        } else {
            alertSuccess("Removed", "This event is no longer featured.");
        }
        } catch (e) {
        console.error(e);
        alertError("Error", "Failed to update featured status.");
        }
    };

    // RSVP handler
    const handleRSVP = async (choice) => {
        if (!user?.uid) {
        alertInfo("Login required", "Please login to RSVP for this event");
        // optional: send them back to this event after login (better UX)
        navigate(`/login?redirect=/event/${event.id}`);
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
        alertError("RSVP failed", "Please try again");
        }
    };

    // UI states
    if (loading) return <div className="container">Loading...</div>;

    if (!event) {
        return (
        <div className="container">
            <p>Event not found.</p>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
        );
    }

    // Private lock screen
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

                    if (!typed) {
                    setCodeError("Please enter the code.");
                    return;
                    }

                    if (typed !== correct) {
                    alertError("Invalid Code", "The invite code you entered is incorrect");
                    return;
                    }

                    alertSuccess("Access Granted 🎉", "You can now view this private event");
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
    

    // ✅ Main page
    return (
        <div className="container event-details">
        <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
        </button>

        {/* HOST CONTROLS */}
        {isHost && (
            <div className="host-controls">
            <button className="secondary-btn" onClick={() => navigate(`/edit-event/${event.id}`)}>
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

        {/* UPGRADE CTA (NO BACKTICKS!) */}
        <div className="upgrade-wrap">
            <button
            className="upgrade-btn"
            onClick={() =>
                alertInfo(
                "InviteWave Pro (Coming Soon)",
                "Pro will unlock more featured events, advanced privacy, analytics, and custom branding."
                )
            }
            >
            Upgrade to Pro
            </button>
        </div>

        {/* HEADER / META */}
        <h1>{event.title}</h1>

        <p className="event-meta">
            📅 {event.date || "TBD"} · ⏰ {timeDisplay || "TBD"}
            {event.isPrivate ? " · 🔒 Private" : ""}
            {event.featured ? " · ⭐ Featured" : ""}
        </p>

        <p className="event-meta">📍 {event.location}</p>

        <p className="event-host">
            Hosted by <strong>{event.host}</strong>
        </p>
        {/* {event.sourceUrl && (
        <p className="event-source">
            Source:{" "}
            <a href={event.sourceUrl} target="_blank" rel="noopener noreferrer">
            {event.sourceName || "Official Event Page"}
            </a>
        </p>
        )}
        DESCRIPTION & MAP */}
        {event.description && <p className="event-description">{event.description}</p>}

                    {mapLink && (
        <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
        >
            <span className="map-icon">📍</span>
            <span className="map-text">
            Open location in Google Maps
            <span className="map-subtext">{event.location || "View location"}</span>
            </span>
            <span className="map-arrow">↗</span>
        </a>
        )}





        {/* RSVP */}
        <div className="rsvp-section">
            <h3>Will you attend?</h3>

            {rsvpLoading ? (
            <p className="muted">Loading RSVP...</p>
            ) : (
            <>
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
        {/* INVITE */}
        <div className="invite-section">
        <h3>Invite others</h3>

        <div className="invite-actions">
            <button
            onClick={() => {
                navigator.clipboard.writeText(eventUrl);
                alertSuccess("Copied!", "Invite link copied to clipboard");
            }}
            >
            Copy Link
            </button>

            <a
            href={`https://wa.me/?text=${encodeURIComponent(
                `Check out this event on InviteWave: ${event.title} 🎉\n\n${eventUrl}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            >
            Share on WhatsApp
            </a>

            <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                `Check out this event on InviteWave: ${event.title} 🎉\n\n${eventUrl}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            >
            Share on X
            </a>
        </div>

        {isHost && event.isPrivate && (
            <p className="muted" style={{ marginTop: "10px" }}>
            Invite Code: <strong>{event.inviteCode}</strong>
            </p>
        )}
        </div>


        {/* ✅ Recommended shows BELOW Invite section */}
        <RecommendedEvents currentEventId={event.id} category={event.category} />
        </div>
    );
    };

    export default EventDetails;
