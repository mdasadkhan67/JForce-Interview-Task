import API from '../../api/axios'

export const getTasksAPI = async () => {
  const response = await API.get('/tasks')
  return response.data
}

export const createTaskAPI = async (taskData) => {
  const response = await API.post('/tasks', taskData)
  return response.data
}

export const updateTaskAPI = async (id, taskData) => {
  const response = await API.put(
    `/tasks/${id}`,
    taskData
  )

  return response.data
}

export const deleteTaskAPI = async (id) => {
  const response = await API.delete(`/tasks/${id}`)
  return response.data
}