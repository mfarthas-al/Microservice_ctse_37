//auth controller for user management service
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens.js");

const mapUserProfile = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    bio: user.bio || "",
    interests: Array.isArray(user.interests) ? user.interests : [],
    location: user.location || "",
    website: user.website || "",
    tagline: user.tagline || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const allowedRoles = ["organizer", "attendee"];
    const safeRole = allowedRoles.includes(role) ? role : "attendee";

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: safeRole,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: mapUserProfile(user),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Register error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: mapUserProfile(user),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: req.user,
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const validateToken = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Token is valid",
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.error("Validate token error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No active session found",
      });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token mismatch",
      });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token mismatch",
      });
    }

    user.refreshToken = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    console.error("Get all users error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user
    });
  } catch (error) {
    console.error("Get user by id error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ["admin", "organizer", "attendee"];

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required"
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role"
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (req.user._id.toString() === id && role !== "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin cannot demote themselves"
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: mapUserProfile(user)
    });
  } catch (error) {
    console.error("Update user role error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const { name, email, bio, interests, location, website, tagline } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Email already in use"
        });
      }

      user.email = email.toLowerCase();
    }

    if (name) {
      user.name = name;
    }

    if (typeof bio === "string") {
      user.bio = bio.trim();
    }

    if (Array.isArray(interests)) {
      user.interests = interests
        .map((item) => String(item).trim())
        .filter(Boolean)
        .slice(0, 20);
    }

    if (typeof interests === "string") {
      user.interests = interests
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .slice(0, 20);
    }

    if (typeof location === "string") {
      user.location = location.trim();
    }

    if (typeof website === "string") {
      user.website = website.trim();
    }

    if (typeof tagline === "string") {
      user.tagline = tagline.trim();
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: mapUserProfile(user)
    });
  } catch (error) {
    console.error("Update my profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const deleteMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await User.findByIdAndDelete(req.user._id);

    return res.status(200).json({
      success: true,
      message: "Your account has been deleted successfully"
    });
  } catch (error) {
    console.error("Delete my profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

const deleteUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete their own account through this route"
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin users cannot be deleted through this route"
      });
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Delete user by admin error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  validateToken,
  refreshAccessToken,
  logoutUser,
  getAllUsers,
  getUserById,
  updateUserRole,
  updateMyProfile,
  deleteMyProfile,
  deleteUserByAdmin
};
