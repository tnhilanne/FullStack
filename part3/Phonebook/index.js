const express = require('express')
const app = express()

app.use(express.json())

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

// Info page showing number of people in the phonebook and the current time and date
app.get('/info', (request, response) => {
  const count = persons.length
  const currentTime = new Date()
  response.send(
    `<p>Phonebook has info for ${count} people</p>` +
    `<p>${currentTime}</p>`
  )
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
