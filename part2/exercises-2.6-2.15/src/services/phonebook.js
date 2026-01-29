import axios from 'axios'

// URL of the backend server
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data)
}

// Post a new person to the server
const create = (newPerson) => {
  return axios.post(baseUrl, newPerson).then((response) => response.data)
}

// Delete a person by id
const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

export default { getAll, create, remove }
