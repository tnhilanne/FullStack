// Component for filtering persons by name

const SearhFilter = ({ filter, onFilterChange }) => {
  return (
    <div>
      Filter persons by name: <input value={filter} onChange={onFilterChange} />
    </div>
  )
}

export default SearhFilter
