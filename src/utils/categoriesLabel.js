    import categories from "../utils/categories";

    export const getCategoriesLabel = (slug) => {
    if (!slug) return "";
    const clean = slug.toLowerCase();

    // if old data mistakenly saved plural, normalize it
    const normalized = clean.endsWith("s") ? clean.slice(0, -1) : clean;

    const match = categories.find((c) => c.slug === normalized);
    if (match) return match.name;

    // fallback: convert "baby-shower" => "Baby Shower"
    return normalized
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    };
