const express = require("express")
const multer = require("multer")

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

const {
createBooking,
getBookings,
getBookedSeatsByEvent,
cancelBooking
} = require("../controllers/bookingController")
const {
uploadBannerImage,
getBanner,
updateBanner
} = require("../controllers/bannerController")

router.post("/",createBooking)

router.get("/",getBookings)

router.post("/banner/upload", upload.single("image"), uploadBannerImage)

router.get("/banner", getBanner)

router.put("/banner", updateBanner)

router.get("/event/:eventId/seats",getBookedSeatsByEvent)

router.delete("/:id",cancelBooking)

module.exports = router