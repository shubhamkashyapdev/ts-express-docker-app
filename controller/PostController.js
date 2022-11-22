const PostModel = require("../models/Post")
exports.getAllPosts = async (req, res, next) => {
  const posts = await PostModel.find({})
  res.status(200).json({
    type: "success",
    data: posts,
  })
}
exports.getPost = async (req, res, next) => {
  const id = req.params.id
  try {
    const post = await PostModel.findById(id)
    if (!post) {
      res.status(404).json({
        type: "error",
        message: `Post with id ${id} not found!`,
      })
      return
    }
    res.status(200).json({
      type: "success",
      data: post,
    })
  } catch (err) {
    res.status(500).json({
      type: "error",
      message: err.message,
    })
  }
}

exports.createPost = async (req, res, next) => {
  const postData = req.body
  try {
    const post = await PostModel.create(postData)
    res.status(200).json({
      type: "success",
      data: post,
    })
  } catch (err) {
    res.status(500).json({
      type: "error",
      message: err.message,
    })
  }
}

exports.updatePost = async (req, res) => {
  const id = req.params.id
  const newPostData = req.body
  try {
    const newPost = await PostModel.findByIdAndUpdate(id, newPostData, {
      runValidators: true,
      new: true,
    })
    res.status(200).json({
      type: "success",
      data: newPost,
    })
  } catch (error) {
    res.status(500).json({
      type: "error",
      message: err.message,
    })
  }
}

exports.deletePost = async (req, res) => {
  const id = req.params.id
  try {
    await PostModel.findByIdAndRemove(id)
    res.status(200).json({
      type: "success",
      message: `Post with id ${id} deleted successfully`,
    })
  } catch (err) {
    res.status(500).json({
      type: "error",
      message: err.message,
    })
  }
}
