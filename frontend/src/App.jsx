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

  const showcaseImages = [
    "/image/event1.jpg",
    "/image/event2.jpg",
    "/image/event3.jpg",
    "/image/event4.jpg",
    "/image/event5.jpg",
  ];

  const soldOutCount = events.filter((event) => event.availableSeats === 0).length;
  const totalOpenSeats = events.reduce((sum, event) => sum + Number(event.availableSeats || 0), 0);

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
        <div className="nav-title-wrap">
          <h1 className="nav-title">Pulse Events</h1>
          <p className="nav-subtitle">Creator gatherings, concerts, workshops, and festivals</p>
        </div>
        <div className="nav-actions">
          {currentUser.role === "admin" && (
            <button className="admin-btn" onClick={() => setPage("admin")}>
              Admin Studio
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
          style={{
            backgroundImage: `linear-gradient(rgba(2, 6, 23, 0.76), rgba(67, 15, 124, 0.56)), url(${bannerImageUrl || "/image/eventbanner.jpg"})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="hero-content">
            <p className="hero-chip">UPCOMING EVENTS</p>
            <h2>THE CREATOR GATHERING EXPERIENCE</h2>
            <p>
              Discover premium live experiences, reserve your seats, and manage every
              booking from one professional dashboard.
            </p>
            <div className="hero-metrics">
              <div className="hero-metric-card">
                <p className="hero-metric-value">{events.length}</p>
                <p className="hero-metric-label">Upcoming Events</p>
              </div>
              <div className="hero-metric-card">
                <p className="hero-metric-value">{totalOpenSeats}</p>
                <p className="hero-metric-label">Open Seats</p>
              </div>
              <div className="hero-metric-card">
                <p className="hero-metric-value">{myBookings.length}</p>
                <p className="hero-metric-label">My Bookings</p>
              </div>
              <div className="hero-metric-card">
                <p className="hero-metric-value">{soldOutCount}</p>
                <p className="hero-metric-label">Sold Out</p>
              </div>
            </div>
          </div>
        </section>

        <section className="ticker-strip" aria-label="cities ticker">
          <div className="ticker-track">
            <span>BUY TICKETS</span>
            <span>COLOMBO</span>
            <span>SINGAPORE</span>
            <span>DUBAI</span>
            <span>LONDON</span>
            <span>BANGALORE</span>
            <span>BUY TICKETS</span>
            <span>COLOMBO</span>
            <span>SINGAPORE</span>
            <span>DUBAI</span>
            <span>LONDON</span>
            <span>BANGALORE</span>
          </div>
        </section>

        <section className="content-section">
          <div className="section-heading-row">
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-subtitle">Tap any card to reserve your seat instantly</p>
          </div>

          {events.length === 0 ? (
            <p className="empty-msg">No events available. Check back later!</p>
          ) : (
            <div className="events-grid">
              {events.map((event, index) => (
                <EventCard
                  key={event._id}
                  event={event}
                  fallbackImage={showcaseImages[index % showcaseImages.length]}
                  onBook={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="kpi-showcase">
          <h3>WORLD'S TOP CREATORS GATHERING</h3>
          <div className="kpi-grid">
            <article>
              <strong>120+</strong>
              <span>Speakers</span>
            </article>
            <article>
              <strong>40+</strong>
              <span>Traffic Sources</span>
            </article>
            <article>
              <strong>160+</strong>
              <span>Advertisers</span>
            </article>
            <article>
              <strong>110+</strong>
              <span>Countries</span>
            </article>
            <article>
              <strong>16,209+</strong>
              <span>Attendees</span>
            </article>
          </div>
        </section>

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

        <section className="content-section">
          <div className="section-heading-row">
            <h2 className="section-title">My Bookings</h2>
            <p className="section-subtitle">Manage your reservations in one place</p>
          </div>
          <BookingList bookings={myBookings} refreshBookings={fetchBookings} />
        </section>

        <section className="content-section">
          <EventReviews events={events} currentUser={currentUser} />
        </section>

      </main>

      <footer className="site-footer">
        <p>Pulse Events Platform</p>
        <p>{new Date().getFullYear()} All rights reserved.</p>
      </footer>

    </div>
  );
}

export default App;