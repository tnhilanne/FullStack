require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.json())

// Serve static files from the 'dist' directory for frontend  build
app.use(express.static('dist'))

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
app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(personsFromDb => {
      response.json(personsFromDb)
      console.log('Fetched persons from database:', personsFromDb)
    })
    .catch(err => {
      console.error('Error fetching persons from DB:', err.message)
      response.status(500).end()
    })
})

// Return a single phonebook entry by id
app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

// Generate an id for a new person added to the phonebook
const generateId = () => {
  // Use a large range random number to avoid duplicates
  const randomId = Math.floor(Math.random() * 1000000000)
  return String(randomId)
}

// Using post to add a new person to the phonebook
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Name or number is missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(err => {
      console.error('Error saving person:', err.message)
      response.status(500).json({ error: err.message })
    })
})

// Info page showing number of people in the phonebook and the current time and date
app.get('/info', (request, response) => {
  Person.countDocuments({})
    .then(count => {
      const currentTime = new Date()
      response.send(
        `<p>Phonebook has info for ${count} people</p>` +
        `<p>${currentTime}</p>`
      )
    })
    .catch(err => {
      console.error('Error counting persons:', err.message)
      response.status(500).end()
    })
})

// Delete a person by id
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
    //console.log(request.headers)
  response.status(204).end()
})

// Use the PORT environment variable
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
