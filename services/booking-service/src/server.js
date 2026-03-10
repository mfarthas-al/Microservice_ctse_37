require("dotenv").config()

const express = require("express")
const cors = require("cors")

const connectDB = require("./config/db")
const bookingRoutes = require("./routes/bookingRoutes")

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/bookings", bookingRoutes)

const PORT = process.env.PORT || 5002

app.listen(PORT, () => {
  console.log(`Booking Service running on port ${PORT}`)
})