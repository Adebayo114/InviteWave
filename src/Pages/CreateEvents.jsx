    import { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import BackButton from "../Components/BackButton";
    import { getAuthUser } from "../utils/auth";

    import "../Styles/CreateEvents.css";

    const CreateEvents = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        location: "",
        mapUrl: "",
        date: "",
        time: "",      // start time
        endTime: "",   // end time
        description: "",
    });
    

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.title || !formData.category || !formData.location) {
        alert("Please fill in required fields");
        return;
        }

        // Validate end time (only if both are set)
        if (formData.time && formData.endTime && formData.endTime <= formData.time) {
        alert("End time must be after start time");
        return;
        }

        const user = getAuthUser();

        const newEvent = {
        id: Date.now(),
        ...formData,
        host: user.name,
        userId: user.id,
        featured: false,
        createdAt: new Date().toISOString(),
        };


        const existingEvents = JSON.parse(localStorage.getItem("events")) || [];

        localStorage.setItem(
        "events",
        JSON.stringify([newEvent, ...existingEvents])
        );

        const myEventIds = JSON.parse(localStorage.getItem("myEventIds")) || [];
        localStorage.setItem(
        "myEventIds",
        JSON.stringify([newEvent.id, ...myEventIds])
        );

        navigate(`/event/${newEvent.id}`);

        
    };

    
    return (
        
        <div className="container create-event">
            <BackButton />
        <h1>Create Event</h1>

        <form onSubmit={handleSubmit} className="event-form">
            {/* TITLE */}
            <input
            type="text"
            name="title"
            placeholder="Event title"
            value={formData.title}
            onChange={handleChange}
            />

            {/* CATEGORY */}
            <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            >
            <option value="">Select category</option>
            <option value="birthday">Birthday</option>
            <option value="wedding">Wedding</option>
            <option value="graduation">Graduation</option>
            <option value="party">Party</option>
            <option value="corporate">Corporate</option>
            </select>

            {/* DATE */}
            <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            />

            {/* TIME SECTION */}
            <div className="time-row">
            <div className="time-field">
                <label className="time-label">Start Time</label>
                <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                />
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

            {/* LOCATION */}
            <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            />

            {/* MAP URL */}
            <input
            type="url"
            name="mapUrl"
            placeholder="Google Maps link (optional)"
            value={formData.mapUrl}
            onChange={handleChange}
            />

            {/* DESCRIPTION */}
            <textarea
            name="description"
            placeholder="Event description"
            value={formData.description}
            onChange={handleChange}
            />

            <button type="submit">Create Event</button>
        </form>
        </div>
    );
    };

    export default CreateEvents;
