    import { useParams, useNavigate } from "react-router-dom";
    import { useEffect, useMemo, useState } from "react";
    import {
    fetchEventById,
    deleteEvent,
    setFeatured,
    countMyFeaturedEvents,
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
    fetchMyRSVPChoice,
    fetchRSVPListForHost,
    getMyRsvpId,
    } from "../services/rsvpService";

    const FREE_FEATURED_LIMIT = 1;

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

    // Guest list (host only)
    const [guestList, setGuestList] = useState({ yes: [], maybe: [], no: [] });
    const [guestLoading, setGuestLoading] = useState(false);

    // Guest name for anonymous RSVP
    const [guestName, setGuestName] = useState("");

    // Show name input only after Yes/Maybe click
    const [pendingChoice, setPendingChoice] = useState(null);

    // Private unlock (local)
    const [accessGranted, setAccessGranted] = useState(false);
    const [codeInput, setCodeInput] = useState("");
    const [codeError, setCodeError] = useState("");

    // Host check
    const isHost = useMemo(() => {
        return user?.uid && event?.userId && user.uid === event.userId;
    }, [user?.uid, event?.userId]);

    // RSVP doc id
    const myRsvpId = useMemo(() => {
        if (!event?.id) return null;
        return getMyRsvpId(event.id, user);
    }, [event?.id, user]);

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

    // Check private unlock after event loads
    useEffect(() => {
        if (!event?.id) return;
        const accessKey = `event-access-${event.id}`;
        setAccessGranted(localStorage.getItem(accessKey) === "true");
    }, [event?.id]);

    // Load saved anonymous guest name
    useEffect(() => {
        const saved = localStorage.getItem("invitewave_guest_name");
        if (saved) {
        setGuestName(saved);
        }
    }, []);

    // Save anonymous guest name
    useEffect(() => {
        if (guestName.trim()) {
        localStorage.setItem("invitewave_guest_name", guestName);
        }
    }, [guestName]);

    // Load RSVP counts + my RSVP choice
    useEffect(() => {
        const loadRSVP = async () => {
        if (!event?.id) return;

        try {
            setRsvpLoading(true);

            const c = await fetchRSVPCounts(event.id);
            setCounts(c);

            if (myRsvpId) {
            const myChoice = await fetchMyRSVPChoice(event.id, myRsvpId);
            setRsvp(myChoice);
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
    }, [event?.id, myRsvpId]);

    // Load guest list (HOST ONLY)
    useEffect(() => {
        const loadGuestList = async () => {
        if (!event?.id || !isHost) return;

        try {
            setGuestLoading(true);
            const list = await fetchRSVPListForHost(event.id);
            setGuestList(list);
        } catch (err) {
            console.error(err);
        } finally {
            setGuestLoading(false);
        }
        };

        loadGuestList();
    }, [event?.id, isHost]);

    // Time formatting
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

    // Feature toggle
    const handleToggleFeatured = async () => {
        try {
        if (!user?.uid) {
            return alertInfo(
            "Login required",
            "Please login to manage featured events."
            );
        }

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
        if (!event?.id || !myRsvpId) return;

        const isPositiveChoice = choice === "yes" || choice === "maybe";

        const autoName =
        user?.displayName || (user?.email ? user.email.split("@")[0] : "");

        const finalName = (autoName || guestName || "").trim();

        if (isPositiveChoice && !finalName) {
        alertInfo("Your name is needed", "Please type your name to RSVP.");
        return;
        }

        try {
        if (rsvp === choice) {
            await removeRSVP(event.id, myRsvpId);
            setRsvp(null);
            setPendingChoice(null);

            const updatedCounts = await fetchRSVPCounts(event.id);
            setCounts(updatedCounts);

            if (isHost) {
            const list = await fetchRSVPListForHost(event.id);
            setGuestList(list);
            }

            alertSuccess("RSVP removed", "Your response has been removed.");
            return;
        }

        await saveRSVP(event.id, myRsvpId, {
            choice,
            name: isPositiveChoice ? finalName : "",
            userId: user?.uid || null,
        });

        setRsvp(choice);
        setPendingChoice(null);

        const updatedCounts = await fetchRSVPCounts(event.id);
        setCounts(updatedCounts);

        if (isHost) {
            const list = await fetchRSVPListForHost(event.id);
            setGuestList(list);
        }

        alertSuccess("RSVP saved", `You selected "${choice}".`);
        } catch (error) {
        console.error("RSVP failed:", error);
        alertError("RSVP failed", "Please try again.");
        }
    };

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
                    alertError(
                        "Invalid Code",
                        "The invite code you entered is incorrect"
                    );
                    return;
                    }

                    alertSuccess(
                    "Access Granted 🎉",
                    "You can now view this private event"
                    );
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

    return (
        <div className="container event-details">
        <button className="back-btn" onClick={() => navigate(-1)}>
            ← Back
        </button>

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

        {event.description && (
            <p className="event-description">{event.description}</p>
        )}

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
                <span className="map-subtext">
                {event.location || "View location"}
                </span>
            </span>
            <span className="map-arrow">↗</span>
            </a>
        )}

        <div className="rsvp-section">
            <h3>Will you attend?</h3>

            {rsvpLoading ? (
            <p className="muted">Loading RSVP...</p>
            ) : (
            <>
                <div className="rsvp-buttons">
                <button
                    className={`yes ${rsvp === "yes" ? "active" : ""}`}
                    onClick={() => {
                    if (!user?.uid) {
                        setPendingChoice("yes");
                    } else {
                        handleRSVP("yes");
                    }
                    }}
                >
                    Yes
                </button>

                <button
                    className={`maybe ${rsvp === "maybe" ? "active" : ""}`}
                    onClick={() => {
                    if (!user?.uid) {
                        setPendingChoice("maybe");
                    } else {
                        handleRSVP("maybe");
                    }
                    }}
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

                {!user?.uid &&
                (pendingChoice === "yes" || pendingChoice === "maybe") && (
                    <div style={{ marginTop: "12px" }}>
                    <input
                        className="code-input"
                        placeholder="Your name"
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                    />
                    <p className="muted" style={{ marginTop: 6 }}>
                        No login needed. Just type your name to RSVP.
                    </p>

                    <button
                        className="primary-btn"
                        style={{ marginTop: "10px" }}
                        onClick={() => handleRSVP(pendingChoice)}
                    >
                        Confirm {pendingChoice}
                    </button>
                    </div>
                )}

                {rsvp && (
                <p className="rsvp-feedback">
                    You responded: <strong>{rsvp.toUpperCase()}</strong> (click again
                    to remove)
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

        {isHost && (
            <div className="guest-preview">
            <h3>Guest List (Host only)</h3>

            {guestLoading ? (
                <p className="muted">Loading guests...</p>
            ) : (
                <>
                <p className="muted">✅ Going</p>
                <ul>
                    {guestList.yes.length > 0 ? (
                    guestList.yes.map((g) => <li key={g.id}>{g.name}</li>)
                    ) : (
                    <li>No one yet</li>
                    )}
                </ul>

                <p className="muted">🤔 Maybe</p>
                <ul>
                    {guestList.maybe.length > 0 ? (
                    guestList.maybe.map((g) => <li key={g.id}>{g.name}</li>)
                    ) : (
                    <li>No maybe responses yet</li>
                    )}
                </ul>

                <p className="muted">❌ Not coming</p>
                <ul>
                    {guestList.no.length > 0 ? (
                    guestList.no.map((g) => <li key={g.id}>{g.name}</li>)
                    ) : (
                    <li>No declines yet</li>
                    )}
                </ul>
                </>
            )}
            </div>
        )}

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

        <RecommendedEvents currentEventId={event.id} category={event.category} />
        </div>
    );
    };

    export default EventDetails;