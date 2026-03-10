import React, { useEffect, useRef, useState } from "react";
import EventCard from "./components/EventCard";
import BookingModal from "./components/BookingModal";
import BookingList from "./components/BookingList";
import AdminPage from "./components/AdminPage";
import AuthPage from "./components/AuthPage";
import EventReviews from "./components/EventReviews";
import { getBannerImage, getBookings } from "./services/bookingService";
import { getEvents } from "./services/eventService";
import "./App.css";

function App() {

  const [page, setPage] = useState("home");
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const userMenuRef = useRef(null);

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

  const fetchBanner = async () => {
    try {
      const response = await getBannerImage();
      setBannerImageUrl(response.data.imageUrl || "");
    } catch (error) {
      console.error("Failed to fetch banner", error);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    fetchEvents();
    fetchBookings();
    fetchBanner();
  }, []);

  useEffect(() => {
    const closeMenuOnOutsideClick = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeMenuOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", closeMenuOnOutsideClick);
    };
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
          fetchBanner();
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

          <div className="user-menu" ref={userMenuRef}>
            <button
              className="user-icon-btn"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
            >
              {currentUser.name?.charAt(0).toUpperCase() || "U"}
            </button>

            {isUserMenuOpen && (
              <div className="user-dropdown">
                <p className="user-dropdown-name">{currentUser.name}</p>
                <p className="user-dropdown-email">{currentUser.email}</p>
                <p className="user-dropdown-role">Role: {currentUser.role}</p>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">

        <section
          className="hero-banner"
          style={bannerImageUrl ? {
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.58), rgba(59, 12, 84, 0.48)), url(${bannerImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          } : undefined}
        >
          <div className="hero-content">
            <p className="hero-chip">Live Events Platform</p>
            <h2>Discover, Book, and Review Your Favorite Experiences</h2>
            <p>
              Browse upcoming events, reserve seats instantly, and share feedback
              with other attendees.
            </p>
          </div>
        </section>

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

      <footer className="site-footer">
        <p>Event Booking System</p>
        <p>{new Date().getFullYear()} All rights reserved.</p>
      </footer>

    </div>
  );
}

export default App;