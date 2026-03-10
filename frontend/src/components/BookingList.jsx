import React from "react";
import { deleteBooking } from "../services/bookingService";

function BookingList({ bookings, refreshBookings }) {

  const handleDelete = async (id) => {
    await deleteBooking(id);
    refreshBookings();
  };

  if (bookings.length === 0) {
    return <p className="empty-msg">No bookings yet.</p>;
  }

  return (
    <div className="bookings-section">
      <table className="booking-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Event ID</th>
            <th>Seats</th>
            <th>Seat Numbers</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{booking.userId}</td>
              <td>{booking.eventId}</td>
              <td>{booking.seats}</td>
              <td>{booking.seatNumbers?.join(", ") || "-"}</td>
              <td>{booking.status}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(booking._id)}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingList;