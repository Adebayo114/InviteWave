    import { useSearchParams, useNavigate } from "react-router-dom";
    import { useState } from "react";

    import BackButton from "../Components/BackButton";
    import SearchBar from "../Components/SearchBar";
    import ExploreCategoryGrid from "../Components/ExploreCategoryGrid";
    import FeaturedEvents from "../Components/FeaturedEvents";
    import HowItWorks from "../Components/HowItWorks";
    import ExploreCTA from "../Components/ExploreCTA";
    import "../Styles/noevents.css";

    import { getEvents } from "../utils/data";


    const Explore = () => {
        const events = getEvents();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const category = searchParams.get("category");
    const searchFromUrl = searchParams.get("search") || "";

    const [searchQuery, setSearchQuery] = useState(searchFromUrl);

    const filteredEvents = events.filter((event) => {
        const matchesCategory = category
        ? event.category === category
        : true;

        const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.host.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="container">
        <BackButton />

        {/* NO CATEGORY & NO SEARCH → SHOW DISCOVERY CONTENT */}
        {!category && !searchFromUrl && (
            <>
            <h2 className="fw-bold">Explore Categories</h2>
            <ExploreCategoryGrid />
            <FeaturedEvents />
            <HowItWorks />
            <ExploreCTA />
            </>
        )}

        {/* CATEGORY OR SEARCH ACTIVE → SHOW RESULTS */}
        {(category || searchFromUrl) && (
            <>
            <h2 className="fw-bold">
                {category ? `${category} events` : "Search results"}
            </h2>

            <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
            />

            {filteredEvents.length === 0 ? (
                <p className="no-events">No events found.</p>
            ) : (
                <div className="event-grid">
                {filteredEvents.map((event) => (
                    <div
                    key={event.id}
                    className="event-card"
                    onClick={() => navigate(`/event/${event.id}`)}
                    >
                    <h4>{event.title}</h4>
                    <p>{event.location}</p>
                    <small>Hosted by {event.host}</small>
                    </div>
                ))}
                </div>
            )}
            </>
        )}
        </div>
    );
    };

    export default Explore;
