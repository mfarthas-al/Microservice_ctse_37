// import React, { useState } from "react";
// import { createBooking } from "../services/bookingService";

// function BookingForm({ refreshBookings }) {

//   const [userId, setUserId] = useState("");
//   const [eventId, setEventId] = useState("");
//   const [seats, setSeats] = useState("");

//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     const bookingData = {
//       userId,
//       eventId,
//       seats
//     };

//     await createBooking(bookingData);

//     alert("Booking created successfully!");

//     setUserId("");
//     setEventId("");
//     setSeats("");

//     refreshBookings();
//   };

//   return (
//     <div>

//       <h2>Create Booking</h2>

//       <form onSubmit={handleSubmit}>

//         <input
//           type="text"
//           placeholder="User ID"
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//         />

//         <br/>

//         <input
//           type="text"
//           placeholder="Event ID"
//           value={eventId}
//           onChange={(e) => setEventId(e.target.value)}
//         />

//         <br/>

//         <input
//           type="number"
//           placeholder="Seats"
//           value={seats}
//           onChange={(e) => setSeats(e.target.value)}
//         />

//         <br/>

//         <button type="submit">Book Event</button>

//       </form>

//     </div>
//   );
// }

// export default BookingForm;

import React, { useState, useEffect } from "react";
import { createBooking } from "../services/bookingService";
import { getEvents } from "../services/eventService";
import { getUsers } from "../services/userService";
import "./BookingForm.css"; // Create this CSS file for styles

function BookingForm({ refreshBookings }) {
  const [userId, setUserId] = useState("");
  const [eventId, setEventId] = useState("");
  const [seats, setSeats] = useState("");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [step, setStep] = useState(1); // Multi-step form: 1=select user, 2=select event, 3=confirm

  useEffect(() => {
    fetchEvents();
    fetchUsers();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        userId,
        eventId,
        seats: parseInt(seats)
      };

      await createBooking(bookingData);
      
      // Show success message with details
      alert(`✅ Booking created successfully!\n\nEvent: ${selectedEvent?.title}\nUser: ${selectedUser?.name}\nSeats: ${seats}`);
      
      // Reset form
      setUserId("");
      setEventId("");
      setSeats("");
      setSelectedEvent(null);
      setSelectedUser(null);
      setStep(1);
      
      refreshBookings();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setUserId(user._id);
    setSelectedUser(user);
    setStep(2);
  };

  const handleEventSelect = (event) => {
    setEventId(event._id);
    setSelectedEvent(event);
    setStep(3);
  };

  const handleSeatsChange = (e) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) > 0 && parseInt(value) <= (selectedEvent?.availableSeats || 0))) {
      setSeats(value);
    }
  };

  const getAvailableEvents = () => {
    return events.filter(event => event.availableSeats > 0);
  };

  const resetSelection = () => {
    setStep(1);
    setSelectedUser(null);
    setSelectedEvent(null);
    setUserId("");
    setEventId("");
    setSeats("");
  };

  return (
    <div className="booking-form-container">
      <div className="form-header">
        <h2>Create New Booking</h2>
        <p className="form-subtitle">Book your favorite events in just a few steps</p>
      </div>

      {/* Progress Steps */}
      <div className="progress-steps">
        <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">{step > 1 ? '✓' : '1'}</div>
          <span className="step-label">Select User</span>
        </div>
        <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">{step > 2 ? '✓' : '2'}</div>
          <span className="step-label">Choose Event</span>
        </div>
        <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span className="step-label">Confirm</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        {/* Step 1: User Selection */}
        {step === 1 && (
          <div className="form-step fade-in">
            <h3 className="step-title">👤 Select a User</h3>
            <div className="users-grid">
              {users.map((user) => (
                <div
                  key={user._id}
                  className={`user-card ${selectedUser?._id === user._id ? 'selected' : ''}`}
                  onClick={() => handleUserSelect(user)}
                >
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <h4>{user.name}</h4>
                    <p className="user-email">{user.email}</p>
                    <span className={`user-role ${user.role}`}>{user.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Event Selection */}
        {step === 2 && (
          <div className="form-step fade-in">
            <div className="step-header">
              <h3 className="step-title">🎉 Choose an Event</h3>
              <button type="button" className="back-button" onClick={() => setStep(1)}>
                ← Back
              </button>
            </div>
            <div className="events-grid">
              {getAvailableEvents().map((event) => (
                <div
                  key={event._id}
                  className={`event-card ${selectedEvent?._id === event._id ? 'selected' : ''}`}
                  onClick={() => handleEventSelect(event)}
                >
                  {event.imageUrl && (
                    <div className="event-image">
                      <img src={event.imageUrl} alt={event.title} />
                    </div>
                  )}
                  <div className="event-details">
                    <h4>{event.title}</h4>
                    <p className="event-description">{event.description.substring(0, 60)}...</p>
                    <div className="event-meta">
                      <span className="event-location">📍 {event.location}</span>
                      <span className="event-date">📅 {new Date(event.date).toLocaleDateString()}</span>
                      <span className="event-seats">🎫 {event.availableSeats} seats left</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="form-step fade-in">
            <div className="step-header">
              <h3 className="step-title">✅ Confirm Booking</h3>
              <button type="button" className="back-button" onClick={() => setStep(2)}>
                ← Back
              </button>
            </div>

            <div className="confirmation-card">
              <div className="selected-user-info">
                <h4>Selected User</h4>
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{selectedUser?.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{selectedUser?.email}</span>
                </div>
              </div>

              <div className="selected-event-info">
                <h4>Selected Event</h4>
                <div className="info-row">
                  <span className="info-label">Title:</span>
                  <span className="info-value">{selectedEvent?.title}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Date:</span>
                  <span className="info-value">{new Date(selectedEvent?.date).toLocaleDateString()}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Location:</span>
                  <span className="info-value">{selectedEvent?.location}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Available Seats:</span>
                  <span className="info-value">{selectedEvent?.availableSeats}</span>
                </div>
              </div>

              <div className="seats-selection">
                <label htmlFor="seats">Number of Seats</label>
                <div className="seats-input-wrapper">
                  <input
                    type="number"
                    id="seats"
                    min="1"
                    max={selectedEvent?.availableSeats || 1}
                    value={seats}
                    onChange={handleSeatsChange}
                    required
                    placeholder="Enter number of seats"
                  />
                  <span className="max-seats">Max: {selectedEvent?.availableSeats}</span>
                </div>
              </div>

              <div className="booking-summary">
                <h4>Booking Summary</h4>
                <div className="summary-row">
                  <span>Event:</span>
                  <span>{selectedEvent?.title}</span>
                </div>
                <div className="summary-row">
                  <span>User:</span>
                  <span>{selectedUser?.name}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Seats:</span>
                  <span>{seats || '0'}</span>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="reset-button" 
                  onClick={resetSelection}
                >
                  Start Over
                </button>
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={loading || !seats}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Creating...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default BookingForm;