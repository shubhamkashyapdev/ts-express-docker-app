const express = require("express")
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controller/PostController")
const protect = require("../middlewares/authMiddleware")

const router = express.Router()

router.get("/", getAllPosts)
router.get("/:id", getPost)
router.post("/", protect, createPost)
router.patch("/:id", protect, updatePost)
router.delete("/:id", protect, deletePost)

module.exports = router
