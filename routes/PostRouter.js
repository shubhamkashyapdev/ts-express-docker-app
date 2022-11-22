const express = require("express")
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} = require("../controller/PostController")
const { authenticate } = require("../middlewares/AuthMiddleware")

const router = express.Router()

router.get("/", getAllPosts)
router.get("/:id", getPost)
router.post("/", authenticate, createPost)
router.patch("/:id", updatePost)
router.delete("/:id", deletePost)

module.exports = router
