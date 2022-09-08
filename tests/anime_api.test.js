const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const Anime = require('../models/anime')
const helper = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
    await Anime.deleteMany({})

    const animeObjects = helper.initialAnime.map(a => new Anime(a))
    const promiseArray = animeObjects.map(a => a.save())
    await Promise.all(promiseArray)
}, 25000)

describe('when there are initially some animes', () => {
    test('correct number of animes is retuned', async () => {
        const animeInDb = await helper.animeInDb()

        expect(animeInDb).toHaveLength(helper.initialAnime.length)
    })

    test('an anime has id as identifier', async () => {
        const animeInDb = await helper.animeInDb()

        expect(animeInDb).toBeDefined()
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

        const animeInDb = await helper.animeInDb()

        const animeAtEnd = animeInDb.map(b => {
            return {
                name: b.name,
                link: b.link,
                watched: b.watched
            }
        })

        expect(animeAtEnd).toHaveLength(helper.initialAnime.length + 1)
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

        const animeAtEnd = await helper.animeInDb()

        expect(animeAtEnd).toHaveLength(helper.initialAnime.length)
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

describe('deletion of an anime', () => {
    test('succeeds if anime existing', async () => {
        const animeAtStart = await helper.animeInDb()
        const animeToDelete = animeAtStart[0]

        await api
            .delete(`/api/anime/${animeToDelete.id.toString()}`)
            .expect(204)

        const animeAtEnd = await helper.animeInDb()

        expect(animeAtEnd).toHaveLength(helper.initialAnime.length - 1)
    })

    test('doesn\'t fail if anime not existing', async () => {
        const id = await helper.nonExistingId()
        await api
            .delete(`/api/anime/${id}`)
            .expect(204)
    })

    test('fails with suitable code if id malformatted', async () => {
        await api
            .delete(`/api/anime/invalid_id`)
            .expect(400)
    })
})

afterAll(() => {
    mongoose.connection.close()
})