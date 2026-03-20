const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true
  },
  eventTitle: {
    type: String,
    default: null
  },
  userId: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    default: null
  },
  userName: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    default: null
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

reviewSchema.index({ eventId: 1, userId: 1 }, { unique: true })

module.exports = mongoose.model("Review", reviewSchema)
