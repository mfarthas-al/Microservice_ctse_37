require("dotenv").config()

const express = require("express")
const cors = require("cors")

const connectDB = require("./config/db")
const userRoutes = require("./routes/userRoutes")

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/users", userRoutes)

const PORT = process.env.PORT || 5003

app.listen(PORT, () => {
  console.log(`User Management Service running on port ${PORT}`)
})
