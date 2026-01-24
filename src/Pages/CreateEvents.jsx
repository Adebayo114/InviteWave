    import { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import BackButton from "../Components/BackButton";
    import { createEvent } from "../services/eventsService";
    import { useAuth } from "../context/useAuth"; // adjust path if yours is different
    import { alertError, toastSuccess } from "../utils/alert";
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

    const handleSubmit = async (e) => {
        e.preventDefault();

            if (!user?.uid) {
        alertError("Login required", "Please login to create an event.");
        navigate("/login");
        return;
        }

        if (!formData.title || !formData.category || !formData.location) {
        alertError(
            "Missing information",
            "Title, category, and location are required."
        );
        return;
        }

        if (formData.time && formData.endTime && formData.endTime <= formData.time) {
        alertError(
            "Invalid time",
            "End time must be later than the start time."
        );
        return;
        }


        const finalInviteCode = formData.isPrivate
        ? (formData.inviteCode.trim() || generateCode())
        : "";

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

            // ✅ store owner
            userId: user.uid,
            host: user.displayName || user.email || "Host",

            // ✅ privacy fields
            isPrivate: formData.isPrivate,
            inviteCode: finalInviteCode,

            featured: false,
        });

        toastSuccess("Event created successfully 🎉");
            navigate(`/event/${newId}`);

        } catch (err) {
            console.error(err);
            alertError(
                "Event creation failed",
                "Something went wrong. Please try again."
            );
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
