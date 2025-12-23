    import { useNavigate } from "react-router-dom";
    import categories from "../utils/categories";
    import "../Styles/ExploreCategoryGrid.css";

    const ExploreCategoryGrid = () => {
    const navigate = useNavigate();

    return (
        <div className="explore-category-wrapper">
        {categories.map((cat) => {
            const Icon = cat.icon;

            return (
            <div
                key={cat.slug}
                className="explore-category-item"
                onClick={() => navigate(`/explore?category=${cat.slug}`)}
            >
                <div className="explore-category-circle">
                <Icon />
                </div>
                <span>{cat.name}</span>
            </div>
            );
        })}
        </div>
    );
    };

    export default ExploreCategoryGrid;
