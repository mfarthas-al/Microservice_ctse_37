// import React from "react";

// function EventCard({ event, onBook, fallbackImage }) {

//   const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   return (
//     <div className="event-card">

//       <img className="event-card-image" src={event.imageUrl || fallbackImage} alt={event.title} />

//       <div className="event-meta-row">
//         <span className="event-date-pill">{formattedDate}</span>
//         <span className={`event-seat-pill ${event.availableSeats === 0 ? "sold" : "open"}`}>
//           {event.availableSeats === 0 ? "Sold Out" : `${event.availableSeats} Seats`}
//         </span>
//       </div>

//       <h3 className="event-title">{event.title}</h3>

//       <p className="event-description">{event.description}</p>

//       <div className="event-details">
//         <span>{event.location}</span>
//         <span>{event.totalSeats} total seats</span>
//       </div>

//       <button
//         className="book-btn"
//         onClick={onBook}
//         disabled={event.availableSeats === 0}
//       >
//         {event.availableSeats === 0 ? "Sold Out" : "Book Ticket"}
//       </button>

//     </div>
//   );
// }

// eventfunction EventCard({ event, onBook, fallbackImage }) {

//   const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

// export default EventCard;
import React, { useState } from "react";
import "./EventCard.css"; // Create this CSS file for styles

function EventCard({ event, onBook, fallbackImage }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getTimeRemaining = () => {
    const eventDate = new Date(event.date);
    const now = new Date();
    const diffTime = eventDate - now;
    
    if (diffTime < 0) return "Event ended";
    
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 30) return `${Math.ceil(diffDays / 30)} months left`;
    if (diffDays > 7) return `${Math.ceil(diffDays / 7)} weeks left`;
    if (diffDays > 1) return `${diffDays} days left`;
    if (diffDays === 1) return "Tomorrow";
    
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    if (diffHours > 0) return `${diffHours} hours left`;
    
    return "Today";
  };

  const getSeatPercentage = () => {
    return ((event.totalSeats - event.availableSeats) / event.totalSeats) * 100;
  };

  const isSoldOut = event.availableSeats === 0;
  const isAlmostFull = event.availableSeats <= event.totalSeats * 0.2;
  const timeRemaining = getTimeRemaining();

  return (
    <div className={`event-card ${isSoldOut ? 'sold-out' : ''} ${isAlmostFull ? 'almost-full' : ''}`}>
      {/* Image Container */}
      <div className="event-card-image-container">
        {!imageLoaded && !imageError && (
          <div className="image-skeleton">
            <div className="skeleton-loader"></div>
          </div>
        )}
        
        <img 
          className={`event-card-image ${imageLoaded ? 'loaded' : ''}`}
          src={imageError ? fallbackImage : (event.imageUrl || fallbackImage)} 
          alt={event.title}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
        
        {/* Overlay Badges */}
        <div className="image-overlay">
          {isSoldOut && (
            <div className="overlay-badge sold-out">
              <span className="badge-icon">❌</span>
              Sold Out
            </div>
          )}
          {isAlmostFull && !isSoldOut && (
            <div className="overlay-badge almost-full">
              <span className="badge-icon">🔥</span>
              Almost Full
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <button className="favorite-btn">
          <span className="heart-icon">♡</span>
        </button>
      </div>

      {/* Date and Status Row */}
      <div className="event-meta-row">
        <div className="event-date-pill">
          <span className="meta-icon">📅</span>
          <span>{formattedDate}</span>
        </div>
        
        <div className={`event-seat-pill ${isSoldOut ? "sold" : isAlmostFull ? "limited" : "open"}`}>
          <span className="meta-icon">
            {isSoldOut ? "❌" : isAlmostFull ? "⚠️" : "🎫"}
          </span>
          <span>
            {isSoldOut 
              ? "Sold Out" 
              : isAlmostFull 
                ? `Only ${event.availableSeats} left` 
                : `${event.availableSeats} Seats`}
          </span>
        </div>
      </div>

      {/* Time Remaining Indicator */}
      {!isSoldOut && (
        <div className="time-remaining">
          <span className="time-icon">⏰</span>
          <span className="time-text">{timeRemaining}</span>
        </div>
      )}

      {/* Event Title */}
      <h3 className="event-title">{event.title}</h3>

      {/* Event Description */}
      <p className="event-description">{event.description}</p>

      {/* Progress Bar */}
      {!isSoldOut && (
        <div className="seat-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${getSeatPercentage()}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {Math.round(getSeatPercentage())}% booked
          </span>
        </div>
      )}

      {/* Event Details */}
      <div className="event-details-grid">
        <div className="detail-item">
          <span className="detail-icon">📍</span>
          <div className="detail-content">
            <span className="detail-label">Location</span>
            <span className="detail-value">{event.location}</span>
          </div>
        </div>
        
        <div className="detail-item">
          <span className="detail-icon">🎫</span>
          <div className="detail-content">
            <span className="detail-label">Total Seats</span>
            <span className="detail-value">{event.totalSeats}</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">💺</span>
          <div className="detail-content">
            <span className="detail-label">Available</span>
            <span className="detail-value">{event.availableSeats}</span>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">📊</span>
          <div className="detail-content">
            <span className="detail-label">Status</span>
            <span className={`status-value ${isSoldOut ? 'sold' : isAlmostFull ? 'limited' : 'available'}`}>
              {isSoldOut ? 'Sold Out' : isAlmostFull ? 'Limited' : 'Available'}
            </span>
          </div>
        </div>
      </div>

      {/* Price Section (if you have price in your event object) */}
      {event.price && (
        <div className="price-section">
          <span className="price-label">Starting from</span>
          <span className="price-value">${event.price}</span>
        </div>
      )}

      {/* Book Button */}
      <button
        className={`book-btn ${isSoldOut ? 'disabled' : ''}`}
        onClick={onBook}
        disabled={isSoldOut}
      >
        {isSoldOut ? (
          <>
            <span className="btn-icon">❌</span>
            Sold Out
          </>
        ) : (
          <>
            <span className="btn-icon">🎟️</span>
            {isAlmostFull ? 'Book Now - Hurry!' : 'Book Ticket'}
          </>
        )}
      </button>
    </div>
  );
}

export default EventCard;