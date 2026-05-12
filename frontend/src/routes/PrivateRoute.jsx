import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth)

  if (token && !user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return user ? children : <Navigate to='/' />
}

export default PrivateRoute