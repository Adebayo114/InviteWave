    import { useParams, useNavigate } from "react-router-dom";
    import { useState } from "react";
    import { getEvents } from "../utils/data";
    import "../Styles/CreateEvents.css";

    const EditEvent = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const events = getEvents();
    const event = events.find((e) => e.id === Number(id));
    const myEventIds = JSON.parse(localStorage.getItem("myEventIds")) || [];

    // ✅ HOOK ALWAYS RUNS
    const [formData, setFormData] = useState(() => ({
        title: event?.title || "",
        category: event?.category || "",
        location: event?.location || "",
        date: event?.date || "",
        time: event?.time || "",
        description: event?.description || "",
    }));

    // ✅ GUARD AFTER HOOK
    if (!event || !myEventIds.includes(event.id)) {
        navigate(-1);
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const updatedEvents = events.map((e) =>
        e.id === event.id ? { ...e, ...formData } : e
        );

        localStorage.setItem("events", JSON.stringify(updatedEvents));
        navigate(`/event/${event.id}`);
    };

    return (
        <div className="container create-event">
        <h1>Edit Event</h1>

        <form onSubmit={handleSubmit} className="event-form">
            <input name="title" value={formData.title} onChange={handleChange} />
            <select name="category" value={formData.category} onChange={handleChange}>
            <option value="birthday">Birthday</option>
            <option value="wedding">Wedding</option>
            <option value="graduation">Graduation</option>
            <option value="party">Party</option>
            <option value="corporate">Corporate</option>
            </select>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
            <input type="time" name="time" value={formData.time} onChange={handleChange} />
            <input name="location" value={formData.location} onChange={handleChange} />
            <textarea name="description" value={formData.description} onChange={handleChange} />
            <button type="submit">Save Changes</button>
        </form>
        </div>
    );
    };

    export default EditEvent;
