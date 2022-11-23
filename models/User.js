const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Passwords is required"],
  },
})

const Post = mongoose.model("User", UserSchema)
module.exports = Post
