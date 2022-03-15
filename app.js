require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const connect = require('./conn')
const { createPostHandler, deletePostHandler, getAllPostsHandler, getPostHandler, updatePostHandler, createCommentHandler, getCommentHandler } = require("./controller/post.controller")
const { createSessionHandler, createUserHandler, getUserSessionHandler, removeSessionHandler } = require("./controller/user.controller")
const requiresUser = require("./middleware")

const port = process.env.PORT || 5000

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/hello', (req, res) => {
    res.send({ msg: 'Hello' })
})

//register user 
app.post('/api/register', createUserHandler)

//Login user
app.post('/api/login', createSessionHandler)

// Session 
app.get('/api/session', requiresUser, getUserSessionHandler)

//Logout
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

if (process.env.NODE_ENV == 'production') {
    const path = require('path');
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}
app.listen(port, () => {
    console.log(`Backend is running at Port ${port}`)
    connect()
})
