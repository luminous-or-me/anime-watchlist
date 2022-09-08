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

describe('addition of a new anime', () => {
    test('succeeds with valid data', async () => {
        const newAnime = {
            name: 'New Anime',
            link: 'newurl',
            watched: false
        }

        await api
            .post('/api/anime')
            .send(newAnime)
            .expect(201)

        const response = await api.get('/api/anime')

        const animeAtEnd = response.body.map(b => {
            return {
                name: b.name,
                link: b.link,
                watched: b.watched
            }
        })

        expect(response.body).toHaveLength(initialAnime.length + 1)
        expect(animeAtEnd).toContainEqual(newAnime)
    })

    test('fails with suitable code if data invalid', async () => {
        const animeWithoutName = {
            link: 'newlink',
            watched: false
        }

        const animeWithoutLink = {
            name: 'New Anime',
            watched: false
        }

        await api
            .post('/api/anime')
            .send(animeWithoutName)
            .expect(400)

        await api
            .post('/api/anime')
            .send(animeWithoutLink)
            .expect(400)

        const response = await api.get('/api/anime')
        
        expect(response.body).toHaveLength(initialAnime.length)
    })

    test('defaults watched to false if not provided', async () => {
        const animeWithoutWatched = {
            name: 'New Anime',
            link: 'newurl'
        }

        const response = await api
            .post('/api/anime')
            .send(animeWithoutWatched)
            .expect(201)
        
        expect(response.body.watched).toBeDefined()
        expect(response.body.watched).toBeFalsy()
    })
})

afterAll(() => {
    mongoose.connection.close()
})