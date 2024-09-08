const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    description: {
        type: String,
    },
    publishedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Comment', commentSchema)