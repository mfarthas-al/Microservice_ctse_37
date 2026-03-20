import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  imageUrl: {
    type: String,
    default: ""
  },

  totalSeats: {
    type: Number,
    required: true
  },

  availableSeats: {
    type: Number,
    required: true
  },

  createdBy: {
    type: String,
    required: true,
    index: true
  },

  creatorEmail: {
    type: String,
    trim: true,
    lowercase: true,
    default: null
  },

  creatorName: {
    type: String,
    trim: true,
    default: null
  },

  creatorRole: {
    type: String,
    enum: ["admin", "organizer", "attendee"],
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

})

export default mongoose.model("Event", eventSchema)
