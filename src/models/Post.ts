import mongoose, { Document } from 'mongoose'

interface PostDocument extends Document {
    title: string
    body: string
}

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

const Post = mongoose.model<PostDocument>('post', PostSchema)
export default Post
