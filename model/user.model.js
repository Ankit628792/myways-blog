const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    Tokens: [{
        token: {
            type: String,
        }
    }]
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12)
    }
    next();
})

userSchema.methods.getToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id, name: this.name, email: this.email, phone: this.phone }, process.env.SECRET_KEY)
        this.Tokens = this.Tokens.concat({ token: token })
        await this.save();
        return token;
    } catch (error) {
        console.log(error)
    }
}
userSchema.methods.comparePassword = async function (condidatePassword) {
    const user = this;
    return bcrypt.compare(condidatePassword, user.password).catch(e => false)
}


const User = mongoose.model('USER', userSchema)

module.exports = User;