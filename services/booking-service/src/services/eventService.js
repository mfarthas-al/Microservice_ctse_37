const axios = require("axios")

const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || "http://event-service:3002"

const getEventById = async (eventId, authorizationHeader) => {

  const requestConfig = authorizationHeader
    ? {
        headers: {
          Authorization: authorizationHeader
        }
      }
    : undefined

  const response = await axios.get(`${EVENT_SERVICE_URL}/api/events/${eventId}`, requestConfig)

  return response.data

}

const updateEventById = async (eventId, payload, authorizationHeader) => {

  const requestConfig = authorizationHeader
    ? {
        headers: {
          Authorization: authorizationHeader
        }
      }
    : undefined

  const response = await axios.put(`${EVENT_SERVICE_URL}/api/events/${eventId}`, payload, requestConfig)

  return response.data

}

module.exports = { getEventById, updateEventById }
