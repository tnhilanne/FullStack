import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'
import SearchFilter from './components/SearchFilter'
import PhonebookForm from './components/PhonebookForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  //event handler for name input 
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  //event handler for number input 
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  // Getting initial data from server
  useEffect(() => {
    phonebookService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  // Add a new person to the phonebook
  const addPerson = (event) => {
    event.preventDefault()
    // Prevented adding duplicate names to the phonebook by using the some() method
    if (persons.some((x) => x.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
  }
  // Create the new person without id and save to server
  const personObject = { name: newName, number: newNumber }
  console.log('Person added to server', personObject)
  phonebookService
    .create(personObject)
    .then((savedPerson) => {
      setPersons((x) => x.concat(savedPerson))
      setNewName('')
      setNewNumber('')
    })
  }

  // Delete a person from the phonebook
  const handleDeletePerson = (id, name) => {
    if (!window.confirm(`Delete ${name} ?`)) return

    phonebookService
      .remove(id)
      .then(() => {
        setPersons((x) => x.filter((p) => p.id !== id))
      })
      .catch((error) => {
        console.error('Failed to delete person:', error)
        setPersons((x) => x.filter((p) => p.id !== id))
      })
  }
  // Filter persons to show based on the filter input and using toLowerCase() for case insensitivity
  const personsToShow = persons.filter((x) => x.name.toLowerCase().includes(filter.toLowerCase()))

  //three components are used: SearchFilter, PhonebookForm, and Persons
  return (
      <div>
        <h2>Phonebook</h2>
        <SearchFilter filter={filter} onFilterChange={handleFilterChange} />
        <h2>Add new person</h2>
        <PhonebookForm
          onSubmit={addPerson}
          newName={newName}
          onNameChange={handleNameChange}
          newNumber={newNumber}
          onNumberChange={handleNumberChange}
        />
        <h2>Numbers</h2>
        <Persons persons={personsToShow} onDelete={handleDeletePerson} />

      {/*<div>Debugging: {newName} {newNumber}</div>*/}

    </div>
  )
}

export default App