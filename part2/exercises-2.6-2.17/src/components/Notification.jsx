// Notification component to display messages; supports `type` ('success'|'error')
const Notification = ({ message, type }) => {
  if (!message) return null

  const successStyle = {
    color: 'green',
    borderColor: 'green',
    background: 'lightgrey',
    fontSize: 18,
    borderStyle: 'solid',
    borderRadius: 7,
    padding: 12,
    marginBottom: 10,
  }

  const errorStyle = {
    color: 'red',
    borderColor: 'red',
    background: '#f8d7da',
    fontSize: 18,
    borderStyle: 'solid',
    borderRadius: 7,
    padding: 12,
    marginBottom: 10,
  }

  return <div style={type === 'error' ? errorStyle : successStyle}>{message}</div>
}

export default Notification