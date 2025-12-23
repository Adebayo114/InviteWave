    import React from "react";
    import { Routes, Route } from "react-router-dom";

    import Home from "./Pages/Home";
    import Explore from "./Pages/Explore";
    import CreateEvent from "./Pages/CreateEvents";
    import EventDetails from "./Pages/EventDetails";
    import Login from "./Pages/Login";
    import Signup from "./Pages/Signup";
    import MyEvents from "./Pages/MyEvents";
    import EditEvent from "./Pages/EditEvent";
    import About from "./Pages/About";

    import ProtectedRoute from "./Components/ProtectedRoute";

    export default function RoutesComponent() {
    return (
        <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES */}
        <Route
            path="/create-event"
            element={
            <ProtectedRoute>
                <CreateEvent />
            </ProtectedRoute>
            }
        />

        <Route
            path="/my-events"
            element={
            <ProtectedRoute>
                <MyEvents />
            </ProtectedRoute>
            }
        />

        <Route
            path="/edit-event/:id"
            element={
            <ProtectedRoute>
                <EditEvent />
            </ProtectedRoute>
            }
        />
        </Routes>
    );
    }
