/* Route handlers extracted into own module.
Event handlers of routes are referred to as controllers */

const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// GET all blogs with async/await
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  //console.log(blogs)
  response.json(blogs)
})

// POST a new blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogsRouter