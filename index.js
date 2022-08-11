const express = require('express')

const app = express()

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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})