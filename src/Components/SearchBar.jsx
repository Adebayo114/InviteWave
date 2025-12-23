    import "../Styles/SearchBar.css";

    const SearchBar = ({ value, onChange }) => {
    return (
        <div className="search-bar">
        <input
            type="text"
            placeholder="Search by event, location, or host..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />

        {value && (
            <button
            className="clear-btn"
            onClick={() => onChange("")}
            aria-label="Clear search"
            >
            ×
            </button>
        )}
        </div>
    );
    };

    export default SearchBar;
