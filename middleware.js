const { get } = require("lodash")
const { decode } = require('./util/jwt.util')

const requiresUser = async (req, res, next) => {
    const { decoded } = decode(req, res)
    req.user = decoded
    return next()
}
module.exports = requiresUser
