const animeRouter = require('express').Router()
const Anime = require('../models/anime')
const User = require('../models/user')

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

animeRouter.post('/', async (req, res, next) => {
    const user = await User.findOne({})

    const newAnime = new Anime({
        ...req.body,
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