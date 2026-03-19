// import React from "react";
// import { deleteBooking } from "../services/bookingService";

// function BookingList({ bookings, refreshBookings }) {

//   const handleDelete = async (id) => {
//     await deleteBooking(id);
//     refreshBookings();
//   };

//   if (bookings.length === 0) {
//     return <p className="empty-msg">No bookings yet.</p>;
//   }

//   return (
//     <div className="bookings-section">
//       <table className="booking-table">
//         <thead>
//           <tr>
//             <th>User ID</th>
//             <th>Event ID</th>
//             <th>Seats</th>
//             <th>Seat Numbers</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bookings.map((booking) => (
//             <tr key={booking._id}>
//               <td>{booking.userId}</td>
//               <td>{booking.eventId}</td>
//               <td>{booking.seats}</td>
//               <td>{booking.seatNumbers?.join(", ") || "-"}</td>
//               <td>{booking.status}</td>
//               <td>
//                 <button
//                   className="delete-btn"
//                   onClick={() => handleDelete(booking._id)}
//                 >
//                   Cancel
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default BookingList;

import React, { useState } from "react";
import { deleteBooking } from "../services/bookingService";
import "./BookingList.css"; // Create this CSS file for styles

function BookingList({ bookings, refreshBookings }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id) => {
    await deleteBooking(id);
    refreshBookings();
    setShowConfirmDialog(false);
    setSelectedBooking(null);
  };

  const confirmDelete = (booking) => {
    setSelectedBooking(booking);
    setShowConfirmDialog(true);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'confirmed': return 'status-badge confirmed';
      case 'pending': return 'status-badge pending';
      case 'cancelled': return 'status-badge cancelled';
      default: return 'status-badge';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'confirmed': return '✅';
      case 'pending': return '⏳';
      case 'cancelled': return '❌';
      default: return '📅';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    // Filter by status
    if (filterStatus !== 'all' && booking.status !== filterStatus) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.userId?.toLowerCase().includes(searchLower) ||
        booking.eventId?.toLowerCase().includes(searchLower) ||
        booking.seatNumbers?.some(seat => seat.toString().includes(searchTerm))
      );
    }
    
    return true;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  if (bookings.length === 0) {
    return (
      <div className="booking-list-container">
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No Bookings Yet</h3>
          <p>There are no bookings to display at the moment.</p>
          <p className="empty-hint">New bookings will appear here once created.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-list-container">
      {/* Header with Stats */}
      <div className="bookings-header">
        <div className="header-left">
          <h2>Booking Management</h2>
          <p className="booking-count">{bookings.length} total bookings</p>
        </div>
        
        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card total">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card confirmed">
            <span className="stat-value">{stats.confirmed}</span>
            <span className="stat-label">Confirmed</span>
          </div>
          <div className="stat-card pending">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card cancelled">
            <span className="stat-value">{stats.cancelled}</span>
            <span className="stat-label">Cancelled</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by User ID, Event ID, or Seat Numbers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>

        <div className="status-filters">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          <button
            className={`filter-btn confirmed ${filterStatus === 'confirmed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('confirmed')}
          >
            ✅ Confirmed
          </button>
          <button
            className={`filter-btn pending ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            ⏳ Pending
          </button>
          <button
            className={`filter-btn cancelled ${filterStatus === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilterStatus('cancelled')}
          >
            ❌ Cancelled
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        Showing {filteredBookings.length} of {bookings.length} bookings
      </div>

      {/* Bookings Table */}
      <div className="table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Event</th>
              <th>Seats</th>
              <th>Seat Numbers</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking._id} className={`booking-row ${booking.status}`}>
                <td>
                  <div className="user-info">
                    <div className="user-avatar">
                      {booking.userId?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="user-details">
                      <span className="user-id">{booking.userId}</span>
                      <span className="user-label">User ID</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="event-info">
                    <span className="event-id">{booking.eventId}</span>
                    <span className="event-label">Event ID</span>
                  </div>
                </td>
                <td>
                  <div className="seats-info">
                    <span className="seats-count">{booking.seats}</span>
                    <span className="seats-label">seats</span>
                  </div>
                </td>
                <td>
                  <div className="seat-numbers">
                    {booking.seatNumbers && booking.seatNumbers.length > 0 ? (
                      <div className="seat-tags">
                        {booking.seatNumbers.map((seat, index) => (
                          <span key={index} className="seat-tag">
                            {seat}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="no-seats">—</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={getStatusBadgeClass(booking.status)}>
                    <span className="status-icon">{getStatusIcon(booking.status)}</span>
                    {booking.status}
                  </span>
                </td>
                <td>
                  <button
                    className="action-btn cancel"
                    onClick={() => confirmDelete(booking)}
                    disabled={booking.status === 'cancelled'}
                  >
                    <span className="btn-icon">✕</span>
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && selectedBooking && (
        <div className="modal-overlay">
          <div className="confirm-dialog">
            <div className="dialog-header">
              <div className="dialog-icon">⚠️</div>
              <h3>Cancel Booking</h3>
            </div>
            <div className="dialog-content">
              <p>Are you sure you want to cancel this booking?</p>
              <div className="booking-details">
                <div className="detail-row">
                  <span>User ID:</span>
                  <strong>{selectedBooking.userId}</strong>
                </div>
                <div className="detail-row">
                  <span>Event ID:</span>
                  <strong>{selectedBooking.eventId}</strong>
                </div>
                <div className="detail-row">
                  <span>Seats:</span>
                  <strong>{selectedBooking.seats}</strong>
                </div>
                <div className="detail-row">
                  <span>Current Status:</span>
                  <span className={getStatusBadgeClass(selectedBooking.status)}>
                    {selectedBooking.status}
                  </span>
                </div>
              </div>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="dialog-actions">
              <button 
                className="dialog-btn cancel" 
                onClick={() => setShowConfirmDialog(false)}
              >
                No, Keep It
              </button>
              <button 
                className="dialog-btn confirm" 
                onClick={() => handleDelete(selectedBooking._id)}
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingList;