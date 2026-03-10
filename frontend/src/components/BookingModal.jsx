import React, { useState } from "react";
import { createBooking } from "../services/bookingService";

function BookingModal({ event, currentUser, onClose, onBooked }) {

  const [seats, setSeats] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();
    setLoading(true);

    try {

      await createBooking({ userId: currentUser._id, eventId: event._id, seats: Number(seats) });
      alert("Booking confirmed!");
      onBooked();

    } catch (error) {

      alert("Booking failed: " + error.message);

    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>

      <div className="modal" onClick={(e) => e.stopPropagation()}>

        <h2>Book: {event.title}</h2>
        <p>{event.location} | {event.availableSeats} seats available</p>
        <p>Booking as: {currentUser.name} ({currentUser.email})</p>

        <form onSubmit={handleSubmit}>

          <label>Number of Seats</label>
          <input
            type="number"
            min="1"
            max={event.availableSeats}
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            required
          />

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="book-btn" disabled={loading}>
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}

export default BookingModal;
