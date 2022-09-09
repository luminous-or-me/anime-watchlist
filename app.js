const express = require('express')
require('express-async-errors')
const app = express()
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const morgan = require('morgan')
const cors = require('cors')
const middleware = require('./utils/middleware')
const animeRouter = require('./controllers/anime')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(result => logger.info('connected to MongoDB'))
    .catch(error => logger.error('error connecting to MongoDB:', error.message))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }

    return " "
})

app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/anime', morgan(':method :url :status :res[content-length] - :response-time ms :body'), animeRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.errorHandler)

module.exports = app