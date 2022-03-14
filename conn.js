const mongoose = require('mongoose')

const DB = process.env.DATABASE_KEY;
async function connect() {
    return mongoose.connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log('Mongodb Atlas Connected Successfully !')
    }).catch((e) => {
        console.log(e)
    })
}

module.exports = connect