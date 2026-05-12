import { useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <div className='flex items-center justify-between bg-black p-4 text-white'>
      <h1 className='text-2xl font-bold'>Expense Manager</h1>

      <button
        onClick={handleLogout}
        className='rounded bg-red-500 px-4 py-2'
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar