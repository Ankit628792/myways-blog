require('dotenv').config()
const routes = require('./routes')
const express = require('express');
const app = express();
const cors = require('cors');
const connect = require('./conn')
app.use(cors())

const port = process.env.PORT || 5000
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

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
    routes(app)
})
