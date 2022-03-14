const { omit } = require("lodash");
const User = require("../model/user.model");

async function createUser(input) {
    try {
        return await User.create(input)
    } catch (error) {
        log.error(error)
    }
}

async function findUser(query) {
    return User.findOne(query).lean();
}

async function validatePassword({ email, password }) {
    const user = await User.findOne({ email })
    if (!user) return false

    const isValid = await user.comparePassword(password)
    if (!isValid) return false

    return omit(user.toJSON(), ['password', 'Tokens'])
}

async function updateSession(query, update) {
    return User.updateOne(query, update, { new: true })
}

async function findSession(query) {
    const user = await findUser(query)
    return omit(user, ['password', 'Tokens'])
}

module.exports = { createUser, findUser, validatePassword, updateSession, findSession }