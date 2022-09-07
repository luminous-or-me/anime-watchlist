const animeRouter = require('express').Router()
const Anime = require('../models/anime')

animeRouter.get('/', (req, res) => {
    Anime.find({})
        .then(anime => res.json(anime))
})

animeRouter.get('/:id', (req, res) => {
    Anime.findById(req.params.id)
        .then(result => {
            if (result) {
                res.json(result)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => res.status(400).send({ error: error.message }))
})

animeRouter.post('/', (req, res) => {
    const newAnime = new Anime(req.body)

    newAnime.save()
        .then(result => {
            res.json(result)
        })
        .catch(error => res.send({ error: error.message }))
})

animeRouter.delete('/:id', (req, res) => {
    Anime.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => res.status(400).send({ error: error.message }))
})

animeRouter.put('/:id', (req, res) => {
    Anime.findByIdAndUpdate(
        req.params.id,
        { ...req.body },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(result => res.json(result))
        .catch(error => res.status(400).send({ error: error.name }))

})

module.exports = animeRouter