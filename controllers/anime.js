const animeRouter = require('express').Router()
const Anime = require('../models/anime')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

animeRouter.get('/', async (req, res) => {
    const anime = await Anime
        .find({})
        .populate('user', {
            username: 1,
            name: 1
        })
    res.json(anime)
})

animeRouter.get('/:id', async (req, res, next) => {
    const foundAnime = await Anime.findById(req.params.id)

    if (foundAnime) {
        res.json(foundAnime)
    } else {
        res.status(404).end()
    }
})

const getTokenFrom = req => {
    const authorization = req.get('Authorization')

    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
}

animeRouter.post('/', async (req, res, next) => {
    const body = req.body

    const token = getTokenFrom(req)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
        return res.status(401).json({
            error: 'token missing or invalid'
        })
    }

    const user = await User.findById(decodedToken.id)

    const newAnime = new Anime({
        ...body,
        user: user._id
    })
    const savedAnime = await newAnime.save()

    user.anime = user.anime.concat(savedAnime._id)
    await user.save()

    res.status(201).json(savedAnime)
})

animeRouter.delete('/:id', async (req, res, next) => {
    await Anime.findByIdAndDelete(req.params.id)
    res.status(204).end()
})

animeRouter.put('/:id', async (req, res, next) => {
    const updatedAnime = await Anime.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
            context: 'query'
        }
    )

    res.json(updatedAnime)
})

module.exports = animeRouter