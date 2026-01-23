    import { useMemo, useState } from "react";
    import BackButton from "../Components/BackButton";
    import "../Styles/Help.css";

    const Help = () => {
    const [query, setQuery] = useState("");

    const faqs = useMemo(
        () => [
        {
            q: "How do I create an event?",
            a: "Login, then go to Create Event. Fill in title, category, date/time, location, and submit.",
        },
        {
            q: "How do I share my event?",
            a: "Open the event details page and use Copy Link or WhatsApp/X sharing buttons.",
        },
        {
            q: "Can I edit or delete my event?",
            a: "Yes. Only the event owner can edit or delete. Open your event → Edit or Delete buttons appear for you.",
        },
        {
            q: "How does RSVP work?",
            a: "Guests can select Yes/Maybe/No. RSVP counts update in Firestore (global counts).",
        },
        {
            q: `Why does my InviteWave link sometimes show 404 on Vercel?`,
            a: `InviteWave is a single-page app (SPA). If someone opens a deep link like /event/123 directly, Vercel may try to find a real folder/file called /event/123 and return 404.`,
        },
        ],
        []
    );

    const filtered = useMemo(() => {
        if (!query.trim()) return faqs;
        const q = query.toLowerCase();
        return faqs.filter(
        (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
        );
    }, [query, faqs]);

    return (
        <div className="container help-page">
        <BackButton />
        <h1 className="help-title">Help Center</h1>
        <p className="help-subtitle">
            Learn how to use InviteWave, troubleshoot issues, and contact support.
        </p>

        <div className="help-search">
            <input
            className="help-input"
            placeholder="Search help topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            />
        </div>

        <div className="help-grid">
            <div className="help-card">
            <h3>Quick Start</h3>
            <ol>
                <li>Sign up / Login</li>
                <li>Create your event</li>
                <li>Share your invite link</li>
                <li>Guests RSVP</li>
                <li>Edit or delete anytime</li>
            </ol>
            </div>

            <div className="help-card">
            <h3>Contact Support</h3>
            <p>Email us and include a screenshot if possible.</p>

            <a className="help-email" href="mailto:invitewavehq@gmail.com?subject=InviteWave%20Support">
                invitewavehq@gmail.com
            </a>

            <p className="help-note">
                Response time: within 24–72 hours (depending on volume).
            </p>
            </div>
        </div>

        <div className="help-faq">
            <h2>FAQs</h2>
            {filtered.length === 0 ? (
            <p className="help-muted">No results found.</p>
            ) : (
            filtered.map((item, idx) => (
                <details key={idx} className="faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
                </details>
            ))
            )}
        </div>
        </div>
    );
    };

    export default Help;
