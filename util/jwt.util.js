const jwt = require('jsonwebtoken')
const { get } = require('lodash')

function sign(object, options) {
    return jwt.sign(object, process.env.SECRET_KEY, options)
}

function decode(req, res) {
    const token = get(req, 'headers.token')
    if (!token) {
        res.status(402).send({ msg: 'token required' })
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        return { valid: true, expired: false, decoded }
    } catch (e) {
        console.error({ e })
        return {
            decoded: null
        }
    }
}

module.exports = { decode, sign }