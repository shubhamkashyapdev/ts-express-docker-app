import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    body: {
        type: String,
        required: [true, 'Body is required']
    }
})

const Post = mongoose.model('post', PostSchema)
export default Post
