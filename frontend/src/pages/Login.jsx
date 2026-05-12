import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token, loading, error } = useSelector((state) => state.auth)

  useEffect(() => {
    if (token && user) {
      navigate('/dashboard')
    }
  }, [token, user, navigate])

  // Validation rules
  const validateField = (name, value) => {
    let error = ''

    switch (name) {
      case 'username':
        if (!value.trim()) {
          error = 'Username is required'
        } else if (value.trim().length < 3) {
          error = 'Username must be at least 3 characters'
        }
        break

      case 'password':
        if (!value) {
          error = 'Password is required'
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters'
        }
        break

      default:
        break
    }

    return error
  }

  // Validate all fields
  const validateForm = () => {
    const newErrors = {}
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key])
      if (error) {
        newErrors[key] = error
      }
    })
    return newErrors
  }

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Validate field on change if it has been touched
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    }
  }

  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    const error = validateField(name, formData[name])
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate all fields
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setTouched({
        username: true,
        password: true,
      })
      return
    }

    const result = await dispatch(
      login({
        username: formData.username,
        password: formData.password,
      })
    )

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard')
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-200 px-4 py-8'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-md rounded-lg bg-white p-8 shadow-lg'
      >
        <h2 className='mb-2 text-3xl font-bold text-black'>Login</h2>
        <p className='mb-6 text-sm text-gray-600'>Sign in to your account</p>

        {/* Server Error */}
        {error && (
          <div className='mb-6 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2'>
            <span className='text-red-500 font-bold'>⚠</span>
            <div>
              <p className='font-semibold'>Login Failed</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Username */}
        <div className='mb-5'>
          <label className='mb-2 block text-sm font-medium text-black'>
            Username: <span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='username'
            placeholder='Enter your username'
            className={`w-full rounded border p-3 outline-none transition ${errors.username && touched.username
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-blue-500'
              }`}
            value={formData.username}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.username && touched.username && (
            <p className='mt-2 text-xs text-red-500 flex items-center gap-1'>
              <span>✗</span> {errors.username}
            </p>
          )}
        </div>

        {/* Password */}
        <div className='mb-6'>
          <label className='mb-2 block text-sm font-medium text-black'>
            Password: <span className='text-red-500'>*</span>
          </label>
          <input
            type='password'
            name='password'
            placeholder='Enter your password'
            className={`w-full rounded border p-3 outline-none transition ${errors.password && touched.password
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:border-blue-500'
              }`}
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.password && touched.password && (
            <p className='mt-2 text-xs text-red-500 flex items-center gap-1'>
              <span>✗</span> {errors.password}
            </p>
          )}
        </div>

        {/* Login Button */}
        <button
          type='submit'
          className='w-full rounded bg-blue-600 p-3 text-white font-medium transition hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>

        {/* Register Link */}
        <p className='mt-6 text-center text-sm text-gray-600'>
          Don't have an account?{' '}
          <Link className='font-semibold text-blue-600 hover:underline' to='/register'>
            Register here
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login