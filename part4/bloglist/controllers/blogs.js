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

// PUT (update) a blog by id
blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

// DELETE a blog by id, status code 204 
blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter