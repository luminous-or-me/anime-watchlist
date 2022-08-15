require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Anime = require('./models/anime')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req, res) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }

    return " "
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let anime = [
    {
        id: 1,
        name: "My Hero Academia",
        link: "https://www.wcofun.com/anime/boku-no-hero-academia-english-subbed",
        watched: false
    },
    {
        id: 2,
        name: "Demon Slayer",
        link: "https://www.wcofun.com/anime/demon-slayer",
        watched: false
    },
    {
        id: 3,
        name: "Cowboy Bebop",
        link: "https://www.wcofun.com/anime/cowboy-bebop",
        watched: false
    },
    {
        id: 4,
        name: 'Steins;Gate',
        link: 'https://www.wcofun.com/anime/steins-gate',
        watched: true
    },
    {
        id: 5,
        name: 'Tomodachi Game',
        link: 'https://www.wcofun.com/anime/tomodachi-game',
        watched: true
    }
]

app.get('/info', (req, res) => {
    const body = `
    <div>
        <h1>Anime Watchlist</h1>
        <p>The watchlist currently has ${anime.length} entries</p>
        <p>${new Date().toUTCString()}</p>
    </div>
    `
    res.send(body)
})

app.get('/api/anime', (req, res) => {
    Anime.find({})
        .then(anime => res.json(anime))
})

app.get('/api/anime/:id', (req, res) => {
    const id = Number(req.params.id)

    const foundAnime = anime.find(a => a.id === id)

    if (foundAnime) {
        res.json(foundAnime)
    } else {
        res.status(404).end()
    }
})

app.post('/api/anime', (req, res) => {
    const newAnime = new Anime(req.body)

    newAnime.save()
        .then(result => {
            res.json(result)
        })
        .catch(error => res.send({ error: error.message }))
})

app.delete('/api/anime/:id', (req, res) => {
    const id = Number(req.params.id)

    anime = anime.filter(a => a.id !== id)

    res.status(204).end()
})

app.put('/api/anime/:id', (req, res) => {
    const id = Number(req.params.id)

    const newAnime = { ...req.body }

    anime = anime.map(a => a.id !== id? a : newAnime)

    res.json(newAnime)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})