require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

// Serve static files from the 'dist' directory for frontend  build
app.use(express.static('dist'))
app.use(express.json())

// app.use(morgan('tiny'))

// Custom token to log the body of POST requests
morgan.token('body', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]


// Return all phonebook entries from the database
app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(personsFromDb => {
      response.json(personsFromDb)
      //console.log('Fetched persons from database:', personsFromDb)
    })
    .catch(next)
})

// Return a single phonebook entry by id
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
    
      }
      response.json(person)
    })
    .catch(next)
})

// Generate an id for a new person added to the phonebook
const generateId = () => {
  // Use a large range random number to avoid duplicates
  const randomId = Math.floor(Math.random() * 1000000000)
  return String(randomId)
}

// Using post to add a new person to the phonebook
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
  .catch(error => {
    console.log(error.message)
    next(error)
    })
  })
  

// Info page showing number of people in the phonebook and the current time and date
app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const currentTime = new Date()
      response.send(
        `<p>Phonebook has info for ${count} people</p>` +
        `<p>${currentTime}</p>`
      )
    })
    .catch(next)
})

// Delete a person by id
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Update person's information only if the provided name already exists in DB
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  // Check that the name exists somewhere in the phonebook
  Person.findOne({ name })
    .then(found => {
      // Update the person if name exists
      return Person.findById(request.params.id)
        .then(person => {
          if (!person) {
            return response.status(404).end()
          }
          
          person.name = name
          person.number = number

          return person.save().then((updatedPerson) => {
            response.json(updatedPerson)
          })
        })
    })
    .catch(error => next(error))
})

// Error handling middleware
const errorHandler = (error, request, response, next) => {
  //console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

// Use the PORT environment variable
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
