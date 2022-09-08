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

afterAll(() => {
    mongoose.connection.close()
})