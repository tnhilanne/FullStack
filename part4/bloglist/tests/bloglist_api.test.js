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

test('if likes property is missing, it defaults to zero', async () => {
  const newBlog =   {
    title: 'Some test blog with no likes',
    author: 'Author Withoutlikes',
    url: 'https://testingblogwithoutlike123.com'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    console.log(response.body)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without title and url is not added', async () => {
  const newBlog =   {
    author: 'Author Notitleorurl',
    likes: 77
  }
    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

    // Verify that the number of blogs has not changed
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

// Verify that a blog can be deleted by using 204 status code (successful request, no content returned)
test('a blog is successfully deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    console.log('Deleting blog:', blogToDelete)
    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(n => n.id)
    assert(!ids.includes(blogToDelete.id))
    // Verify that the number of blogs has decreased by one
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

// Verify that a blog can be updated
test.only('a blog is successfully updated', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[1]

  // Prepare updated blog data 
  const updatedBlogData = {
    title: blogToUpdate.title + ' (updated)',
    author: blogToUpdate.author + ' (updated)',
    url: blogToUpdate.url + '/updated',
    likes: blogToUpdate.likes + 1
  }
  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlogData)
    .expect(200)
    .expect('Content-Type', /application\/json/)
  console.log('Updated blog response:', response.body)

  // Verify that the blog data has been updated correctly
  assert.strictEqual(response.body.likes, updatedBlogData.likes)
  assert.strictEqual(response.body.title, updatedBlogData.title)
  assert.strictEqual(response.body.author, updatedBlogData.author)
  assert.strictEqual(response.body.url, updatedBlogData.url)
  assert.strictEqual(response.body.id, blogToUpdate.id)
  
})

// After testing, close the Mongoose database connection
after(async () => {
  await mongoose.connection.close()
})