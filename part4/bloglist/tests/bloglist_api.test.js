const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

// Initialize database before each test using the helper
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

// Simple initial test to verify testing setup
test('initial testing', () => {
  console.log('testing setup works')
})

test('correct amount of blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

    // Verify that the number of blogs returned matches the initial blogs
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

// Verify that the default database identifier _id field is renamed to id
test('unique identifier of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach((blog) => {
    assert.strictEqual(blog._id, undefined)
    assert.ok(blog.id)
  })
})

// Verify that a blog can be added with POST
test('a blog can successfully be added ', async () => {
  const newBlog =   {
    title: 'Temporary test blog',
    author: 'Great Tester',
    url: 'https://temporarytest777.com',
    likes: 15
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  // Verify that the number of blogs has increased by one
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  // Verify that the new blog is among the returned blogs
  const contents = blogsAtEnd.map(n => n.title)
  assert(contents.includes('Temporary test blog'))
})

after(async () => {
  await mongoose.connection.close()
})