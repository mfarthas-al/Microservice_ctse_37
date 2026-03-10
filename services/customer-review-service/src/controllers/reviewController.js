const Review = require("../models/Review")

exports.createReview = async (req, res) => {
  try {
    const { eventId, userId, userName, rating, comment } = req.body

    const review = new Review({
      eventId,
      userId,
      userName,
      rating,
      comment
    })

    await review.save()

    return res.status(201).json(review)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.getReviews = async (req, res) => {
  try {
    const { eventId } = req.query

    const filter = eventId ? { eventId } : {}
    const reviews = await Review.find(filter).sort({ createdAt: -1 })

    return res.json(reviews)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id)
    return res.json({ message: "Review deleted" })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
