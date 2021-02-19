const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const testData = require('./test_blog_data').listWithManyBlogs

const api = supertest(app)

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

describe('blog api tests', () => {
  let userToken = null

  const username = "username"
  const password = "password"

  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    await api.post('/api/users').send({ username, password })
    const response = await api.post('/api/login').send({ username, password })
    userToken = "".concat("bearer ", response.body.token)

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

    await api.post('/api/blogs').send(newBlog).set({ Authorization: userToken }).expect(201).expect('Content-Type', /application\/json/)

    const blogs = await blogsInDb()
    expect(blogs).toHaveLength(testData.length + 1)
    expect(blogs[blogs.length-1].title).toBe(newBlog.title)
    expect(blogs[blogs.length-1].author).toBe(newBlog.author)
    expect(blogs[blogs.length-1].url).toBe(newBlog.url)
  })

  test('a blog post cant be added without valid token', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Author',
      url: 'http://www.blog.pl',
      likes: 5,
    }

    await api.post('/api/blogs').send(newBlog).expect(401)
  })

  test('reject blogs with missing title or url', async () => {
    const blogA = {
      title: 'Title',
      author: 'Author',
    }

    await api.post('/api/blogs').send(blogA).set({ Authorization: userToken }).expect(400)

    const blogB = {
      url: 'http://www.blog.pl',
      author: 'Author',
    }

    await api.post('/api/blogs').send(blogB).set({ Authorization: userToken }).expect(400)
  })

  test('likes property defaults to 0', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Author',
      url: 'http://www.blog.pl',
    }

    await api.post('/api/blogs').send(newBlog).set({ Authorization: userToken }).expect(201).expect('Content-Type', /application\/json/)

    const blogs = await blogsInDb()
    expect(blogs[blogs.length-1].likes).toBe(0)
  })

  test('a blog post can be deleted', async () => {
    const newBlog = {
      title: 'Test Blog',
      author: 'Author',
      url: 'http://www.blog.pl',
      likes: 5,
    }

    await api.post('/api/blogs').send(newBlog).set({ Authorization: userToken })

    const blogsBefore = await blogsInDb()
    const deletedBlog = blogsBefore[blogsBefore.length - 1]

    await api.delete(`/api/blogs/${deletedBlog.id}`).set({ Authorization: userToken }).expect(204)

    let blogs = await blogsInDb()
    expect(blogs.length).toBe(testData.length)

    await api.delete(`/api/blogs/${deletedBlog.id}`).set({ Authorization: userToken }).expect(404)
    blogs = await blogsInDb()
    expect(blogs.length).toBe(testData.length)
  })

  test('a blog post like count can be updated', async () => {
    const newLikes = 666;
    const blogs = await blogsInDb()
    const blogToUpdate = blogs[0]
    blogToUpdate.likes = newLikes

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(blogToUpdate)

    const updatedBlogs = await blogsInDb()
    expect(updatedBlogs[0].likes).toBe(newLikes)
  })

})

afterAll(() => {
  mongoose.connection.close()
})
