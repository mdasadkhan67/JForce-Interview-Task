const User = require('../model/User');
const AuthHelper = require('../helper/auth');
const logger = require('../helper/logger');
const { validateRegistration, validateLogin, formatValidationErrors } = require('../helper/validation');

// Registration Controller
const register = async (req, res) => {
  try {
    const { name, username, email, password, confirmPassword, mobile } = req.body;

    // Validate input
    const { error } = validateRegistration(req.body);
    if (error) {
      const errors = formatValidationErrors(error);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Check if email or username already exists
    const existingEmailUser = await User.findByEmail(email);
    if (existingEmailUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const existingUsernameUser = await User.findByUsername(username);
    if (existingUsernameUser) {
      return res.status(409).json({
        success: false,
        message: 'Username already in use'
      });
    }

    // Hash password
    const hashedPassword = await AuthHelper.hashPassword(password);

    // Create user
    const result = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      mobile
    });

    // Get created user
    const user = await User.findById(result.insertId);

    // Generate token
    const token = AuthHelper.generateToken(result.insertId, username, email);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        mobile: user.mobile
      }
    });
  } catch (error) {
    logger.error('Registration error', { error });
    return res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    const { error } = validateLogin(req.body);
    if (error) {
      const errors = formatValidationErrors(error);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Check if user exists
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Compare password
    const isPasswordValid = await AuthHelper.comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Generate token
    const token = AuthHelper.generateToken(user.id, user.username, user.email);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        mobile: user.mobile
      }
    });
  } catch (error) {
    logger.error('Login error', { error });
    return res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

// Get Current User
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        mobile: user.mobile,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    logger.error('Get user error', { error });
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

// Get All Users (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    logger.error('Get all users error', { error });
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  getAllUsers
};
