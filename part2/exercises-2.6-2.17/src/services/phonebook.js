import axios from 'axios'

// URL of the backend server
const baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data)
}

// Post a new person to the server
const create = (newPerson) => {
  return axios.post(baseUrl, newPerson)
    .then((response) => response.data)
    .catch(err => {
      //Rethrow error details from server if available, so they can be handled in App.jsx
      if (err.response && err.response.data) throw err.response.data
      throw err
    })
}

// Delete a person by id
const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

// Update a person's information by using PUT
const update = (id, updatedPerson) => {
  return axios.put(`${baseUrl}/${id}`, updatedPerson)
    .then((response) => response.data)
    .catch(err => {
      //Rethrow error details from server if available, so they can be handled in App.jsx
      if (err.response && err.response.data) throw err.response.data
      throw err
    })
}

export default { getAll, create, remove, update }
