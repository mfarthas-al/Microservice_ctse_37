const express = require("express")

const router = express.Router()

const { register, login, getUsers, updateUser } = require("../controllers/userController")

router.post("/register", register)
router.post("/login", login)
router.get("/", getUsers)
router.put("/:id", updateUser)

module.exports = router
