const Post = require("../model/post.model")
const Comment = require("../model/comment.model")

function createComment(input) {
    return Comment.create(input)
}

function findComment(query, options = { lean: true }) {
    return Comment.find(query, {}, options)
}

function createPost(input) {
    return Post.create(input)
}

function findPost(query, options = { lean: true }) {
    return Post.findOne(query, {}, options)
}

function findAllPosts() {
    return Post.find()
}

function findAndUpdatePost(query, update, options = { lean: true }) {
    return Post.findOneAndUpdate(query, update, options)
}

function deletePost(query) {
    return Post.deleteOne(query)
}

module.exports = { createComment, findComment, createPost, findPost, findAllPosts, findAndUpdatePost, deletePost }