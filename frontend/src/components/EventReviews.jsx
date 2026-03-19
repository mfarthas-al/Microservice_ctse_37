// import React, { useEffect, useState } from "react";
// import { createReview, deleteReview, getReviews } from "../services/reviewService";

// function EventReviews({ events, currentUser }) {
//   const [selectedEventId, setSelectedEventId] = useState("");
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [loading, setLoading] = useState(false);

//   const fetchReviews = async (eventId) => {
//     if (!eventId) {
//       setReviews([]);
//       return;
//     }

//     try {
//       const response = await getReviews(eventId);
//       setReviews(response.data);
//     } catch (error) {
//       console.error("Failed to fetch reviews", error);
//     }
//   };

//   useEffect(() => {
//     if (events.length > 0 && !selectedEventId) {
//       setSelectedEventId(events[0]._id);
//       fetchReviews(events[0]._id);
//     }
//   }, [events, selectedEventId]);

//   const onSelectEvent = (eventId) => {
//     setSelectedEventId(eventId);
//     fetchReviews(eventId);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!selectedEventId) {
//       return;
//     }

//     setLoading(true);

//     try {
//       await createReview({
//         eventId: selectedEventId,
//         userId: currentUser._id,
//         userName: currentUser.name,
//         rating: Number(rating),
//         comment
//       });
//       setComment("");
//       setRating(5);
//       fetchReviews(selectedEventId);
//     } catch (error) {
//       alert(error.response?.data?.message || "Failed to add review");
//     }

//     setLoading(false);
//   };

//   const handleDelete = async (id) => {
//     await deleteReview(id);
//     fetchReviews(selectedEventId);
//   };

//   return (
//     <div className="reviews-block">
//       <h2 className="section-title">Customer Reviews</h2>

//       <div className="review-controls">
//         <label>Choose Event</label>
//         <select value={selectedEventId} onChange={(e) => onSelectEvent(e.target.value)}>
//           {events.map((event) => (
//             <option key={event._id} value={event._id}>
//               {event.title}
//             </option>
//           ))}
//         </select>
//       </div>

//       {selectedEventId && (
//         <form className="review-form" onSubmit={handleSubmit}>
//           <label>Rating</label>
//           <select value={rating} onChange={(e) => setRating(e.target.value)}>
//             <option value={5}>5</option>
//             <option value={4}>4</option>
//             <option value={3}>3</option>
//             <option value={2}>2</option>
//             <option value={1}>1</option>
//           </select>

//           <label>Comment</label>
//           <textarea
//             rows={3}
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             placeholder="Share your experience"
//             required
//           />

//           <button type="submit" className="submit-btn" disabled={loading}>
//             {loading ? "Submitting..." : "Add Review"}
//           </button>
//         </form>
//       )}

//       <div className="review-list">
//         {reviews.length === 0 ? (
//           <p className="empty-msg">No reviews for this event yet.</p>
//         ) : (
//           reviews.map((review) => (
//             <div className="review-item" key={review._id}>
//               <div>
//                 <strong>{review.userName}</strong>
//                 <p>Rating: {review.rating}/5</p>
//                 <p>{review.comment}</p>
//               </div>
//               {(currentUser.role === "admin" || currentUser._id === review.userId) && (
//                 <button className="delete-btn" onClick={() => handleDelete(review._id)}>
//                   Delete
//                 </button>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default EventReviews;

import React, { useEffect, useState } from "react";
import { createReview, deleteReview, getReviews } from "../services/reviewService";
import "./EventReviews.css"; // Create this CSS file for styles

function EventReviews({ events, currentUser }) {
  const [selectedEventId, setSelectedEventId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [expandedReview, setExpandedReview] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState(0);

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
    setFilterRating(0);
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
      setHoveredRating(0);
      fetchReviews(selectedEventId);
      
      // Show success message
      alert("✅ Review added successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add review");
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview(id);
      fetchReviews(selectedEventId);
    }
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      distribution[5 - review.rating]++;
    });
    return distribution;
  };

  const getFilteredAndSortedReviews = () => {
    let filtered = [...reviews];
    
    // Filter by rating
    if (filterRating > 0) {
      filtered = filtered.filter(review => review.rating === filterRating);
    }
    
    // Sort reviews
    switch(sortBy) {
      case "newest":
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "highest":
        return filtered.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return filtered.sort((a, b) => a.rating - b.rating);
      default:
        return filtered;
    }
  };

  const selectedEvent = events.find(e => e._id === selectedEventId);
  const averageRating = getAverageRating();
  const distribution = getRatingDistribution();
  const filteredReviews = getFilteredAndSortedReviews();

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h2 className="section-title">Customer Reviews</h2>
        <div className="header-decoration">
          <span className="decoration-star">⭐</span>
          <span className="decoration-text">Share your experience</span>
          <span className="decoration-star">⭐</span>
        </div>
      </div>

      {/* Event Selector */}
      <div className="event-selector-card">
        <div className="selector-icon">📋</div>
        <div className="selector-content">
          <label htmlFor="event-select">Select Event to Review</label>
          <select 
            id="event-select"
            value={selectedEventId} 
            onChange={(e) => onSelectEvent(e.target.value)}
            className="event-select"
          >
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedEventId && (
        <>
          {/* Review Summary */}
          {reviews.length > 0 && (
            <div className="review-summary">
              <div className="summary-main">
                <div className="average-rating">
                  <span className="rating-number">{averageRating}</span>
                  <div className="rating-stars-large">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`star ${star <= Math.round(averageRating) ? 'filled' : ''}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="total-reviews">Based on {reviews.length} reviews</span>
                </div>
                
                <div className="rating-distribution">
                  {[5, 4, 3, 2, 1].map((rating, index) => (
                    <div key={rating} className="distribution-row">
                      <span className="rating-label">{rating} star</span>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar-fill"
                          style={{ 
                            width: `${(distribution[index] / reviews.length) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="rating-count">{distribution[index]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Review Form */}
          <div className="review-form-card">
            <h3 className="form-title">Write a Review</h3>
            
            <form className="review-form" onSubmit={handleSubmit}>
              <div className="rating-input">
                <label>Your Rating</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      ★
                    </span>
                  ))}
                  <span className="rating-text">
                    {hoveredRating || rating} out of 5
                  </span>
                </div>
              </div>

              <div className="comment-input">
                <label htmlFor="comment">Your Review</label>
                <textarea
                  id="comment"
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience... What did you like? What could be improved?"
                  required
                />
                <div className="char-counter">
                  {comment.length}/500 characters
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-review-btn" 
                disabled={loading || !comment.trim()}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">✍️</span>
                    Post Review
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Reviews List Header */}
          {reviews.length > 0 && (
            <div className="reviews-list-header">
              <h3 className="list-title">
                Reviews 
                <span className="review-count-badge">{filteredReviews.length}</span>
              </h3>
              
              <div className="list-controls">
                <select 
                  className="filter-select"
                  value={filterRating}
                  onChange={(e) => setFilterRating(Number(e.target.value))}
                >
                  <option value={0}>All Ratings</option>
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>

                <select 
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div className="reviews-list">
            {filteredReviews.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  {filterRating > 0 ? '🔍' : '💬'}
                </div>
                <h4>No Reviews Found</h4>
                <p>
                  {filterRating > 0 
                    ? `No ${filterRating}-star reviews yet. Be the first to leave one!` 
                    : "No reviews for this event yet. Be the first to share your experience!"}
                </p>
                {filterRating > 0 && (
                  <button 
                    className="clear-filter-btn"
                    onClick={() => setFilterRating(0)}
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div 
                  className={`review-item ${expandedReview === review._id ? 'expanded' : ''}`} 
                  key={review._id}
                >
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="reviewer-details">
                        <h4 className="reviewer-name">{review.userName}</h4>
                        <div className="review-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={`star ${star <= review.rating ? 'filled' : ''}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="review-meta">
                      <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      
                      {(currentUser.role === "admin" || currentUser._id === review.userId) && (
                        <button 
                          className="delete-review-btn"
                          onClick={() => handleDelete(review._id)}
                          title="Delete review"
                        >
                          <span className="delete-icon">🗑️</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="review-content">
                    <p className={`review-comment ${expandedReview === review._id ? 'expanded' : ''}`}>
                      {review.comment}
                    </p>
                    
                    {review.comment.length > 200 && expandedReview !== review._id && (
                      <button 
                        className="read-more-btn"
                        onClick={() => setExpandedReview(review._id)}
                      >
                        Read More
                      </button>
                    )}
                    
                    {expandedReview === review._id && (
                      <button 
                        className="read-less-btn"
                        onClick={() => setExpandedReview(null)}
                      >
                        Show Less
                      </button>
                    )}
                  </div>

                  {/* Helpful Section */}
                  <div className="review-footer">
                    <button className="helpful-btn">
                      <span className="helpful-icon">👍</span>
                      Helpful
                    </button>
                    <span className="helpful-count">• 0 people found this helpful</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default EventReviews;