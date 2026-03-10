const axios = require("axios")

const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || "http://localhost:5002/api/bookings"

exports.bookingExists = async (bookingId)=>{

try{

const response = await axios.get(`${BOOKING_SERVICE_URL}/${bookingId}`)

return response.status === 200

}catch(error){

return false

}

}
