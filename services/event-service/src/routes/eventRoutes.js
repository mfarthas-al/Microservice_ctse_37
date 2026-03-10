const express = require("express")

const router = express.Router()

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController")
const {
  uploadImage,
  getBanner,
  updateBanner
} = require("../controllers/assetController")

const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })

router.post("/", createEvent)

router.get("/", getEvents)

router.post("/upload", upload.single("image"), uploadImage)

router.get("/banner", getBanner)

router.put("/banner", updateBanner)

router.get("/:id", getEventById)

router.put("/:id", updateEvent)

router.delete("/:id", deleteEvent)

module.exports = router
