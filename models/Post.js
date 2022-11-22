const mongoose = require("mongoose")

const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  body: {
    type: String,
    required: [true, "Body is required"],
  },
})

const Post = mongoose.model("post", PostSchema)
module.exports = Post
