const User = require("../models/User")

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: "Email already registered" })
    }

    const user = new User({
      name,
      email,
      password,
      role: "user"
    })

    await user.save()

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.getUsers = async (_req, res) => {
  try {
    const users = await User.find().select("-password")
    return res.json(users)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const { name, email } = req.body

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    ).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.json(user)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}
