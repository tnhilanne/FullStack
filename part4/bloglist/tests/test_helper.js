/* Helper for writing tests, defines initial blogs and utility functions */

const Blog  = require('../models/blog')

const initialBlogs = [
  {
    title: "Some test blog",
    author: "Testi Testaaja",
    url: "https://testrandomexampleblog999.com",
    likes: 5
  },
  {
    title: "Some other blog",
    author: "Uusi Uusinen",
    url: "https://testrandomexampleblog888.com",
    likes: 10
  },
  {
    title: "Random test blog",
    author: "Author Random",
    url: "https://testrandomexampleblog777.com",
    likes: 16
  }
]

// Generate a valid but non-existing blog ID
const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'test', url: 'https://test.com', likes: 0 })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}