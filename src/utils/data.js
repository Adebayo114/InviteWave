    const defaultEvents = [
    {
        id: 1,
        title: "Corporate Meetup 2025",
        category: "corporate",
        location: "Indianapolis, IN",
        host: "Indy Tech Group",
        date: "March 12, 2025",
        time: "5:00 PM",
        description: "A networking meetup for tech professionals.",
        featured: true,
    },
    ];

    export const getEvents = () => {
    const storedEvents = JSON.parse(localStorage.getItem("events"));
    return storedEvents && storedEvents.length ? storedEvents : defaultEvents;
    };
