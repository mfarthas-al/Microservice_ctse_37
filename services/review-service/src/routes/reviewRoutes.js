const express = require("express")

const router = express.Router()

const {
createReview,
getReviews,
deleteReview
} = require("../controllers/reviewController")

router.post("/",createReview)

router.get("/",getReviews)

router.delete("/:id",deleteReview)

module.exports = router
