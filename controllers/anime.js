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

animeRouter.post('/', async (req, res, next) => {
    if (!req.user) {
        return res
            .status(401)
            .send({
                error: 'token missing or invalid'
            })
    }

    const user = req.user
    const body = req.body

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
    if (!req.user) {
        return res
            .status(401)
            .send({
                error: 'token missing or invalid'
            })
    }
    const user = req.user
    const anime = await Anime.findById(req.params.id)

    if (!anime) {
        return res.status(204).end()
    }

    if (anime.user.toString() !== user._id.toString()) {
        return res.status(401).send({
            error: 'only the creator can delete an anime'
        })
    }

    await Anime.findByIdAndDelete(req.params.id)

    user.anime = user.anime.filter(a => a.toString() !== req.params.id)
    await user.save()

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