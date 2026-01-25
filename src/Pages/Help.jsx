        import { useMemo, useState } from "react";
        import BackButton from "../Components/BackButton";
        import { alertInfo } from "../utils/alert";
        import "../Styles/Help.css";

        const Help = () => {
        const [query, setQuery] = useState("");

        const faqs = useMemo(
            () => [
            {
                q: "How do I create an event?",
                a: "Login first, then go to Create Event. Fill in the title, category, date/time, location, and submit.",
            },
            {
                q: "How do I share my event?",
                a: "Open the event details page and use Copy Link, WhatsApp, or X sharing buttons.",
            },
            {
                q: "Can I edit or delete my event?",
                a: "Yes. Only the event owner can edit or delete. Open your event and you’ll see Edit / Delete buttons.",
            },
            {
                q: "How does RSVP work?",
                a: "Guests can select Yes/Maybe/No. RSVP counts update in Firestore (global counts).",
            },
            {
                q: "What does a Private event mean?",
                a: "Private events still appear in Explore, but guests must enter the invite code before they can view full event details.",
            },
            {
                q: "Why does my InviteWave link sometimes show 404 on Vercel?",
                a: "InviteWave is a single-page app (SPA). If someone opens a deep link like /event/123 directly, Vercel may look for a real folder/file and show 404. This is fixed by adding a rewrite so all routes load the app.",
            },
            ],
            []
        );

        const filtered = useMemo(() => {
            if (!query.trim()) return faqs;
            const q = query.toLowerCase();
            return faqs.filter(
            (item) =>
                item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
            );
        }, [query, faqs]);

        return (
            <div className="container help-page">
            <BackButton />

            <h1 className="help-title">Help Center</h1>
            <p className="help-subtitle">
                Learn how to use InviteWave, troubleshoot issues, and contact support.
            </p>

            {/* SEARCH */}
            <div className="help-search">
                <input
                className="help-input"
                placeholder="Search help topics..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {/* TOP GRID */}
            <div className="help-grid">
                <div className="help-card">
                <h3>Quick Start</h3>
                <ol>
                    <li>Sign up / Login</li>
                    <li>Create your event</li>
                    <li>Choose Public or Private</li>
                    <li>Share your invite link</li>
                    <li>Guests RSVP</li>
                    <li>Edit or delete anytime</li>
                </ol>
                </div>

                <div className="help-card">
                <h3>Contact Support</h3>
                <p>Email us and include a screenshot if possible.</p>

                <a
                    className="help-email"
                    href="mailto:invitewavehq@gmail.com?subject=InviteWave%20Support"
                >
                    invitewavehq@gmail.com
                </a>

                <p className="help-note">
                    Response time: within 24–72 hours (depending on volume).
                </p>
                </div>
            </div>

            {/* ✅ COMMUNITY GUIDELINES (OPTION 1) */}
            <div className="help-guidelines">
                <h2>Community Guidelines</h2>
                <p className="help-muted">
                InviteWave is built for real events and real people. To keep everyone
                safe, please follow these rules:
                </p>

                <ul className="guidelines-list">
                <li>
                    <strong>Be honest:</strong> Don’t post fake events, misleading
                    details, or scam invites.
                </li>
                <li>
                    <strong>No illegal content:</strong> Events must follow local laws
                    and regulations.
                </li>
                <li>
                    <strong>No harassment or hate:</strong> Discrimination, threats, or
                    hateful content is not allowed.
                </li>
                <li>
                    <strong>No explicit content:</strong> Avoid adult or sexual content
                    in titles, descriptions, or images.
                </li>
                <li>
                    <strong>Respect privacy:</strong> Don’t share private invite codes
                    publicly. Private events are for invited guests only.
                </li>
                <li>
                    <strong>No spam:</strong> Don’t repeatedly create events to promote
                    unrelated links or services.
                </li>
                <li>
                    <strong>Safety first:</strong> If your event involves meeting in
                    person, choose public locations and share responsibly.
                </li>
                </ul>

                <p className="help-note">
                If an event breaks these rules, InviteWave may remove the event and
                restrict the account. For urgent issues, email support.
                </p>
            </div>

            {/* FAQS */}
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
            </div>
        );
        };

        export default Help;
