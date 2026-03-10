const axios = require("axios")

const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || "http://localhost:5001"

const getEventById = async (eventId) => {

  const response = await axios.get(`${EVENT_SERVICE_URL}/api/events/${eventId}`)

  return response.data

}

const updateEventById = async (eventId, payload) => {

  const response = await axios.put(`${EVENT_SERVICE_URL}/api/events/${eventId}`, payload)

  return response.data

}

module.exports = { getEventById, updateEventById }
