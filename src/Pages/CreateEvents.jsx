    import { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import BackButton from "../Components/BackButton";
    import { createEvent } from "../services/eventsService";
    import { useAuth } from "../context/useAuth"; // adjust path if yours is different
    import { alertError, toastSuccess, alertInfo } from "../utils/alert";
    import { Timestamp } from "firebase/firestore"; // ✅ add this at top
    import "../Styles/CreateEvents.css";

    const CreateEvents = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        location: "",
        mapUrl: "",
        date: "",
        time: "",
        endTime: "",
        description: "",

        // ✅ NEW: privacy
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
        Math.random().toString(36).slice(2, 8).toUpperCase(); // e.g. "8KD2QA"

            const AUTO_EXPIRE_DAYS = 2
            ;

        const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user?.uid) {
            alertInfo("Login required", "Please login to create an event.");
            navigate("/login");
            return;
        }

        if (!formData.title || !formData.category || !formData.location || !formData.date) {
            alertError("Missing fields", "Please fill in title, category, location, and date.");
            return;
        }

        if (formData.time && formData.endTime && formData.endTime <= formData.time) {
            alertError("Invalid time", "End time must be after start time.");
            return;
        }

        const finalInviteCode = formData.isPrivate
            ? (formData.inviteCode.trim() || generateCode())
            : "";

        // ✅ Safari-safe date build
        const safeTime = formData.time || "12:00";
        const [hh, mm] = safeTime.split(":").map(Number);
        const [yyyy, mo, dd] = formData.date.split("-").map(Number);
        const eventDateTime = new Date(yyyy, mo - 1, dd, hh, mm, 0);

        const expiresAtDate = new Date(
            eventDateTime.getTime() + AUTO_EXPIRE_DAYS * 24 * 60 * 60 * 1000
        );

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
            expiresAt: Timestamp.fromDate(expiresAtDate),
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
        <h1>Create Event</h1>

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

            <input type="date" name="date" value={formData.date} onChange={handleChange} />

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

            <input
            type="url"
            name="mapUrl"
            placeholder="Google Maps link (optional)"
            value={formData.mapUrl}
            onChange={handleChange}
            />

            {/* ✅ PRIVATE EVENT TOGGLE */}
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
                <span>Private event (requires invite code)</span>
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

            <div className="privacy-row">
  {/* your existing private checkbox */}

    <label className="privacy-check" style={{ marginTop: "10px" }}>
        <input
        type="checkbox"
        checked={formData.advancedPrivacy}
        onChange={() =>
            alertError(
            "Pro Feature",
            "Advanced privacy includes expiring codes, guest limits, and extra protection. Upgrade to Pro to enable it."
            )
        }
        />
        <span>
        Advanced Privacy <span className="pro-badge">PRO</span>
        </span>
    </label>
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
        </form>
        </div>
    );
    };

    export default CreateEvents;
