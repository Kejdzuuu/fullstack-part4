const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

blogsRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/api/blogs', async (request, response) => {
  const blog = new Blog(request.body)

  if (!blog.title || !blog.url) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  if (blog.likes === undefined) {
    blog.likes = 0
  }

  const users = await User.find({})

  if (users) {
    blog.user = users[0]._id
  } else {
    blog.user = 'None'
  }

  const savedBlog = await blog.save()

  if (savedBlog.user !== 'None') {
    users[0].blogs = users[0].blogs.concat(savedBlog._id)
    await users[0].save()
  }

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/api/blogs/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/api/blogs/:id', async (request, response) => {
  const newLikesValue = request.body.likes;
  const blog = await Blog.findById(request.params.id)

  if (blog) {
    blog.likes = newLikesValue;
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter
