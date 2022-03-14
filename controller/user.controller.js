const { get, omit } = require("lodash");
const { createUser, findUser, validatePassword, findSession, updateSession } = require("../service/user.service");
const { sign } = require("../util/jwt.util");

async function createUserHandler(req, res) {
    try {
        const email = await findUser({ email: req.body.email });
        if (email) {
            res.status(401).send({ msg: 'Email already registered' })
        }
        const user = await createUser(req.body)
        return res.status(201).send(omit(user?.toJSON(), 'password'))
    } catch (error) {
        console.error(error)
        return res.status(400).send(error.message)
    }
}

async function createSessionHandler(req, res) {
    try {
        const user = await validatePassword(req.body);
        if (!user) { return res.status(401).send('Invalid Credentials'); }
        const token = sign(user)
        res.status(200).send({ token })
    } catch (error) {
        console.error(error)
        return res.status(400).send(error.message)
    }
}

async function removeSessionHandler(req, res) {
    const userId = get(req, 'user._id')
    await updateSession({ _id: userId }, { Token: [] })
    return res.status(200)
}

async function getUserSessionHandler(req, res) {
    const userId = get(req, 'user._id')
    const session = await findSession({ _id: userId })
    return res.status(200).send(session)
}

module.exports = { createUserHandler, createSessionHandler, removeSessionHandler, getUserSessionHandler }