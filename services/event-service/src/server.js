import "dotenv/config"

import express from "express"
import cors from "cors"

import connectDB from "./config/db.js"
import eventRoutes from "./routes/eventRoutes.js"

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

app.use("/api/events", eventRoutes)

const PORT = process.env.PORT || 3002

app.listen(PORT, () => {
  console.log(`Event Service running on port ${PORT}`)
})
