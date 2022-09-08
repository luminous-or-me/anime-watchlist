const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (req, res, next) => {
    try {
        const { username, name, password } = req.body

        if (!password) {
            return res.status(400).json({
                error: 'password missing'
            })
        }

        if (password.length < 3) {
            return res.status(400).json({
                error: 'password shorter than three characters'
            })
        }

        const user = await User.findOne({ username })
        if (user) {
            return res.status(400).json({
                error: 'username already taken'
            })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)

        const newUser = new User({
            username,
            name,
            passwordHash
        })

        await newUser.save()

        res.status(201).json(newUser)
    } catch (error) {
        next(error)
    }
})

module.exports = usersRouter