// Component to display the list of persons with delete buttons, and event handler for deletion

const Persons = ({ persons, onDelete }) => {
  return (
    <div>
      {persons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number} <button onClick={() => onDelete(person.id, person.name)}>Delete</button>
        </div>
      ))}
    </div>
  )
}

export default Persons
