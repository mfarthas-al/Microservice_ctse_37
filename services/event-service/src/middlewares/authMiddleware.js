import { validateAccessToken } from "../services/authService.js"

export const protect = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      success: false,
      message: "Access token is missing"
    })
  }

  try {
    const user = await validateAccessToken(authorizationHeader)

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      })
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }

    next()
  } catch (error) {
    if (!error.response) {
      return res.status(503).json({
        success: false,
        message: "Authentication service unavailable"
      })
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    })
  }
}
