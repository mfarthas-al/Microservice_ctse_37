const Booking = require("../models/Booking")
const { getEventById, updateEventById } = require("../services/eventService")

exports.createBooking = async (req,res)=>{

try{

const {userId,eventId,seatNumbers} = req.body

if (!Array.isArray(seatNumbers) || seatNumbers.length === 0) {
return res.status(400).json({message:"Please select at least one seat"})
}

const event = await getEventById(eventId)

if (!event) {
return res.status(404).json({message:"Event not found"})
}

const invalidSeat = seatNumbers.find((seat) => seat < 1 || seat > event.totalSeats)

if (invalidSeat) {
return res.status(400).json({message:"One or more seat numbers are invalid"})
}

const existingBookings = await Booking.find({ eventId })

const bookedSeats = new Set(
existingBookings.flatMap((booking) => booking.seatNumbers || [])
)

const alreadyBookedSeat = seatNumbers.find((seat) => bookedSeats.has(seat))

if (alreadyBookedSeat) {
return res.status(409).json({message:`Seat ${alreadyBookedSeat} is already booked`})
}

const seats = seatNumbers.length

const booking = new Booking({
userId,
eventId,
seats,
seatNumbers
})

await booking.save()

await updateEventById(eventId, {
availableSeats: Math.max(0, event.availableSeats - seats)
})

res.status(201).json(booking)

}catch(error){

res.status(500).json({message:error.message})

}

}

exports.getBookings = async(req,res)=>{

try{

const bookings = await Booking.find()

res.json(bookings)

}catch(error){

res.status(500).json({message:error.message})

}

}

exports.getBookedSeatsByEvent = async (req,res)=>{

try{

const { eventId } = req.params

const bookings = await Booking.find({ eventId })

const seatNumbers = bookings.flatMap((booking) => booking.seatNumbers || [])

res.json({ seatNumbers })

}catch(error){

res.status(500).json({message:error.message})

}

}

exports.cancelBooking = async(req,res)=>{

try{

const booking = await Booking.findByIdAndDelete(req.params.id)

if (!booking) {
return res.status(404).json({message:"Booking not found"})
}

try {
const event = await getEventById(booking.eventId)
await updateEventById(booking.eventId, {
availableSeats: Math.min(event.totalSeats, event.availableSeats + booking.seats)
})
} catch (_error) {
// Keep booking cancellation successful even if event-service update fails.
}

res.json({message:"Booking cancelled"})

}catch(error){

res.status(500).json({message:error.message})

}

}