import React from "react";
import { deleteBooking } from "../services/bookingService";

function BookingList({ bookings, refreshBookings }) {

  const handleDelete = async (id) => {

    await deleteBooking(id);

    refreshBookings();
  };

  return (

    <div>

      <h2>All Bookings</h2>

      <ul>

        {bookings.map((booking) => (

          <li key={booking._id}>

            User: {booking.userId} |
            Event: {booking.eventId} |
            Seats: {booking.seats}

            <button onClick={() => handleDelete(booking._id)}>
              Cancel
            </button>

          </li>

        ))}

      </ul>

    </div>
  );
}

export default BookingList;