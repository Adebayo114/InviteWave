    // components/Carousel.jsx
    import React from "react";
    import slide1 from "../assets/Cimages/Cimage1.webp";
    import slide2 from "../assets/Cimages/Cimage2.webp"; 
    import slide3 from "../assets/Cimages/Cimage3.webp";
    import { Link } from "react-router-dom";
    import "../Styles/Carousel.css";

    const Carousel = () => {
    return (
        <div
        id="eventCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        >
        <div className="carousel-inner event-carousel">

            <div className="carousel-item active">
            <img
                src={slide1}
                className="d-block w-100 carousel-img"
                alt="Event 1"
            />

            {/* OVERLAY */}
            <div className="carousel-overlay">
                <h1>Create & Discover Amazing Events</h1>
                <p>Plan birthdays, weddings, parties & more</p>
                <Link to="/explore">
                <button className="btn btn-primary">
                Explore Events
                </button>
                </Link>
            </div>
            </div>

            <div className="carousel-item">
            <img
                src={slide2}
                className="d-block w-100 carousel-img"
                alt="Event 2"
            />

            <div className="carousel-overlay">
                <h1>Your Events, Your Moments</h1>
                <p>Create memories that last forever</p>
                <Link to="/create-event"><button className="btn btn-primary">
                Create Event
                </button></Link>
            </div>
            </div>

            <div className="carousel-item">
            <img
                src={slide3}
                className="d-block w-100 carousel-img"
                alt="Event 3"
            />

            <div className="carousel-overlay">
                <h1>One Link. One Invite.</h1>
                <p>Share your event with ease</p>
                <Link to="/create-event"><button className="btn btn-primary">
                Get Started
                </button></Link>
            </div>
            </div>

        </div>

        <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#eventCarousel"
            data-bs-slide="prev"
        >
            <span className="carousel-control-prev-icon"></span>
        </button>

        <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#eventCarousel"
            data-bs-slide="next"
        >
            <span className="carousel-control-next-icon"></span>
        </button>
        </div>
    );
    };

    export default Carousel;
