const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]
// const name = process.argv[3]
// const number = process.argv[4]

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

// Define the schema for a person, validating name and number fields
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    required: true,
    validate: {
      validator: function(v) {
        if (!v) return false
        // the number must contain exactly one hyphen separating two parts
        const parts = v.split('-')
        if (parts.length !== 2) return false
        const [first, second] = parts
        // first part must be 2 or 3 digits
        if (!/^\d{2,3}$/.test(first)) return false
        // second part must consist only of digits
        if (!/^\d+$/.test(second)) return false
        return true
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    // returnedObject.name = returnedObject.name.toString()
    // returnedObject.number = returnedObject.number.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// const Person = mongoose.model('Person', personSchema)
// const person = new Person({
//   name: name,
//   number: number,
// })

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
