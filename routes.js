const { createPostHandler, deletePostHandler, getAllPostsHandler, getPostHandler, updatePostHandler, createCommentHandler, getCommentHandler } = require("./controller/post.controller")
const { createSessionHandler, createUserHandler, getUserSessionHandler, removeSessionHandler } = require("./controller/user.controller")
const requiresUser = require("./middleware")

module.exports = function routes(app) {
    app.get('/', (req, res) => {
        res.send({ msg: 'Hello' })
    })

    //register user 
    //POST /api/user
    app.post('/api/register', createUserHandler)

    //Login 
    //POST /api/sessionsvalidateRequest
    app.post('/api/login', createSessionHandler)

    // SEssion 
    //GET 
    app.get('/api/session', requiresUser, getUserSessionHandler)

    //Logout
    //DELETE /api/sessions
    app.delete('/api/logout', requiresUser, removeSessionHandler)

    //Create a post
    app.post('/api/post', requiresUser, createPostHandler)

    //Update a post
    app.patch('/api/editpost', requiresUser, updatePostHandler)

    //Get a post
    app.get('/api/singlepost', getPostHandler)

    //Get all post
    app.get('/api/allposts', getAllPostsHandler)

    //Delete a post
    app.delete('/api/delpost', requiresUser, deletePostHandler)

    // add a comment
    app.post('/api/post/comment', requiresUser, createCommentHandler)

    // get all comments
    app.get('/api/post/comment', getCommentHandler)
}