import API from '../../api/axios'

export const registerUser = async (userData) => {
  const response = await API.post('/register', userData)
  return response.data
}

export const loginUser = async (userData) => {
  const response = await API.post('/login', userData)
  return response.data
}

export const getMe = async () => {
  const response = await API.get('/me')
  return response.data
}