const axios = require("axios")

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://auth-service:3001"

const authClient = axios.create({
  baseURL: AUTH_SERVICE_URL,
  timeout: 5000
})

const validateAccessToken = async (authorizationHeader) => {
  const response = await authClient.get("/api/auth/validate", {
    headers: {
      Authorization: authorizationHeader
    }
  })

  return response?.data?.data || null
}

module.exports = {
  validateAccessToken
}
