    import "../Styles/HowItWorks.css";

    const HowItWorks = () => {
    return (
        <section className="how-it-works">
        <h3>How InviteWave Works</h3>

        <div className="steps">
            <div className="step">
            <span>1</span>
            <p>Create your event</p>
            </div>

            <div className="step">
            <span>2</span>
            <p>Share your invite link</p>
            </div>  

            <div className="step">
            <span>3</span>
            <p>Guests RSVP & attend</p>
            </div>
        </div>
        </section>
    );
    };

    export default HowItWorks;
