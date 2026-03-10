import React, { useEffect, useState } from "react";
import { createReview, deleteReview, getReviews } from "../services/reviewService";

function EventReviews({ events, currentUser }) {
  const [selectedEventId, setSelectedEventId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchReviews = async (eventId) => {
    if (!eventId) {
      setReviews([]);
      return;
    }

    try {
      const response = await getReviews(eventId);
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  useEffect(() => {
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0]._id);
      fetchReviews(events[0]._id);
    }
  }, [events, selectedEventId]);

  const onSelectEvent = (eventId) => {
    setSelectedEventId(eventId);
    fetchReviews(eventId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEventId) {
      return;
    }

    setLoading(true);

    try {
      await createReview({
        eventId: selectedEventId,
        userId: currentUser._id,
        userName: currentUser.name,
        rating: Number(rating),
        comment
      });
      setComment("");
      setRating(5);
      fetchReviews(selectedEventId);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add review");
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    await deleteReview(id);
    fetchReviews(selectedEventId);
  };

  return (
    <div className="reviews-block">
      <h2 className="section-title">Customer Reviews</h2>

      <div className="review-controls">
        <label>Choose Event</label>
        <select value={selectedEventId} onChange={(e) => onSelectEvent(e.target.value)}>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      {selectedEventId && (
        <form className="review-form" onSubmit={handleSubmit}>
          <label>Rating</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value={5}>5</option>
            <option value={4}>4</option>
            <option value={3}>3</option>
            <option value={2}>2</option>
            <option value={1}>1</option>
          </select>

          <label>Comment</label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience"
            required
          />

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Add Review"}
          </button>
        </form>
      )}

      <div className="review-list">
        {reviews.length === 0 ? (
          <p className="empty-msg">No reviews for this event yet.</p>
        ) : (
          reviews.map((review) => (
            <div className="review-item" key={review._id}>
              <div>
                <strong>{review.userName}</strong>
                <p>Rating: {review.rating}/5</p>
                <p>{review.comment}</p>
              </div>
              {(currentUser.role === "admin" || currentUser._id === review.userId) && (
                <button className="delete-btn" onClick={() => handleDelete(review._id)}>
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default EventReviews;
