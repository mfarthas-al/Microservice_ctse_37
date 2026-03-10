import React from "react";

function EventCard({ event, onBook }) {

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="event-card">

      {event.imageUrl && (
        <img className="event-card-image" src={event.imageUrl} alt={event.title} />
      )}

      <h3 className="event-title">{event.title}</h3>

      <p className="event-description">{event.description}</p>

      <div className="event-details">
        <span>📅 {formattedDate}</span>
        <span>📍 {event.location}</span>
        <span>💺 {event.availableSeats} seats available</span>
      </div>

      <button
        className="book-btn"
        onClick={onBook}
        disabled={event.availableSeats === 0}
      >
        {event.availableSeats === 0 ? "Sold Out" : "Book Now"}
      </button>

    </div>
  );
}

export default EventCard;
