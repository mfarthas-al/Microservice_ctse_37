import React, { useEffect, useMemo, useState } from "react";
import { createBooking, getBookedSeats } from "../services/bookingService";

function BookingModal({ event, currentUser, onClose, onBooked }) {

  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);

  const totalSeats = event.totalSeats || 0;

  const allSeatNumbers = useMemo(() => {
    return Array.from({ length: totalSeats }, (_v, i) => i + 1);
  }, [totalSeats]);

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const response = await getBookedSeats(event._id);
        setBookedSeats(response.data.seatNumbers || []);
      } catch (error) {
        alert("Failed to load seat map: " + error.message);
      }
    };

    fetchBookedSeats();
  }, [event._id]);

  const toggleSeat = (seatNumber) => {
    if (bookedSeats.includes(seatNumber)) {
      return;
    }

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
      return;
    }

    setSelectedSeats([...selectedSeats, seatNumber]);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    setLoading(true);

    try {

      await createBooking({
        userId: currentUser._id,
        eventId: event._id,
        seatNumbers: selectedSeats.sort((a, b) => a - b)
      });
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

          <label>Select Seats</label>
          <div className="seat-map" role="list">
            {allSeatNumbers.map((seatNumber) => {
              const isBooked = bookedSeats.includes(seatNumber);
              const isSelected = selectedSeats.includes(seatNumber);

              return (
                <button
                  key={seatNumber}
                  type="button"
                  className={`seat-box ${isBooked ? "seat-booked" : isSelected ? "seat-selected" : "seat-free"}`}
                  onClick={() => toggleSeat(seatNumber)}
                  disabled={isBooked}
                  title={isBooked ? "Booked" : "Free"}
                >
                  {seatNumber}
                </button>
              );
            })}
          </div>

          <p className="selected-seats-text">
            Selected: {selectedSeats.length === 0 ? "None" : selectedSeats.sort((a, b) => a - b).join(", ")}
          </p>

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
