//review controller for customer review service
const Review = require("../models/Review")
const { getEventById } = require("../services/eventService")
const { getMyBookings } = require("../services/bookingService")

exports.createReview = async (req, res) => {
  try {
    const { eventId, rating, comment } = req.body

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    if (!eventId || !rating || !comment) {
      return res.status(400).json({ message: "eventId, rating and comment are required" })
    }

    let event
    try {
      event = await getEventById(eventId)
    } catch (error) {
      if (!error.response) {
        return res.status(503).json({ message: "Event service unavailable" })
      }

      if (error.response.status === 404) {
        return res.status(404).json({ message: "Event not found" })
      }

      return res.status(502).json({ message: "Failed to validate event" })
    }

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    let bookings
    try {
      bookings = await getMyBookings(req.headers.authorization)
    } catch (error) {
      if (!error.response) {
        return res.status(503).json({ message: "Booking service unavailable" })
      }

      return res.status(502).json({ message: "Failed to validate booking history" })
    }
    const hasBooking = bookings.some((booking) => booking.eventId === eventId)

    if (!hasBooking) {
      return res.status(403).json({ message: "You can review only events you booked" })
    }

    const review = new Review({
      eventId,
      eventTitle: event.title || null,
      userId: req.user.id,
      userEmail: req.user.email || null,
      userName: req.user.name || "Anonymous",
      userRole: req.user.role || null,
      rating,
      comment
    })

    await review.save()

    return res.status(201).json(review)
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "You already reviewed this event" })
    }

    return res.status(500).json({ message: error.message })
  }
}

exports.getReviews = async (req, res) => {
  try {
    const { eventId, mine } = req.query

    const filter = eventId ? { eventId } : {}

    if (mine === "true") {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Unauthorized" })
      }

      filter.userId = req.user.id
    }

    const reviews = await Review.find(filter).sort({ createdAt: -1 })

    return res.json(reviews)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    if (req.user.role !== "admin" && review.userId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" })
    }

    await Review.findByIdAndDelete(req.params.id)

    return res.json({ message: "Review deleted" })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
