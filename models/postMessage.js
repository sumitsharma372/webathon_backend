import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    name: String,
    creator: String,
    membersRequired: {
        type: Number,
        required: true
    },
    selectedFile: String,
    likes: {
        type: [String],
        default: []
    },

    approvedMembers: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
})


const PostMessage = mongoose.model('PostMessage', postSchema)
export default PostMessage;