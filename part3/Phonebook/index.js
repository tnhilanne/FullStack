const express = require('express')
const app = express()
const morgan = require('morgan')

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

// app.get('/', (request, response) => {
//   response.send('<h1>Hello Phonebook!</h1>')
// })

// Return hardcoded list of phonebook entries from http://localhost:3001/api/persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// Return a single phonebook entry by id
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

 // return not found status if it does not exist
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
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

  // return error if name or number is missing, tested with add_person.rest
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name or number is missing' 
    })
  }

  // return error if name already exists in phonebook, tested with add_person.rest
  const nameExists = persons.some(p => p.name === body.name)
  if (nameExists) {
    return response.status(400).json({
      error: 'Name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})

// Info page showing number of people in the phonebook and the current time and date
app.get('/info', (request, response) => {
  const count = persons.length
  const currentTime = new Date()
  response.send(
    `<p>Phonebook has info for ${count} people</p>` +
    `<p>${currentTime}</p>`
  )
})

// Delete a person by id
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
    //console.log(request.headers)
  response.status(204).end()
})

const PORT = process.env.PORT || 3001 // Use environment variable PORT or default to 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
