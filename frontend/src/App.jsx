import React, { useEffect, useState } from "react";
import EventCard from "./components/EventCard";
import BookingModal from "./components/BookingModal";
import BookingList from "./components/BookingList";
import AdminPage from "./components/AdminPage";
import AuthPage from "./components/AuthPage";
import EventReviews from "./components/EventReviews";
import { getBookings } from "./services/bookingService";
import { getEvents } from "./services/eventService";
import "./App.css";

function App() {

  const [page, setPage] = useState("home");
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await getBookings();
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    fetchEvents();
    fetchBookings();
  }, []);

  const handleAuthenticated = (user) => {
    setCurrentUser(user);
    localStorage.setItem("currentUser", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("home");
    localStorage.removeItem("currentUser");
  };

  const myBookings = currentUser
    ? bookings.filter((booking) => booking.userId === currentUser._id)
    : [];

  if (!currentUser) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  if (page === "admin" && currentUser.role === "admin") {
    return (
      <AdminPage
        currentUser={currentUser}
        onBack={() => {
          setPage("home");
          fetchEvents();
          fetchBookings();
        }}
      />
    );
  }

  return (
    <div className="app">

      <nav className="navbar">
        <h1 className="nav-title">Event Booking System</h1>
        <div className="nav-actions">
          {currentUser.role === "admin" && (
            <button className="admin-btn" onClick={() => setPage("admin")}>
              Admin
            </button>
          )}
          <button className="back-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="main-content">

        <h2 className="section-title">Upcoming Events</h2>

        {events.length === 0 ? (
          <p className="empty-msg">No events available. Check back later!</p>
        ) : (
          <div className="events-grid">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onBook={() => setSelectedEvent(event)}
              />
            ))}
          </div>
        )}

        {selectedEvent && (
          <BookingModal
            event={selectedEvent}
            currentUser={currentUser}
            onClose={() => setSelectedEvent(null)}
            onBooked={() => {
              setSelectedEvent(null);
              fetchBookings();
              fetchEvents();
            }}
          />
        )}

        <h2 className="section-title">My Bookings</h2>
        <BookingList bookings={myBookings} refreshBookings={fetchBookings} />

        <EventReviews events={events} currentUser={currentUser} />

      </main>

    </div>
  );
}

export default App;