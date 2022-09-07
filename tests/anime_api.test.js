const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const Anime = require('../models/anime')

const api = supertest(app)

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

beforeEach(async () => {
    await Anime.deleteMany({})

    const animeObjects = initialAnime.map(a => new Anime(a))
    const promiseArray = animeObjects.map(a => a.save())
    await Promise.all(promiseArray)
}, 25000)

describe('when there are initially some animes', () => {
    test('correct number of animes is retuned', async () => {
        const response = await api.get('/api/anime')

        expect(response.body).toHaveLength(initialAnime.length)
    })

    test('an anime has id as identifier', async () => {
        const response = await api.get('/api/anime')

        expect(response.body[0].id).toBeDefined()
    })
})

afterAll(() => {
    mongoose.connection.close()
})