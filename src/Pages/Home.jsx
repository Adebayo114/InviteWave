    import { useState } from "react";
    import { useNavigate } from "react-router-dom";

    import Carousel from "../Components/Carousel";
    import SearchBar from "../Components/SearchBar";
    import CategoryCard from "../Components/CategoryCard";
    import HowItWorks from "../Components/HowItWorks";
    import FeaturedEvents from "../Components/FeaturedEvents";
    import ExploreCTA from "../Components/ExploreCTA";
    import { alertInfo } from "../utils/alert";

    import "../Styles/HomeSb.css";

    const Home = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/explore?search=${encodeURIComponent(query)}`);
    };

    return (
        <>
        <Carousel />

        {/* SEARCH */}
        <section className="search-section">
            <form onSubmit={handleSearch} className="home-search-form">
            <SearchBar value={query} onChange={setQuery} />
            <button type="submit" className="home-search-btn">
                Search
            </button>
            </form>
        </section>

        {/* CATEGORIES */}
        <section className="category-section container">
            <CategoryCard />
        </section>

        {/* HOW IT WORKS */}
        <HowItWorks />

        {/* FEATURED EVENTS */}
        <FeaturedEvents />

                {/* UPGRADE CTA */}
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


        {/* CTA */}
        <ExploreCTA />
        </>
    );
    };

    export default Home;
