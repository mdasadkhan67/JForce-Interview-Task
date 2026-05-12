import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import {
  registerUser,
  loginUser,
  getMe as getMeAPI,
} from './authAPI'

const token = localStorage.getItem('token')

const initialState = {
  user: null,
  token: token || null,
  loading: false,
  error: null,
}

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Something went wrong'
  )
}

export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      return await registerUser(userData)
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
  }
)

export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      return await loginUser(userData)
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
  }
)

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, thunkAPI) => {
    try {
      return await getMeAPI()
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error))
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    logout: (state) => {
      localStorage.removeItem('token')
      state.user = null
      state.token = null
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.error = null

        state.user = action.payload.user
        state.token = action.payload.token

        localStorage.setItem(
          'token',
          action.payload.token
        )
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.error = null

        state.user = action.payload.user
        state.token = action.payload.token

        localStorage.setItem(
          'token',
          action.payload.token
        )
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(getMe.pending, (state) => {
        state.error = null
      })

      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user
      })

      .addCase(getMe.rejected, (state) => {
        localStorage.removeItem('token')
        state.token = null
        state.user = null
      })
  },
})

export const { logout } = authSlice.actions

export default authSlice.reducer