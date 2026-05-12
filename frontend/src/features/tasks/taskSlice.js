import {
  createSlice,
  createAsyncThunk,
} from '@reduxjs/toolkit'

import {
  getTasksAPI,
  createTaskAPI,
  updateTaskAPI,
  deleteTaskAPI,
} from './taskAPI'

const initialState = {
  tasks: [],
  loading: false,
}

export const getTasks = createAsyncThunk(
  'tasks/getTasks',
  async () => {
    return await getTasksAPI()
  }
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData) => {
    return await createTaskAPI(taskData)
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, taskData }) => {
    return await updateTaskAPI(id, taskData)
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id) => {
    await deleteTaskAPI(id)
    return id
  }
)

const taskSlice = createSlice({
  name: 'tasks',
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getTasks.fulfilled, (state, action) => {
        state.tasks = action.payload.tasks
      })

      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload.task)
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.map((task) =>
          task.id === action.payload.task.id
            ? action.payload.task
            : task
        )
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(
          (task) => task.id !== action.payload
        )
      })
  },
})

export default taskSlice.reducer