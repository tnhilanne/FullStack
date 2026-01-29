import { useState } from 'react'
import SearchFilter from './components/SearchFilter'
import PhonebookForm from './components/PhonebookForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Tammi Tamminen', number: '050-666666', id: 1 },
    { name: 'Kuusi Kuusisto', number: '12-34-5432', id: 2 },
    { name: 'Koivu Koivula', number: '98-4543222', id: 3 },
    { name: 'Järvi Järvinen', number: '22-543210', id: 4 }
  ]) 
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

  // Add a new person to the phonebook
  const addPerson = (event) => {
    event.preventDefault()
    // Prevented adding duplicate names to the phonebook by using the some() method
    if (persons.some((x) => x.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
  }
  // return the next id for a new person: if there are existing persons find the largest id and add 1, otherwise return 1
  const newId = persons.length > 0 ? Math.max(...persons.map((x) => x.id)) + 1 : 1

  // Creating a new person object and updating the state
  const personObject = { name: newName, number: newNumber, id: newId }
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
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
        <Persons persons={personsToShow} />

      {/*<div>Debugging: {newName} {newNumber}</div>*/}

    </div>
  )
}

export default App