
// Component to display the list of persons
const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map((person) => (
        <div key={person.id}>{person.name} {person.number}</div>
      ))}
    </div>
  )
}

export default Persons
