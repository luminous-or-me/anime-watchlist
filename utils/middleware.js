const logger = require('./logger')

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        res.status(400).send({ error: error.message })
    }

    next()
}

module.exports = {
    errorHandler
}