const Anime = require('../models/anime')

const initialAnime = [
    {
        name: 'Anime 1',
        link: 'url1',
        watched: false
    },
    {
        name: 'Anime 2',
        link: 'url2',
        watched: false,
    },
    {
        name: 'Anime 3',
        link: 'url3',
        watched: true
    }
]

const animeInDb = async () => {
    const anime = await Anime.find({})
    return anime
}

const nonExistingId = async () => {
    const anime = new Anime({
        name: 'tobedeleted',
        link: 'tobedeleted'
    })

    await anime.save()

    await Anime.findByIdAndDelete(anime._id.toString())

    return anime._id.toString()
}

module.exports = {
    initialAnime,
    animeInDb,
    nonExistingId
}