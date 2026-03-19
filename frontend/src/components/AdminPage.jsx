// import React, { useEffect, useState } from "react";
// import {
//   createEvent,
//   deleteEvent,
//   getEvents,
//   uploadEventImage,
// } from "../services/eventService";
// import {
//   deleteBooking,
//   getBannerImage,
//   getBookings,
//   updateBannerImage,
//   uploadBannerImage,
// } from "../services/bookingService";
// import { deleteReview, getReviews } from "../services/reviewService";
// import { getUsers, updateUser } from "../services/userService";

// function AdminPage({ onBack }) {
//   const [activeService, setActiveService] = useState("events");
//   const [events, setEvents] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [reviews, setReviews] = useState([]);
//   const [bannerImageUrl, setBannerImageUrl] = useState("");
//   const [bannerFile, setBannerFile] = useState(null);
//   const [eventFile, setEventFile] = useState(null);
//   const [eventPreview, setEventPreview] = useState("");
//   const [editingUserId, setEditingUserId] = useState("");
//   const [editingName, setEditingName] = useState("");
//   const [editingEmail, setEditingEmail] = useState("");
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [date, setDate] = useState("");
//   const [location, setLocation] = useState("");
//   const [totalSeats, setTotalSeats] = useState("");
//   const [loading, setLoading] = useState(false);

//   const fetchEvents = async () => {
//     const response = await getEvents();
//     setEvents(response.data);
//   };

//   const fetchBookings = async () => {
//     const response = await getBookings();
//     setBookings(response.data);
//   };

//   const fetchUsers = async () => {
//     const response = await getUsers();
//     setUsers(response.data);
//   };

//   const fetchReviews = async () => {
//     const response = await getReviews();
//     setReviews(response.data);
//   };

//   const fetchBanner = async () => {
//     const response = await getBannerImage();
//     setBannerImageUrl(response.data.imageUrl || "");
//   };

//   useEffect(() => {
//     fetchEvents();
//     fetchBookings();
//     fetchUsers();
//     fetchReviews();
//     fetchBanner();
//   }, []);

//   const handleCreateEvent = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       let imageUrl = "";

//       if (eventFile) {
//         const uploadResponse = await uploadEventImage(eventFile, "ctse-events/events");
//         imageUrl = uploadResponse.data.imageUrl;
//       }

//       await createEvent({
//         title,
//         description,
//         date,
//         location,
//         totalSeats: Number(totalSeats),
//         imageUrl,
//       });

//       setTitle("");
//       setDescription("");
//       setDate("");
//       setLocation("");
//       setTotalSeats("");
//       setEventFile(null);
//       setEventPreview("");
//       await fetchEvents();
//       alert("Event created successfully");
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to create event");
//     }

//     setLoading(false);
//   };

//   const handleBannerUpload = async () => {
//     if (!bannerFile) {
//       alert("Select a banner image first");
//       return;
//     }

//     try {
//       const uploadResponse = await uploadBannerImage(bannerFile);
//       await updateBannerImage(uploadResponse.data.imageUrl);
//       await fetchBanner();
//       setBannerFile(null);
//       alert("Banner updated successfully");
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to upload banner");
//     }
//   };

//   const handleDeleteEvent = async (id) => {
//     if (!window.confirm("Delete this event?")) {
//       return;
//     }

//     await deleteEvent(id);
//     fetchEvents();
//   };

//   const handleCancelBooking = async (id) => {
//     if (!window.confirm("Cancel this booking?")) {
//       return;
//     }

//     await deleteBooking(id);
//     fetchBookings();
//     fetchEvents();
//   };

//   const handleDeleteReview = async (id) => {
//     if (!window.confirm("Delete this review?")) {
//       return;
//     }

//     await deleteReview(id);
//     fetchReviews();
//   };

//   const startEditUser = (user) => {
//     setEditingUserId(user._id);
//     setEditingName(user.name);
//     setEditingEmail(user.email);
//   };

//   const handleUpdateUser = async (e) => {
//     e.preventDefault();

//     await updateUser(editingUserId, {
//       name: editingName,
//       email: editingEmail,
//     });

//     setEditingUserId("");
//     setEditingName("");
//     setEditingEmail("");
//     fetchUsers();
//   };

//   const findUser = (userId) => users.find((user) => user._id === userId);
//   const findEvent = (eventId) => events.find((event) => event._id === eventId);
//   const activeBookings = bookings.filter((booking) => booking.status !== "cancelled").length;

//   const renderEventsSection = () => (
//     <div className="service-panel">
//       <div className="service-header-row">
//         <h2>Event Service</h2>
//         <span>{events.length} events</span>
//       </div>

//       <div className="admin-grid">
//         <div>
//           <form className="admin-form" onSubmit={handleCreateEvent}>
//             <label>Event Title</label>
//             <input value={title} onChange={(e) => setTitle(e.target.value)} required />

//             <label>Description</label>
//             <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />

//             <label>Date & Time</label>
//             <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />

//             <label>Location</label>
//             <input value={location} onChange={(e) => setLocation(e.target.value)} required />

//             <label>Total Seats</label>
//             <input type="number" min="1" value={totalSeats} onChange={(e) => setTotalSeats(e.target.value)} required />

//             <label>Event Image</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => {
//                 const file = e.target.files?.[0];
//                 setEventFile(file || null);
//                 setEventPreview(file ? URL.createObjectURL(file) : "");
//               }}
//             />

//             {eventPreview && <img className="upload-preview" src={eventPreview} alt="Event preview" />}

//             <button type="submit" className="submit-btn" disabled={loading}>
//               {loading ? "Creating..." : "Create Event"}
//             </button>
//           </form>

//         </div>

//         <div>
//           <ul className="admin-event-list">
//             {events.map((event) => (
//               <li key={event._id} className="admin-event-item card-stack">
//                 {event.imageUrl && <img className="event-admin-thumb" src={event.imageUrl} alt={event.title} />}
//                 <div>
//                   <strong>{event.title}</strong>
//                   <p>{event.location} | {new Date(event.date).toLocaleDateString()}</p>
//                   <p>{event.availableSeats} / {event.totalSeats} seats available</p>
//                 </div>
//                 <button className="delete-btn" onClick={() => handleDeleteEvent(event._id)}>Delete</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );

//   const renderBookingsSection = () => (
//     <div className="service-panel">
//       <div className="service-header-row">
//         <h2>Booking Service</h2>
//         <span>{bookings.length} bookings</span>
//       </div>
//       <div className="bookings-section">
//         <div className="admin-form banner-panel">
//           <label>Home Banner Image</label>
//           <input type="file" accept="image/*" onChange={(e) => setBannerFile(e.target.files?.[0] || null)} />
//           {bannerImageUrl && <img className="upload-preview banner-preview" src={bannerImageUrl} alt="Banner preview" />}
//           <button type="button" className="submit-btn" onClick={handleBannerUpload}>Upload Banner</button>
//         </div>

//         <table className="booking-table">
//           <thead>
//             <tr>
//               <th>User</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Event</th>
//               <th>Seats</th>
//               <th>Seat Numbers</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bookings.map((booking) => {
//               const user = findUser(booking.userId);
//               const event = findEvent(booking.eventId);

//               return (
//                 <tr key={booking._id}>
//                   <td>{user?.name || booking.userId}</td>
//                   <td>{user?.email || "-"}</td>
//                   <td>{user?.role || "-"}</td>
//                   <td>{event?.title || booking.eventId}</td>
//                   <td>{booking.seats}</td>
//                   <td>{booking.seatNumbers?.join(", ") || "-"}</td>
//                   <td>{booking.status}</td>
//                   <td>
//                     <button className="delete-btn" onClick={() => handleCancelBooking(booking._id)}>
//                       Cancel
//                     </button>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );

//   const renderReviewsSection = () => (
//     <div className="service-panel">
//       <div className="service-header-row">
//         <h2>User Review Service</h2>
//         <span>{reviews.length} reviews</span>
//       </div>
//       <div className="review-list admin-review-list">
//         {reviews.map((review) => {
//           const event = findEvent(review.eventId);

//           return (
//             <div className="review-item" key={review._id}>
//               <div>
//                 <strong>{review.userName}</strong>
//                 <p>Event: {event?.title || review.eventId}</p>
//                 <p>Rating: {review.rating}/5</p>
//                 <p>{review.comment}</p>
//               </div>
//               <button className="delete-btn" onClick={() => handleDeleteReview(review._id)}>
//                 Remove
//               </button>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );

//   const renderUsersSection = () => (
//     <div className="service-panel">
//       <div className="service-header-row">
//         <h2>User Management Service</h2>
//         <span>{users.length} users</span>
//       </div>
//       <div className="admin-grid">
//         <div className="bookings-section">
//           <table className="booking-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Role</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((user) => (
//                 <tr key={user._id}>
//                   <td>{user.name}</td>
//                   <td>{user.email}</td>
//                   <td>{user.role}</td>
//                   <td>
//                     <button className="admin-btn" onClick={() => startEditUser(user)}>
//                       Edit
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         <form className="admin-form" onSubmit={handleUpdateUser}>
//           <label>User Name</label>
//           <input value={editingName} onChange={(e) => setEditingName(e.target.value)} disabled={!editingUserId} required />

//           <label>User Email</label>
//           <input type="email" value={editingEmail} onChange={(e) => setEditingEmail(e.target.value)} disabled={!editingUserId} required />

//           <label>User Role</label>
//           <input value={users.find((user) => user._id === editingUserId)?.role || "Select a user to edit"} disabled />

//           <button type="submit" className="submit-btn" disabled={!editingUserId}>
//             Save User Changes
//           </button>
//         </form>
//       </div>
//     </div>
//   );

//   return (
//     <div className="app admin-page">
//       <nav className="navbar">
//         <div className="nav-title-wrap">
//           <h1 className="nav-title">Admin Control Room</h1>
//           <p className="nav-subtitle">Operations dashboard for all services</p>
//         </div>
//         <button className="back-btn" onClick={onBack}>Back to Home</button>
//       </nav>

//       <main className="main-content">
//         <section className="admin-top-strip">
//           <article>
//             <strong>{events.length}</strong>
//             <span>Total Events</span>
//           </article>
//           <article>
//             <strong>{activeBookings}</strong>
//             <span>Active Bookings</span>
//           </article>
//           <article>
//             <strong>{users.length}</strong>
//             <span>Users</span>
//           </article>
//           <article>
//             <strong>{reviews.length}</strong>
//             <span>Reviews</span>
//           </article>
//         </section>

//         <section className="admin-layout">
//         <aside className="service-sidebar">
//           <button className={`service-nav-btn ${activeService === "events" ? "active" : ""}`} onClick={() => setActiveService("events")}>Event Service</button>
//           <button className={`service-nav-btn ${activeService === "bookings" ? "active" : ""}`} onClick={() => setActiveService("bookings")}>Booking Service</button>
//           <button className={`service-nav-btn ${activeService === "reviews" ? "active" : ""}`} onClick={() => setActiveService("reviews")}>User Review Service</button>
//           <button className={`service-nav-btn ${activeService === "users" ? "active" : ""}`} onClick={() => setActiveService("users")}>User Management Service</button>
//         </aside>

//         <section className="admin-main-panel">
//           {activeService === "events" && renderEventsSection()}
//           {activeService === "bookings" && renderBookingsSection()}
//           {activeService === "reviews" && renderReviewsSection()}
//           {activeService === "users" && renderUsersSection()}
//         </section>
//         </section>
//       </main>
//     </div>
//   );
// }

// export default AdminPage;
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
  const [searchTerm, setSearchTerm] = useState("");

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
    alert("User updated successfully");
  };

  const findUser = (userId) => users.find((user) => user._id === userId);
  const findEvent = (eventId) => events.find((event) => event._id === eventId);
  const activeBookings = bookings.filter((booking) => booking.status !== "cancelled").length;

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = bookings.filter(booking => {
    const user = findUser(booking.userId);
    const event = findEvent(booking.eventId);
    return (
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredReviews = reviews.filter(review => {
    const event = findEvent(review.eventId);
    return (
      review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderEventsSection = () => (
    <div className="service-panel">
      <div className="service-header-row">
        <h2>Event Management</h2>
        <span className="badge">{events.length} Total Events</span>
      </div>

      <div className="admin-grid">
        <div className="form-card">
          <h3>Create New Event</h3>
          <form className="admin-form" onSubmit={handleCreateEvent}>
            <div className="form-group">
              <label>Event Title</label>
              <input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                placeholder="Enter event title"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                rows={4} 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
                placeholder="Describe the event"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  required 
                  placeholder="Event location"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Total Seats</label>
                <input 
                  type="number" 
                  min="1" 
                  value={totalSeats} 
                  onChange={(e) => setTotalSeats(e.target.value)} 
                  required 
                  placeholder="Number of seats"
                />
              </div>

              <div className="form-group">
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
              </div>
            </div>

            {eventPreview && (
              <div className="preview-container">
                <img className="upload-preview" src={eventPreview} alt="Event preview" />
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Creating..." : "Create Event"}
            </button>
          </form>
        </div>

        <div className="list-card">
          <h3>Events List</h3>
          <ul className="admin-event-list">
            {filteredEvents.map((event) => (
              <li key={event._id} className="admin-event-item card-stack">
                {event.imageUrl && (
                  <img className="event-admin-thumb" src={event.imageUrl} alt={event.title} />
                )}
                <div className="event-info">
                  <strong>{event.title}</strong>
                  <div className="event-meta">
                    <span>📍 {event.location}</span>
                    <span>📅 {new Date(event.date).toLocaleDateString()}</span>
                    <span>🎫 {event.availableSeats}/{event.totalSeats} seats</span>
                  </div>
                </div>
                <button className="delete-btn" onClick={() => handleDeleteEvent(event._id)}>
                  Delete
                </button>
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
        <h2>Booking Management</h2>
        <span className="badge">{bookings.length} Total Bookings</span>
      </div>
      
      <div className="bookings-section">
        <div className="banner-section">
          <h3>Banner Settings</h3>
          <div className="admin-form banner-panel">
            <div className="form-group">
              <label>Home Banner Image</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setBannerFile(e.target.files?.[0] || null)} 
              />
            </div>
            
            {bannerImageUrl && (
              <div className="preview-container">
                <img className="upload-preview banner-preview" src={bannerImageUrl} alt="Banner preview" />
              </div>
            )}
            
            <button type="button" className="submit-btn" onClick={handleBannerUpload}>
              Update Banner
            </button>
          </div>
        </div>

        <div className="table-section">
          <h3>Recent Bookings</h3>
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
              {filteredBookings.slice(0, 5).map((booking) => {
                const user = findUser(booking.userId);
                const event = findEvent(booking.eventId);

                return (
                  <tr key={booking._id}>
                    <td>
                      <div className="user-info">
                        <span className="user-name">{user?.name || "Unknown"}</span>
                      </div>
                    </td>
                    <td>{user?.email || "-"}</td>
                    <td>
                      <span className={`role-badge ${user?.role}`}>
                        {user?.role || "-"}
                      </span>
                    </td>
                    <td>{event?.title || "Unknown Event"}</td>
                    <td>
                      <span className="seat-count">{booking.seats}</span>
                    </td>
                    <td>
                      <small>{booking.seatNumbers?.join(", ") || "-"}</small>
                    </td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <button className="delete-btn small" onClick={() => handleCancelBooking(booking._id)}>
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
    </div>
  );

  const renderReviewsSection = () => (
    <div className="service-panel">
      <div className="service-header-row">
        <h2>Reviews Management</h2>
        <span className="badge">{reviews.length} Total Reviews</span>
      </div>
      
      <div className="review-list admin-review-list">
        {filteredReviews.map((review) => {
          const event = findEvent(review.eventId);

          return (
            <div className="review-card" key={review._id}>
              <div className="review-header">
                <div className="reviewer-info">
                  <strong>{review.userName}</strong>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>★</span>
                    ))}
                  </div>
                </div>
                <span className="event-name">{event?.title || "Unknown Event"}</span>
              </div>
              <p className="review-comment">{review.comment}</p>
              <div className="review-footer">
                <span className="review-date">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
                <button className="delete-btn small" onClick={() => handleDeleteReview(review._id)}>
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderUsersSection = () => (
    <div className="service-panel">
      <div className="service-header-row">
        <h2>User Management</h2>
        <span className="badge">{users.length} Total Users</span>
      </div>
      
      <div className="admin-grid">
        <div className="table-section">
          <h3>Users List</h3>
          <table className="booking-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-avatar">
                      <div className="avatar-circle">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <button className="admin-btn small" onClick={() => startEditUser(user)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="form-card">
          <h3>Edit User</h3>
          {editingUserId ? (
            <form className="admin-form" onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label>User Name</label>
                <input 
                  value={editingName} 
                  onChange={(e) => setEditingName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>User Email</label>
                <input 
                  type="email" 
                  value={editingEmail} 
                  onChange={(e) => setEditingEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Current Role</label>
                <input 
                  value={users.find((user) => user._id === editingUserId)?.role || "Select a user to edit"} 
                  disabled 
                  className="readonly-input"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Save Changes
                </button>
                <button type="button" className="cancel-btn" onClick={() => setEditingUserId("")}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="empty-state">
              <p>Select a user to edit their information</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="app admin-page">
      <nav className="navbar">
        <div className="nav-title-wrap">
          <h1 className="nav-title">Admin Control Room</h1>
          <p className="nav-subtitle">Operations dashboard for all services</p>
        </div>
        <div className="nav-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder={`Search ${activeService}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="back-btn" onClick={onBack}>Back to Home</button>
        </div>
      </nav>

      <main className="main-content">
        <section className="admin-top-strip">
          <article className="stat-card">
            <strong>{events.length}</strong>
            <span>Total Events</span>
          </article>
          <article className="stat-card">
            <strong>{activeBookings}</strong>
            <span>Active Bookings</span>
          </article>
          <article className="stat-card">
            <strong>{users.length}</strong>
            <span>Registered Users</span>
          </article>
          <article className="stat-card">
            <strong>{reviews.length}</strong>
            <span>User Reviews</span>
          </article>
        </section>

        <section className="admin-layout">
          <aside className="service-sidebar">
            <button 
              className={`service-nav-btn ${activeService === "events" ? "active" : ""}`} 
              onClick={() => setActiveService("events")}
            >
              <span className="nav-icon">📅</span>
              Event Service
            </button>
            <button 
              className={`service-nav-btn ${activeService === "bookings" ? "active" : ""}`} 
              onClick={() => setActiveService("bookings")}
            >
              <span className="nav-icon">🎫</span>
              Booking Service
            </button>
            <button 
              className={`service-nav-btn ${activeService === "reviews" ? "active" : ""}`} 
              onClick={() => setActiveService("reviews")}
            >
              <span className="nav-icon">⭐</span>
              User Review Service
            </button>
            <button 
              className={`service-nav-btn ${activeService === "users" ? "active" : ""}`} 
              onClick={() => setActiveService("users")}
            >
              <span className="nav-icon">👥</span>
              User Management Service
            </button>
          </aside>

          <section className="admin-main-panel">
            {activeService === "events" && renderEventsSection()}
            {activeService === "bookings" && renderBookingsSection()}
            {activeService === "reviews" && renderReviewsSection()}
            {activeService === "users" && renderUsersSection()}
          </section>
        </section>
      </main>
    </div>
  );
}

export default AdminPage;