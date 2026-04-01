import React, { useEffect, useRef, useState } from "react";
import EventCard from "./components/EventCard";
import BookingModal from "./components/BookingModal";
import BookingList from "./components/BookingList";
import AdminPage from "./components/AdminPage";
import AuthPage from "./components/AuthPage";
import EventReviews from "./components/EventReviews";
import ProfilePage from "./components/ProfilePage";
import { getBannerImage, getBookings } from "./services/bookingService";
import { getEvents } from "./services/eventService";
import {
  clearAuthSession,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  saveAuthSession,
  setAccessToken,
  setRefreshToken,
} from "./services/authStorage";
import {
  getMyProfile,
  logoutUser,
  refreshAccessToken,
} from "./services/userService";
import {
  BOOKING_SERVICE_DEPLOYED,
  EVENT_SERVICE_DEPLOYED,
  REVIEW_SERVICE_DEPLOYED,
} from "./config/deployedServices";
import "./App.css";

/** API may return a raw array or a wrapped payload { data: [...] }; proxies may vary. */
function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object" && Array.isArray(value.data)) return value.data;
  return [];
}

function App() {

  const [page, setPage] = useState("home");
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const userMenuRef = useRef(null);

  // TODO: When EVENT_SERVICE_DEPLOYED — enable fetch + events UI (deployedServices.js)
  const fetchEvents = async () => {
    if (!EVENT_SERVICE_DEPLOYED) return;
    try {
      const response = await getEvents();
      setEvents(asArray(response?.data));
    } catch (error) {
      console.error("Failed to fetch events", error);
    }
  };

  // TODO: When BOOKING_SERVICE_DEPLOYED — enable fetch + bookings UI (deployedServices.js)
  const fetchBookings = async () => {
    if (!BOOKING_SERVICE_DEPLOYED) return;
    try {
      const response = await getBookings();
      setBookings(asArray(response?.data));
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  // TODO: When BOOKING_SERVICE_DEPLOYED — banner uses booking-service (deployedServices.js)
  const fetchBanner = async () => {
    if (!BOOKING_SERVICE_DEPLOYED) return;
    try {
      const response = await getBannerImage();
      setBannerImageUrl(response.data.imageUrl || "");
    } catch (error) {
      console.error("Failed to fetch banner", error);
    }
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedUser = getStoredUser();
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!storedUser || !accessToken) {
        setAuthReady(true);
        return;
      }

      try {
        const profileResponse = await getMyProfile();
        const profile = profileResponse?.data?.data;

        if (profile) {
          setCurrentUser(profile);
          saveAuthSession(profile);
        }
      } catch (_profileError) {
        if (!refreshToken) {
          clearAuthSession();
          setCurrentUser(null);
          setAuthReady(true);
          return;
        }

        try {
          const refreshedTokens = await refreshAccessToken(refreshToken);
          setAccessToken(refreshedTokens.accessToken);
          setRefreshToken(refreshedTokens.refreshToken);

          const profileResponse = await getMyProfile();
          const profile = profileResponse?.data?.data;

          if (profile) {
            setCurrentUser(profile);
            saveAuthSession(profile);
          }
        } catch (_refreshError) {
          clearAuthSession();
          setCurrentUser(null);
        }
      }

      setAuthReady(true);
    };

    bootstrapAuth();
    fetchEvents();
    fetchBanner();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setBookings([]);
      return;
    }

    if (BOOKING_SERVICE_DEPLOYED) {
      fetchBookings();
    }
  }, [currentUser]);

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
    const normalizedUser = {
      ...user,
      id: user.id || user._id,
      _id: user._id || user.id,
    };
    setCurrentUser(normalizedUser);
    saveAuthSession(normalizedUser);
  };

  const handleLogout = async () => {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      try {
        await logoutUser(refreshToken);
      } catch (_error) {
      }
    }

    setCurrentUser(null);
    setPage("home");
    clearAuthSession();
  };

  const eventList = asArray(events);
  // Booking service already scopes GET /api/bookings to the logged-in user (or all for admin).
  // Do not filter again here — strict equality on userId vs profile id/_id often drops valid rows.
  const myBookings = currentUser ? asArray(bookings) : [];

  const showcaseImages = [
    "/image/event1.jpg",
    "/image/event2.jpg",
    "/image/event3.jpg",
    "/image/event4.jpg",
    "/image/event5.jpg",
  ];

  const soldOutCount = eventList.filter((event) => event.availableSeats === 0).length;
  const totalOpenSeats = eventList.reduce((sum, event) => sum + Number(event.availableSeats || 0), 0);

  if (!authReady) {
    return <div className="app"><main className="main-content"><p>Loading session...</p></main></div>;
  }

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

  if (page === "profile") {
    return (
      <div className="app">
        <nav className="navbar">
          <div className="nav-title-wrap">
            <h1 className="nav-title">Pulse Events</h1>
            <p className="nav-subtitle">Creator gatherings, concerts, workshops, and festivals</p>
          </div>
          <div className="nav-actions">
            <button className="back-btn" onClick={() => setPage("home")}>Back to Home</button>
          </div>
        </nav>

        <ProfilePage
          currentUser={currentUser}
          onBack={() => setPage("home")}
          onUserUpdated={(updatedUser) => {
            setCurrentUser(updatedUser);
            saveAuthSession(updatedUser);
          }}
          onDeleted={() => {
            setCurrentUser(null);
            setPage("home");
            alert("Your account has been deleted");
          }}
        />
      </div>
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
                <button className="admin-btn" onClick={() => {
                  setPage("profile");
                  setIsUserMenuOpen(false);
                }}>
                  Profile
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">

        {(!EVENT_SERVICE_DEPLOYED || !BOOKING_SERVICE_DEPLOYED || !REVIEW_SERVICE_DEPLOYED) && (
          <p className="deploy-banner" role="status">
            Some features are off until microservices are deployed — see{" "}
            <code>src/config/deployedServices.js</code> and service URL env variables.
          </p>
        )}

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
                <p className="hero-metric-value">{eventList.length}</p>
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

          {!EVENT_SERVICE_DEPLOYED ? (
            <p className="empty-msg">
              Event listings are disabled until the event service URL is configured.
            </p>
          ) : eventList.length === 0 ? (
            <p className="empty-msg">No events available. Check back later!</p>
          ) : (
            <div className="events-grid">
              {eventList.map((event, index) => (
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

        {EVENT_SERVICE_DEPLOYED && BOOKING_SERVICE_DEPLOYED && selectedEvent && (
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
          {!BOOKING_SERVICE_DEPLOYED ? (
            <p className="empty-msg">
              Bookings are disabled until the booking service URL is configured.
            </p>
          ) : (
            <BookingList bookings={myBookings} refreshBookings={fetchBookings} />
          )}
        </section>

        {EVENT_SERVICE_DEPLOYED && REVIEW_SERVICE_DEPLOYED && (
          <section className="content-section">
            <EventReviews events={eventList} currentUser={currentUser} />
          </section>
        )}

      </main>

      <footer className="site-footer">
        <p>Pulse Events Platform</p>
        <p>{new Date().getFullYear()} All rights reserved.</p>
      </footer>

    </div>
  );
}

export default App;