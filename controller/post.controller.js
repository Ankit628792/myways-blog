const { get } = require("lodash");
const { createPost, findComment, createComment, deletePost, findAllPosts, findAndUpdatePost, findPost } = require("../service/post.service");

async function getCommentHandler(req, res) {
    const postId = get(req, 'query.postId')
    const post = await findComment({ postId: postId })
    if (!post) return res.sendStatus(404)
    return res.status(200).send(post)
}
async function createCommentHandler(req, res) {
    const userId = get(req, 'user._id')
    const body = req.body
    const post = await createComment({ ...body, user: userId })
    return res.status(201).send(post)
}

async function createPostHandler(req, res) {
    const userId = get(req, 'user._id')
    const body = req.body
    const post = await createPost({ ...body, user: userId })
    return res.status(201).send(post)
}
async function updatePostHandler(req, res) {
    const userId = get(req, 'user._id')
    const postId = get(req, 'query.postId')
    console.log(userId, postId)
    const update = req.body
    const post = await findPost({ postId: postId })
    if (!post) return res.sendStatus(404)
    if (String(post.user) !== userId) return res.sendStatus(401)

    const updatedPost = await findAndUpdatePost({ postId: postId }, update, { new: true })
    return res.status(200).send(updatedPost)
}
async function getPostHandler(req, res) {
    const postId = get(req, 'query.postId')
    const post = await findPost({ postId: postId })
    if (!post) return res.sendStatus(404)
    return res.status(200).send(post)
}

async function getAllPostsHandler(req, res) {
    const post = await findAllPosts()
    if (!post) return res.sendStatus(404)
    return res.status(200).send(post)
}


async function deletePostHandler(req, res) {
    const userId = get(req, 'user._id')
    const postId = get(req, 'query.postId')
    const post = await findPost({ postId: postId })
    if (!post) return res.sendStatus(404)
    if (String(post.user) !== userId) return res.sendStatus(401)

    await deletePost({ postId })
    return res.status(200).sendStatus(200)
}

module.exports = { createCommentHandler, getCommentHandler, createPostHandler, updatePostHandler, getPostHandler, getAllPostsHandler, deletePostHandler }