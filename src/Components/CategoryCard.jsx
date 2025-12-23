    import { useNavigate } from "react-router-dom";
    import {
    Cake,
    Heart,
    GraduationCap,
    PartyPopper,
    Baby,
    Briefcase,
    } from "lucide-react";

    import "../Styles/CategoryCard.css";

    const categories = [
    {
        name: "Birthday",
        slug: "birthday",
        icon: Cake,
    },
    {
        name: "Wedding",
        slug: "wedding",
        icon: Heart,
    },
    {
        name: "Graduation",
        slug: "graduation",
        icon: GraduationCap,
    },
    {
        name: "Party",
        slug: "party",
        icon: PartyPopper,
    },
    {
        name: "Baby Shower",
        slug: "baby-shower",
        icon: Baby,
    },
    {
        name: "Corporate",
        slug: "corporate",
        icon: Briefcase,
    },
    ];

    const CategoryCard = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (slug) => {
        navigate(`/explore?category=${slug}`);
    };

    return (
        <div className="main-wrapper">
        <h3 className="section-title">Explore Categories</h3>

        <div className="category-wrapper">
            {categories.map((cat) => {
            const Icon = cat.icon;

            return (
                <div
                key={cat.slug}
                className="category-item"
                onClick={() => handleCategoryClick(cat.slug)}
                >
                <div className="category-circle">
                    <Icon />
                </div>
                <span className="category-text">{cat.name}</span>
                </div>
            );
            })}

            {/* See More */}
            <div
            className="category-item"
            onClick={() => navigate("/explore")}
            >
            <div className="category-circle see-more">
                →
            </div>
            <span className="category-text">See More</span>
            </div>
        </div>
        </div>
    );
    };

    export default CategoryCard;
