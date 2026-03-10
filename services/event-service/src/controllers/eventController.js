const Event = require("../models/Event")

exports.createEvent = async (req, res) => {

  try {

    const { title, description, date, location, totalSeats, imageUrl } = req.body

    const event = new Event({
      title,
      description,
      date,
      location,
      imageUrl,
      totalSeats,
      availableSeats: totalSeats
    })

    await event.save()

    res.status(201).json(event)

  } catch (error) {

    res.status(500).json({ message: error.message })

  }

}

exports.getEvents = async (req, res) => {

  try {

    const events = await Event.find()

    res.json(events)

  } catch (error) {

    res.status(500).json({ message: error.message })

  }

}

exports.getEventById = async (req, res) => {

  try {

    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    res.json(event)

  } catch (error) {

    res.status(500).json({ message: error.message })

  }

}

exports.updateEvent = async (req, res) => {

  try {

    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    res.json(event)

  } catch (error) {

    res.status(500).json({ message: error.message })

  }

}

exports.deleteEvent = async (req, res) => {

  try {

    await Event.findByIdAndDelete(req.params.id)

    res.json({ message: "Event deleted" })

  } catch (error) {

    res.status(500).json({ message: error.message })

  }

}
