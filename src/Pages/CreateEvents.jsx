    import { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import BackButton from "../Components/BackButton";
    import { createEvent } from "../services/eventsService";
    import { useAuth } from "../context/useAuth";
    import { alertError, toastSuccess, alertInfo } from "../utils/alert";
    import { Timestamp } from "firebase/firestore";
    import Swal from "sweetalert2";
    import "../Styles/CreateEvents.css";

    const CreateEvents = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const AUTO_EXPIRE_DAYS = 3;

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        location: "",
        mapUrl: "",
        date: "",
        time: "",
        endTime: "",
        description: "",
        isPrivate: false,
        inviteCode: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    const generateCode = () =>
        Math.random().toString(36).slice(2, 8).toUpperCase();

    // ✅ pop help for whole page
    const showQuickHelp = () => {
    alertInfo(
        "How to create an event (Quick Guide)",
        `
        <ol style="text-align:left; line-height:1.7; padding-left:18px">
        <li><b>Fill in</b> title, category, and location ✅</li>
        <li>Add <b>date & time</b> (recommended) 📅</li>
        <li>Optional: Paste a <b>Google Maps link</b> 🗺️</li>
        <li>Optional: Make it <b>Private</b> with an invite code 🔒</li>
        </ol>

        <p style="margin-top:12px; color:#555">
        ℹ️ Events automatically hide after <b>${AUTO_EXPIRE_DAYS} days</b>.
        </p>
        `
    );
    };


    // ✅ help for map URL
        const showMapHelp = () => {
    Swal.fire({
        title: "How to get your Google Maps link",
        html: `
        <ol style="text-align:left; line-height:1.6">
            <li>Open <b>Google Maps</b></li>
            <li>Search the place (e.g. "IUPUI", "Wedding Hall")</li>
            <li>Tap <b>Share</b></li>
            <li>Choose <b>Copy link</b></li>
            <li>Paste it here ✅</li>
        </ol>
        <p style="margin-top:10px; color:#555">
            If you skip this, InviteWave will generate a map from your location text.
        </p>
        `,
        icon: "info",
        confirmButtonText: "Got it",
        showCancelButton: true,
        cancelButtonText: "Open Google Maps",
        reverseButtons: true,
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
        window.open("https://maps.google.com", "_blank");
        }
    });
    };



    // ✅ help for Private + Code
    const showPrivateHelp = () => {
        alertInfo(
        "Private Event (Invite Code)",
        `When enabled:
    • Event still shows on Explore 🔒 (locked)
    • Only people with the code can view details

    Tip: If you don’t enter a code, InviteWave auto-generates one.`
        );
    };

    // ✅ help for expiration
    const showExpiryHelp = () => {
        alertInfo(
        "Auto-expire (3 days)",
        `To keep Explore clean, events automatically disappear after ${AUTO_EXPIRE_DAYS} days.

    (They are not deleted yet — just hidden in the app.)`
        );
    };

    


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?.uid) {
        alertInfo("Login required", "Please login to create an event.");
        navigate("/login");
        return;
        }

        if (!formData.title || !formData.category || !formData.location) {
        alertError("Missing fields", "Please fill in title, category and location.");
        return;
        }

        if (formData.time && formData.endTime && formData.endTime <= formData.time) {
        alertError("Invalid time", "End time must be after start time.");
        return;
        }

        const finalInviteCode = formData.isPrivate
        ? (formData.inviteCode.trim() || generateCode())
        : "";

        // ✅ Safari-safe date build (ONLY if date exists)
        let expiresAt = null;

        if (formData.date) {
        const safeTime = formData.time || "12:00";
        const [hh, mm] = safeTime.split(":").map(Number);
        const [yyyy, mo, dd] = formData.date.split("-").map(Number);

        const eventDateTime = new Date(yyyy, mo - 1, dd, hh, mm, 0);

        if (!isNaN(eventDateTime.getTime())) {
            const expiresAtDate = new Date(
            eventDateTime.getTime() + AUTO_EXPIRE_DAYS * 24 * 60 * 60 * 1000
            );
            expiresAt = Timestamp.fromDate(expiresAtDate);
        }
        }

        try {
        const newId = await createEvent({
            title: formData.title.trim(),
            category: formData.category,
            location: formData.location.trim(),
            mapUrl: formData.mapUrl.trim(),
            date: formData.date,
            time: formData.time,
            endTime: formData.endTime,
            description: formData.description.trim(),

            userId: user.uid,
            host: user.displayName || user.email || "Host",

            isPrivate: formData.isPrivate,
            inviteCode: finalInviteCode,

            featured: false,

            autoExpireDays: AUTO_EXPIRE_DAYS,
            expiresAt, // ✅ can be null if no date
        });

        toastSuccess("Event created 🎉");
        navigate(`/event/${newId}`);
        } catch (err) {
        console.error(err);
        alertError("Create failed", "Failed to create event. Please try again.");
        }
    };

    return (
        <div className="container create-event">
        <BackButton />

        <div className="create-header">
            <h1>Create Event</h1>
                    <div className="help-under-form">
        <button type="button" className="help-pill" onClick={showQuickHelp}>
            Need help? See quick guide
        </button>
</div>

        </div>

        <form onSubmit={handleSubmit} className="event-form">
            <input
            type="text"
            name="title"
            placeholder="Event title *"
            value={formData.title}
            onChange={handleChange}
            />

            <select name="category" value={formData.category} onChange={handleChange}>
            <option value="">Select category *</option>
            <option value="birthday">Birthday</option>
            <option value="wedding">Wedding</option>
            <option value="graduation">Graduation</option>
            <option value="party">Party</option>
            <option value="baby-shower">Baby Shower</option>
            <option value="corporate">Corporate</option>
            <option value="concert">Concert</option>
            <option value="sports">Sports</option>
            </select>

            <div className="row-inline">
            <label className="row-label">
                Date
                <button type="button" className="mini-info" onClick={showExpiryHelp}>
                ?
                </button>
            </label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
            </div>

            <div className="time-row">
            <div className="time-field">
                <label className="time-label">Start Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} />
            </div>

            <div className="time-field">
                <label className="time-label">End Time</label>
                <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                />
            </div>
            </div>

            <input
            type="text"
            name="location"
            placeholder="Location *"
            value={formData.location}
            onChange={handleChange}
            />

        {/* MAP URL (full width) */}
        <div className="field-block">
        <input
            type="url"
            name="mapUrl"
            placeholder="Google Maps link (optional)"
            value={formData.mapUrl}
            onChange={handleChange}
        />

        <button type="button" className="mini-help-link" onClick={showMapHelp}>
            How to get Google Maps link
        </button>
        </div>


            

            {/* PRIVATE EVENT */}
            <div className="privacy-row">
            <label className="privacy-check">
                <input
                type="checkbox"
                checked={formData.isPrivate}
                onChange={(e) =>
                    setFormData((prev) => ({
                    ...prev,
                    isPrivate: e.target.checked,
                    }))
                }
                />
                <span>
                Private event (requires invite code)
                <button type="button" className="mini-info" onClick={showPrivateHelp}>
                    ?
                </button>
                </span>
            </label>

            {formData.isPrivate && (
                <input
                type="text"
                name="inviteCode"
                placeholder="Set invite code (optional)"
                value={formData.inviteCode}
                onChange={handleChange}
                />
            )}
            </div>

            <textarea
            name="description"
            placeholder="Event description"
            value={formData.description}
            onChange={handleChange}
            />

            <button type="submit">Create Event</button>

            {formData.isPrivate && (
            <p className="muted">
                If you don’t enter a code, InviteWave will auto-generate one for you.
            </p>
            )}

            <p className="muted">
            Events automatically hide after <strong>{AUTO_EXPIRE_DAYS} days</strong> to keep Explore clean.
            </p>
        </form>
        </div>
    );
    };

    export default CreateEvents;
