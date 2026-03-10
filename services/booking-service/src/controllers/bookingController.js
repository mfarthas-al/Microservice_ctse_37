const Booking = require("../models/Booking")

exports.createBooking = async (req,res)=>{

try{

const {userId,eventId,seats} = req.body

const booking = new Booking({
userId,
eventId,
seats
})

await booking.save()

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

exports.cancelBooking = async(req,res)=>{

try{

await Booking.findByIdAndDelete(req.params.id)

res.json({message:"Booking cancelled"})

}catch(error){

res.status(500).json({message:error.message})

}

}