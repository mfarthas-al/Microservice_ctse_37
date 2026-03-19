import express from "express"
import multer from "multer"
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from "../controllers/eventController.js"
import {
  uploadImage,
  getBanner,
  updateBanner
} from "../controllers/assetController.js"

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post("/", createEvent)

router.get("/", getEvents)

router.post("/upload", upload.single("image"), uploadImage)

router.get("/banner", getBanner)

router.put("/banner", updateBanner)

router.get("/:id", getEventById)

router.put("/:id", updateEvent)

router.delete("/:id", deleteEvent)

export default router
