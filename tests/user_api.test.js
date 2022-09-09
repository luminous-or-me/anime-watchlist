const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const app = require('../app')
const supertest = require('supertest')

const api = supertest(app)

const initialUsers = [
    {
        username: 'username1',
        name: 'Full Name 1',
        password: 'password1'
    },
    {
        username: 'username2',
        name: 'Full Name 2',
        password: 'password2'
    },
    {
        username: 'username3',
        name: 'Full Name 3',
        password: 'password3'
    }
]

beforeEach(async () => {
    await User.deleteMany({})

    const user1 = new User({
        username: initialUsers[0].username,
        name: initialUsers[0].name,
        passwordHash: await bcrypt.hash(initialUsers[0].password, 10)
    })

    const user2 = new User({
        username: initialUsers[1].username,
        name: initialUsers[1].name,
        passwordHash: await bcrypt.hash(initialUsers[1].password, 10)
    })

    const user3 = new User({
        username: initialUsers[2].username,
        name: initialUsers[2].name,
        passwordHash: await bcrypt.hash(initialUsers[2].password, 10)
    })

    await user1.save()
    await user2.save()
    await user3.save()
}, 15000)

describe('when there are initially some users', () => {
    test('correct number of users is returned', async () => {
        const response = await api.get('/api/users')
        expect(response.body).toHaveLength(initialUsers.length)
    })
})

describe('addition of users', () => {
    test('succeeds with valid data', async () => {
        const newUser = {
            username: 'newusername',
            name: 'New Full Name',
            password: 'newpassword'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
        
        const response = await api.get('/api/users')

        const usernames = response.body.map(u => u.username)

        expect(response.body).toHaveLength(initialUsers.length + 1)
        expect(usernames).toContain(newUser.username)
    })

    describe('fails with appropriate status code if', () => {
        test('username, name, or password missing', async () => {
            const noUsername = {
                name: 'New Full Name',
                password: 'newpassword'
            }

            const noName = {
                username: 'newusername',
                password: 'newpassword'
            }

            const noPassword = {
                username: 'newusername',
                name: 'New Full Name'
            }

            await api
                .post('/api/users')
                .send(noUsername)
                .expect(400)

            await api
                .post('/api/users')
                .send(noName)
                .expect(400)
            
            await api
                .post('/api/users')
                .send(noPassword)
                .expect(400)
            
            const response = await api.get('/api/users')

            expect(response.body).toHaveLength(initialUsers.length)
        })

        test('username or password too short', async () => {
            const shortUsername = {
                username: 'ne',
                name: 'New Full Name',
                password: 'newpassword'
            }

            const shortPassword = {
                username: 'newusername',
                name: 'New Full Name',
                password: 'ne'
            }

            await api
                .post('/api/users')
                .send(shortUsername)
                .expect(400)
            
            await api
                .post('/api/users')
                .send(shortPassword)
                .expect(400)
            
            const response = await api.get('/api/users')

            expect(response.body).toHaveLength(initialUsers.length)
        })

        test('username not unique', async () => {
            const newUser = {
                username: 'newusername',
                name: 'New Full Name',
                password: 'newpassword'
            }

            await api
                .post('/api/users')
                .send(newUser)
                
            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)
        })
    })
})

afterAll(() => {
    mongoose.connection.close()
})