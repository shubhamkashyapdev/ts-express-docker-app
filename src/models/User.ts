import mongoose, { Document } from 'mongoose'

interface UserDocument extends Document {
    name: string
    email: string
    password: string
}

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Passwords is required']
    }
})

const User = mongoose.model<UserDocument>('User', UserSchema)
export default User
