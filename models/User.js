const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Passwords is required"],
  },
})

const Post = mongoose.model("users", UserSchema)
module.exports = Post
