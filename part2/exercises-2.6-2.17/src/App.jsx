import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'
import SearchFilter from './components/SearchFilter'
import PhonebookForm from './components/PhonebookForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

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
    // If name already exists, ask to replace number
    const existingPerson = persons.find((p) => p.name === newName)

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        phonebookService
          .update(existingPerson.id, updatedPerson)
            .then((returnedPerson) => {
              setPersons((x) => x.map((p) => (p.id !== existingPerson.id ? p : returnedPerson)))
                setNewName('')
                setNewNumber('')
                setNotification({ message: `Updated number for ${returnedPerson.name}`, type: 'success' })
                setTimeout(() => setNotification(null), 3000)
            })
            // Handle error if person to update is not found on server, notify user
          .catch((error) => {
            console.error('Failed to update person:', error)
            setPersons((x) => x.filter((p) => p.id !== existingPerson.id))
            setNotification({ message: `Information of ${existingPerson.name} has already been removed from server`, type: 'error' })
            setTimeout(() => setNotification(null), 3000)
          })
      }
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
        setNotification({ message: `Added ${savedPerson.name}`, type: 'success' })
        setTimeout(() => setNotification(null), 3000)
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
        setNotification({ message: `Information of ${name} has already been removed from server`, type: 'error' })
        setTimeout(() => setNotification(null), 3000)
      })
  }
  // Filter persons to show based on the filter input and using toLowerCase() for case insensitivity
  const personsToShow = persons.filter((x) => x.name.toLowerCase().includes(filter.toLowerCase()))

  //three components are used: SearchFilter, PhonebookForm, and Persons
  return (
      <div>
        <h2>Phonebook</h2>
        <Notification message={notification?.message} type={notification?.type} />
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