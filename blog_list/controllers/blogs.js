const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

blogsRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  if(!blog.title || !blog.url) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  if (blog.likes === undefined) {
    blog.likes = 0
  }

  blog.save().then(result => {
    response.status(201).json(result)
  })
})

module.exports = blogsRouter
