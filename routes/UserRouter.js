const express = require("express")
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  login,
} = require("../controller/UserController")

const router = express.Router()

router.get("/", getAllUsers)
router.get("/:id", getUser)
router.post("/", createUser)
router.post("/login", login)
router.patch("/:id", updateUser)
router.delete("/:id", deleteUser)

module.exports = router
