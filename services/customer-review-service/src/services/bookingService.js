const axios = require("axios")

const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || "http://booking-service:3003"

const bookingClient = axios.create({
  baseURL: BOOKING_SERVICE_URL,
  timeout: 5000
})

const getMyBookings = async (authorizationHeader) => {
  const response = await bookingClient.get("/api/bookings", {
    headers: {
      Authorization: authorizationHeader
    }
  })

  return response?.data || []
}

module.exports = {
  getMyBookings
}
