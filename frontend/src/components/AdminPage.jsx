import React, { useEffect, useState } from "react";
import {
  createEvent,
  deleteEvent,
  getEvents,
  uploadEventImage,
} from "../services/eventService";
import {
  deleteBooking,
  getBannerImage,
  getBookings,
  updateBannerImage,
  uploadBannerImage,
} from "../services/bookingService";
import { deleteReview, getReviews } from "../services/reviewService";
import { getUsers, updateUser } from "../services/userService";

function AdminPage({ onBack }) {
  const [activeService, setActiveService] = useState("events");
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [eventFile, setEventFile] = useState(null);
  const [eventPreview, setEventPreview] = useState("");
  const [editingUserId, setEditingUserId] = useState("");
  const [editingName, setEditingName] = useState("");
  const [editingEmail, setEditingEmail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    const response = await getEvents();
    setEvents(response.data);
  };

  const fetchBookings = async () => {
    const response = await getBookings();
    setBookings(response.data);
  };

  const fetchUsers = async () => {
    const response = await getUsers();
    setUsers(response.data);
  };

  const fetchReviews = async () => {
    const response = await getReviews();
    setReviews(response.data);
  };

  const fetchBanner = async () => {
    const response = await getBannerImage();
    setBannerImageUrl(response.data.imageUrl || "");
  };

  useEffect(() => {
    fetchEvents();
    fetchBookings();
    fetchUsers();
    fetchReviews();
    fetchBanner();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (eventFile) {
        const uploadResponse = await uploadEventImage(eventFile, "ctse-events/events");
        imageUrl = uploadResponse.data.imageUrl;
      }

      await createEvent({
        title,
        description,
        date,
        location,
        totalSeats: Number(totalSeats),
        imageUrl,
      });

      setTitle("");
      setDescription("");
      setDate("");
      setLocation("");
      setTotalSeats("");
      setEventFile(null);
      setEventPreview("");
      await fetchEvents();
      alert("Event created successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create event");
    }

    setLoading(false);
  };

  const handleBannerUpload = async () => {
    if (!bannerFile) {
      alert("Select a banner image first");
      return;
    }

    try {
      const uploadResponse = await uploadBannerImage(bannerFile);
      await updateBannerImage(uploadResponse.data.imageUrl);
      await fetchBanner();
      setBannerFile(null);
      alert("Banner updated successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to upload banner");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) {
      return;
    }

    await deleteEvent(id);
    fetchEvents();
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) {
      return;
    }

    await deleteBooking(id);
    fetchBookings();
    fetchEvents();
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) {
      return;
    }

    await deleteReview(id);
    fetchReviews();
  };

  const startEditUser = (user) => {
    setEditingUserId(user._id);
    setEditingName(user.name);
    setEditingEmail(user.email);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();

    await updateUser(editingUserId, {
      name: editingName,
      email: editingEmail,
    });

    setEditingUserId("");
    setEditingName("");
    setEditingEmail("");
    fetchUsers();
  };

  const findUser = (userId) => users.find((user) => user._id === userId);
  const findEvent = (eventId) => events.find((event) => event._id === eventId);

  const renderEventsSection = () => (
    <div className="service-panel">
      <div className="service-header-row">
        <h2>Event Service</h2>
        <span>{events.length} events</span>
      </div>

      <div className="admin-grid">
        <div>
          <form className="admin-form" onSubmit={handleCreateEvent}>
            <label>Event Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />

            <label>Description</label>
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />

            <label>Date & Time</label>
            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />

            <label>Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} required />

            <label>Total Seats</label>
            <input type="number" min="1" value={totalSeats} onChange={(e) => setTotalSeats(e.target.value)} required />

            <label>Event Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setEventFile(file || null);
                setEventPreview(file ? URL.createObjectURL(file) : "");
              }}
            />

            {eventPreview && <img className="upload-preview" src={eventPreview} alt="Event preview" />}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </button>
          </form>

        </div>

        <div>
          <ul className="admin-event-list">
            {events.map((event) => (
              <li key={event._id} className="admin-event-item card-stack">
                {event.imageUrl && <img className="event-admin-thumb" src={event.imageUrl} alt={event.title} />}
                <div>
                  <strong>{event.title}</strong>
                  <p>{event.location} | {new Date(event.date).toLocaleDateString()}</p>
                  <p>{event.availableSeats} / {event.totalSeats} seats available</p>
                </div>
                <button className="delete-btn" onClick={() => handleDeleteEvent(event._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderBookingsSection = () => (
    <div className="service-panel">
      <div className="service-header-row">
        <h2>Booking Service</h2>
        <span>{bookings.length} bookings</span>
      </div>
      <div className="bookings-section">
        <div className="admin-form banner-panel">
          <label>Home Banner Image</label>
          <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
          {bannerImageUrl && <img className="upload-preview banner-preview" src={bannerImageUrl} alt="Banner preview" />}
          <button type="button" className="submit-btn" onClick={handleBannerUpload}>Upload Banner</button>
        </div>

        <table className="booking-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Event</th>
              <th>Seats</th>
              <th>Seat Numbers</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const user = findUser(booking.userId);
              const event = findEvent(booking.eventId);

              return (
                <tr key={booking._id}>
                  <td>{user?.name || booking.userId}</td>
                  <td>{user?.email || "-"}</td>
                  <td>{user?.role || "-"}</td>
                  <td>{event?.title || booking.eventId}</td>
                  <td>{booking.seats}</td>
                  <td>{booking.seatNumbers?.join(", ") || "-"}</td>
                  <td>{booking.status}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleCancelBooking(booking._id)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReviewsSection = () => (
    <div className="service-panel">
      <div className="service-header-row">
        <h2>User Review Service</h2>
        <span>{reviews.length} reviews</span>
      </div>
      <div className="review-list admin-review-list">
        {reviews.map((review) => {
          const event = findEvent(review.eventId);

          return (
            <div className="review-item" key={review._id}>
              <div>
                <strong>{review.userName}</strong>
                <p>Event: {event?.title || review.eventId}</p>
                <p>Rating: {review.rating}/5</p>
                <p>{review.comment}</p>
              </div>
              <button className="delete-btn" onClick={() => handleDeleteReview(review._id)}>
                Remove
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderUsersSection = () => (
    <div className="service-panel">
      <div className="service-header-row">
        <h2>User Management Service</h2>
        <span>{users.length} users</span>
      </div>
      <div className="admin-grid">
        <div className="bookings-section">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button className="admin-btn" onClick={() => startEditUser(user)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form className="admin-form" onSubmit={handleUpdateUser}>
          <label>User Name</label>
          <input value={editingName} onChange={(e) => setEditingName(e.target.value)} disabled={!editingUserId} required />

          <label>User Email</label>
          <input type="email" value={editingEmail} onChange={(e) => setEditingEmail(e.target.value)} disabled={!editingUserId} required />

          <label>User Role</label>
          <input value={users.find((user) => user._id === editingUserId)?.role || "Select a user to edit"} disabled />

          <button type="submit" className="submit-btn" disabled={!editingUserId}>
            Save User Changes
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="app">
      <nav className="navbar">
        <h1 className="nav-title">Admin Panel</h1>
        <button className="back-btn" onClick={onBack}>Back to Home</button>
      </nav>

      <main className="main-content admin-layout">
        <aside className="service-sidebar">
          <button className={`service-nav-btn ${activeService === "events" ? "active" : ""}`} onClick={() => setActiveService("events")}>Event Service</button>
          <button className={`service-nav-btn ${activeService === "bookings" ? "active" : ""}`} onClick={() => setActiveService("bookings")}>Booking Service</button>
          <button className={`service-nav-btn ${activeService === "reviews" ? "active" : ""}`} onClick={() => setActiveService("reviews")}>User Review Service</button>
          <button className={`service-nav-btn ${activeService === "users" ? "active" : ""}`} onClick={() => setActiveService("users")}>User Management Service</button>
        </aside>

        <section className="admin-main-panel">
          {activeService === "events" && renderEventsSection()}
          {activeService === "bookings" && renderBookingsSection()}
          {activeService === "reviews" && renderReviewsSection()}
          {activeService === "users" && renderUsersSection()}
        </section>
      </main>
    </div>
  );
}

export default AdminPage;
