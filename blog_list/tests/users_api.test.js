const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

describe('users api tests', () => {

  beforeEach(async () => {
    await User.deleteMany({})
  })

  test('new user can be added', async () => {
    const user = {
      username: 'user',
      password: 'password',
    }

    await api.post('/api/users').send(user).expect(201).expect('Content-Type', /application\/json/)

    const users = await usersInDb()
    expect(users).toHaveLength(1)
  }, 10000)

  test('new user has to have unique username', async () => {
    const user = {
      username: 'user',
      password: 'password',
    }

    await api.post('/api/users').send(user).expect(201).expect('Content-Type', /application\/json/)

    await api.post('/api/users').send(user).expect(400)
  }, 10000)

  test('reject users with no username', async () => {
    const user = {
      password: 'password',
    }

    await api.post('/api/users').send(user).expect(400)
  })

  test('reject users with too short username', async () => {
    const user = {
      username: 'dd',
      password: 'password',
    }

    await api.post('/api/users').send(user).expect(400)
  })

  test('reject users with no password', async () => {
    const user = {
      username: 'user',
    }

    await api.post('/api/users').send(user).expect(400)
  })

  test('reject users with too short password', async () => {
    const user = {
      username: 'user',
      password: 'dd',
    }

    await api.post('/api/users').send(user).expect(400)
  })

})

afterAll(() => {
  mongoose.connection.close()
})
