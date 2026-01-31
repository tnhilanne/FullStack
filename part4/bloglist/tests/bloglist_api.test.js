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

test.only('unique identifier of the blog posts is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach((blog) => {
    assert.strictEqual(blog._id, undefined)
    assert.ok(blog.id)
  })
})

after(async () => {
  await mongoose.connection.close()
})