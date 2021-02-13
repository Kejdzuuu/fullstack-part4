const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const testData = require('./test_blog_data').listWithManyBlogs

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogs = testData.map(blog => new Blog(blog))
  const promiseArray = blogs.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('correct amount of blogs returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(testData.length)
})

test('blog post has an id property', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

afterAll(() => {
  mongoose.connection.close()
})
