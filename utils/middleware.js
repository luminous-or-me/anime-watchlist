const logger = require('./logger')

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

module.exports = {
    errorHandler,
    tokenExtractor
}