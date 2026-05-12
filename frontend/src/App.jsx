import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'

import PrivateRoute from './routes/PrivateRoute'
import { getMe } from './features/auth/authSlice'
import AddExpense from './pages/AddExpense'
import ExpensesList from './pages/ExpensesList'

function App() {
  const dispatch = useDispatch()
  const { user, token } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token && !user) {
      dispatch(getMe())
    }
  }, [token, user, dispatch])

  return (
    <>
      <ToastContainer position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />

          <Route
            path='/dashboard'
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path='/add-expense' element={
            <PrivateRoute>
              <AddExpense />
            </PrivateRoute>
          } />

          <Route
            path='/edit-expense/:id'
            element={
              <PrivateRoute>
                <AddExpense />
              </PrivateRoute>
            }
          />

          <Route path='/expenses-list' element={
            <PrivateRoute>
              <ExpensesList />
            </PrivateRoute>
          } />

          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App