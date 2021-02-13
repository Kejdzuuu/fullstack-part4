const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const testData = require('./test_blog_data').listWithManyBlogs

const api = supertest(app)

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

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

test('a blog post can be added', async () => {
  const newBlog = {
    title: 'Test Blog',
    author: 'Author',
    url: 'http://www.blog.pl',
    likes: 5,
  }

  await api.post('/api/blogs').send(newBlog).expect(201).expect('Content-Type', /application\/json/)

  const blogs = await blogsInDb()
  expect(blogs).toHaveLength(testData.length + 1)
  expect(blogs[blogs.length-1].title).toBe(newBlog.title)
  expect(blogs[blogs.length-1].author).toBe(newBlog.author)
  expect(blogs[blogs.length-1].url).toBe(newBlog.url)
})

afterAll(() => {
  mongoose.connection.close()
})
