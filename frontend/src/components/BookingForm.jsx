import React, { useState } from "react";
import { createBooking } from "../services/bookingService";

function BookingForm({ refreshBookings }) {

  const [userId, setUserId] = useState("");
  const [eventId, setEventId] = useState("");
  const [seats, setSeats] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    const bookingData = {
      userId,
      eventId,
      seats
    };

    await createBooking(bookingData);

    alert("Booking created successfully!");

    setUserId("");
    setEventId("");
    setSeats("");

    refreshBookings();
  };

  return (
    <div>

      <h2>Create Booking</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <br/>

        <input
          type="text"
          placeholder="Event ID"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        />

        <br/>

        <input
          type="number"
          placeholder="Seats"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
        />

        <br/>

        <button type="submit">Book Event</button>

      </form>

    </div>
  );
}

export default BookingForm;