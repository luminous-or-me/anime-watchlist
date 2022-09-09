const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        res.status(400).send({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        res.status(401).send({ error: 'token missing or invalid' })
    }

    next()
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        req.token = authorization.substring(7)
    }

    next()
}

const userExtractor = async (req, res, next) => {
    const token = req.token
    if (token) {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (decodedToken.id) {
            req.user = await User.findById(decodedToken.id)
        }
    }

    next()
}

module.exports = {
    errorHandler,
    tokenExtractor,
    userExtractor
}