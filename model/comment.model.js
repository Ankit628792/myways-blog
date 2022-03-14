const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        postId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        message: {
            type: String,
        },
        email: {
            type: String,
        }
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;