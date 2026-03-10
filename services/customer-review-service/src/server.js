require("dotenv").config()

const express = require("express")
const cors = require("cors")

const connectDB = require("./config/db")
const reviewRoutes = require("./routes/reviewRoutes")

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/reviews", reviewRoutes)

const PORT = process.env.PORT || 5004

app.listen(PORT, () => {
  console.log(`Customer Review Service running on port ${PORT}`)
})
