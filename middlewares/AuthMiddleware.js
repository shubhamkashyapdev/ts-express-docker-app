const jwt = require("jsonwebtoken")
const UserModel = require("../models/User")
exports.authenticate = async (req, res, next) => {
  const bearerToken = req.headers.authorization
  const token = bearerToken.split(" ")[1]
  if (!token) {
    res.status(401).json({
      type: "error",
      message: `User is not authenticated, please pass a valid token`,
    })
  }
  // decode token
  try {
    const payload = jwt.verify(token, "jwt")
    const user = await UserModel.findById(payload?.id)
    if (!user) {
      res.status(404).json({
        type: "error",
        message: `User with id: ${payload.id} does not exist`,
      })
    }
    req.user = user
    next()
  } catch (err) {
    res.status(500).json({
      type: "error",
      message: err.message,
    })
  }
}
