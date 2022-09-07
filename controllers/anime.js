const animeRouter = require('express').Router()
const Anime = require('../models/anime')

animeRouter.get('/', async (req, res) => {
    const anime = await Anime.find({})
    res.json(anime)
})

animeRouter.get('/:id', async (req, res, next) => {
    try {
        const foundAnime = await Anime.findById(req.params.id)

        if (foundAnime) {
            res.json(foundAnime)
        } else {
            res.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

animeRouter.post('/', async (req, res, next) => {
    try {
        const newAnime = new Anime(req.body)

        const savedAnime = await newAnime.save()

        res.status(201).json(savedAnime)
    } catch (error) {
        next(error)
    }
})

animeRouter.delete('/:id', async (req, res, next) => {
    try {
        await Anime.findByIdAndDelete(req.params.id)
        res.status(204).end()
    } catch (error) {
        next(error)
    }
})

animeRouter.put('/:id', async (req, res, next) => {
    try {
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
    } catch (error) {
        next(error)
    }
})

module.exports = animeRouter