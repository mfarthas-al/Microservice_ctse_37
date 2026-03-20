const axios = require("axios")

const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || "http://event-service:5001"

const eventClient = axios.create({
  baseURL: EVENT_SERVICE_URL,
  timeout: 5000
})

const getEventById = async (eventId) => {
  const response = await eventClient.get(`/api/events/${eventId}`)
  return response?.data || null
}

module.exports = {
  getEventById
}
