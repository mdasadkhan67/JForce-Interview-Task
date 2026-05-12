import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register } from '../features/auth/authSlice'
import { useNavigate, Link } from 'react-router-dom'
import SEO from '../components/SEO'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
  })

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      case 'name':
        if (!value.trim()) {
          error = 'Full name is required'
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters'
        } else if (value.trim().length > 50) {
          error = 'Name cannot exceed 50 characters'
        }
        break

      case 'username':
        if (!value.trim()) {
          error = 'Username is required'
        } else if (value.trim().length < 3) {
          error = 'Username must be at least 3 characters'
        } else if (value.trim().length > 20) {
          error = 'Username cannot exceed 20 characters'
        } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          error = 'Username can only contain letters, numbers, hyphens, and underscores'
        }
        break

      case 'email':
        if (!value.trim()) {
          error = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address'
        }
        break

      case 'password':
        if (!value) {
          error = 'Password is required'
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters'
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = 'Password must contain at least one lowercase letter'
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = 'Password must contain at least one uppercase letter'
        } else if (!/(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one number'
        }
        break

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password'
        } else if (value !== formData.password) {
          error = 'Passwords do not match'
        }
        break

      case 'mobile':
        if (!value.trim()) {
          error = 'Mobile number is required'
        } else if (!/^[0-9]{10}$/.test(value.replace(/\D/g, ''))) {
          error = 'Mobile number must be 10 digits'
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
        name: true,
        username: true,
        email: true,
        password: true,
        confirmPassword: true,
        mobile: true,
      })
      return
    }

    const userData = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      mobile: formData.mobile,
    }

    const result = await dispatch(register(userData))

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard')
    }
  }

  return (
    <>
      <SEO title="Register Page"
        description="Create a new account to access the dashboard and manage your tasks effectively."
        keywords="register, sign up, create account, authentication, dashboard access"
      />
      <div className="flex min-h-screen items-center justify-center bg-gray-200 px-4 py-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded bg-white p-6 shadow-md"
        >
          <h2 className="mb-6 text-2xl font-bold text-black">
            Create Account
          </h2>

          {/* General Error from Server */}
          {error && (
            <div className="mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
              <span className="text-red-500 font-bold">⚠</span>
              <div>
                <p className="font-semibold">Registration Error</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Full Name */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-black">
              Full Name: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded border p-2 outline-none transition ${errors.name && touched.name
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500'
                }`}
              placeholder="Enter your full name"
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span>✗</span> {errors.name}
              </p>
            )}
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-black">
              Username: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded border p-2 outline-none transition ${errors.username && touched.username
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500'
                }`}
              placeholder="Choose a username"
            />
            {errors.username && touched.username && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span>✗</span> {errors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-black">
              Email Address: <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded border p-2 outline-none transition ${errors.email && touched.email
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500'
                }`}
              placeholder="your.email@example.com"
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span>✗</span> {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-black">
              Password: <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full rounded border p-2 pr-10 outline-none transition ${errors.password && touched.password
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500"
                  }`}
                placeholder="Enter a strong password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && touched.password && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <span>✗</span> {errors.password}
              </p>
            )}

            <p className="mt-1 text-xs text-gray-600">
              Password must contain: uppercase, lowercase, number (min 6 characters)
            </p>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-black">
              Confirm Password: <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full rounded border p-2 pr-10 outline-none transition ${errors.confirmPassword && touched.confirmPassword
                  ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:border-blue-500"
                  }`}
                placeholder="Re-enter your password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.confirmPassword && touched.confirmPassword && (
              <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                <span>✗</span> {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Mobile */}
          <div className="mb-5">
            <label className="mb-1 block text-sm font-medium text-black">
              Mobile Number: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded border p-2 outline-none transition ${errors.mobile && touched.mobile
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-blue-500'
                }`}
              placeholder="10-digit mobile number"
            />
            {errors.mobile && touched.mobile && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <span>✗</span> {errors.mobile}
              </p>
            )}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full rounded bg-blue-600 py-2 text-white font-medium transition hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>

          {/* Login Link */}
          <p className="mt-5 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/" className="font-semibold text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </>
  )
}

export default Register