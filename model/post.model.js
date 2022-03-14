const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const PostSchema = new mongoose.Schema(
    {
        postId: {
            type: String,
            required: true,
            unique: true,
            default: () => nanoid(10),
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        image: {
            type: String,
            required: true
        },
        body: {
            type: String,
            required: true
        },
        likes: {
            type: Number,
            default: 0
        }
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;