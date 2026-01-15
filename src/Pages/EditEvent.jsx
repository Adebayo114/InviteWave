    import { useEffect, useState } from "react";
    import { useNavigate, useParams } from "react-router-dom";

    import { fetchEventById, updateEvent } from "../services/eventsService";
    import { useAuth } from "../context/useAuth";

    import "../Styles/CreateEvents.css"; // reuse your form styles

    const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, authLoading } = useAuth(); // ✅ Firebase auth

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [event, setEvent] = useState(null);

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        location: "",
        mapUrl: "",
        date: "",
        time: "",
        endTime: "",
        description: "",
    });

    // =========================
    // LOAD EVENT
    // =========================
    useEffect(() => {
        const load = async () => {
        try {
            setLoading(true);
            const data = await fetchEventById(id);
            setEvent(data);

            if (!data) return;

            setFormData({
            title: data.title || "",
            category: data.category || "",
            location: data.location || "",
            mapUrl: data.mapUrl || "",
            date: data.date || "",
            time: data.time || "",
            endTime: data.endTime || "",
            description: data.description || "",
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
        };

        load();
    }, [id]);

    // =========================
    // UI STATES
    // =========================
    if (authLoading || loading) {
        return <div className="container create-event">Loading...</div>;
    }

    if (!user) {
        return (
        <div className="container create-event">
            <p>Please login to edit events.</p>
            <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
        );
    }

    if (!event) {
        return (
        <div className="container create-event">
            <p>Event not found.</p>
            <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
        );
    }

    // =========================
    // OWNERSHIP CHECK (Firebase uid)
    // =========================
    const isOwner = user?.uid && event?.userId && user.uid === event.userId;

    if (!isOwner) {
        return (
        <div className="container create-event">
            <p>You don’t have permission to edit this event.</p>
            <button onClick={() => navigate(`/event/${id}`)}>Back to Event</button>
        </div>
        );
    }

    // =========================
    // INPUT HANDLER
    // =========================
    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

    // =========================
    // SUBMIT
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.category || !formData.location) {
        alert("Please fill in required fields");
        return;
        }

        if (formData.time && formData.endTime && formData.endTime <= formData.time) {
        alert("End time must be after start time");
        return;
        }

        try {
        setSaving(true);

        await updateEvent(id, {
            title: formData.title,
            category: formData.category,
            location: formData.location,
            mapUrl: formData.mapUrl,
            date: formData.date,
            time: formData.time,
            endTime: formData.endTime,
            description: formData.description,
        });

        navigate(`/event/${id}`);
        } catch (err) {
        console.error(err);
        alert("Failed to update event. Please try again.");
        } finally {
        setSaving(false);
        }
    };

    return (
        <div className="container create-event">
        <h1>Edit Event</h1>

        <form onSubmit={handleSubmit} className="event-form">
            <input
            type="text"
            name="title"
            placeholder="Event title"
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

            {/* Start time */}
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
            placeholder="Location"
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

            {/* NOTE: textarea is naturally resizable by default.
                If you want NO expandable, add CSS: textarea { resize: none; } */}
            <textarea
            name="description"
            placeholder="Event description"
            value={formData.description}
            onChange={handleChange}
            />

            <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
            type="button"
            className="btn btn-light mt-2"
            onClick={() => navigate(`/event/${id}`)}
            disabled={saving}
            >
            Cancel
            </button>
        </form>
        </div>
    );
    };

    export default EditEvent;
