const express = require('express')

const app = express()

app.use(express.json())

let anime = [
    {
        id: 1,
        name: 'Demon Slayer',
        link: 'link 1',
    },
    {
        id: 2,
        name: 'My Hero Academia',
        link: 'link 2'
    },
    {
        id: 3,
        name: 'Cowboy Bebop',
        link: 'link 3'
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
    res.json(anime)
})

app.get('/api/anime/:id', (req, res) => {
    const id = Number(req.params.id)

    console.log(id)

    const foundAnime = anime.find(a => a.id === id)

    console.log(foundAnime)

    if (foundAnime) {
        res.json(foundAnime)
    } else {
        res.status(404).end()
    }
})

app.post('/api/anime', (req, res) => {
    const { name, link } = req.body

    if (!name && !link) {
        return res.status(400).json({ error: "name and link missing" })
    }

    if (!name) {
        return res.status(400).json({ error: "name missing" })
    }

    if (!link) {
        return res.status(400).json({ error: "link missing" })
    }

    
    if (anime.some(a => a.name === name)) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const id = Math.floor(Math.random() * 100000)

    const newAnime = {
        id: id,
        name: name,
        link: link
    }

    console.log(newAnime)

    anime = anime.concat(newAnime)

    res.json(newAnime)
})

app.delete('/api/anime/:id', (req, res) => {
    const id = Number(req.params.id)

    anime = anime.filter(a => a.id !== id)

    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})