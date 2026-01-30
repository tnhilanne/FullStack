const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

// Use the connection string from environment variable for better security
const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)
const person = new Person({
  name: name,
  number: number,
})

//if no name or number provided, print all entries in phonebook

// if (!name || !number) {
// Person.find({}).then(result => {
//   result.forEach(person => {
//     console.log(person)
//   }) 
//   mongoose.connection.close()
// })
// }

//if both name and number provided, add new entry to phonebook

// if (name && number) {
// person.save().then(result => {
//   console.log('added', name, 'number', number, 'to phonebook') 
//   mongoose.connection.close()
// })
// }

module.exports = mongoose.model('Person', personSchema)
