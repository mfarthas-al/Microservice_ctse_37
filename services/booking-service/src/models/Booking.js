const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({

userId:{
type:String,
required:true
},

eventId:{
type:String,
required:true
},

seats:{
type:Number,
required:true
},

seatNumbers:{
type:[Number],
default:[]
},

status:{
type:String,
default:"BOOKED"
},

createdAt:{
type:Date,
default:Date.now
}

})

module.exports = mongoose.model("Booking",bookingSchema)