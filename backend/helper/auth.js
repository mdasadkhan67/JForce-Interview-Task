const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'asadsecreatkeytoken1234567890';

class AuthHelper {
  // Hash password
  static async hashPassword(password) {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw new Error('Error hashing password: ' + error.message);
    }
  }

  // Compare password
  static async comparePassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      throw new Error('Error comparing password: ' + error.message);
    }
  }

  // Generate JWT Token
  static generateToken(userId, username, email) {
    try {
      const token = jwt.sign(
        { userId, username, email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return token;
    } catch (error) {
      throw new Error('Error generating token: ' + error.message);
    }
  }

  // Verify JWT Token
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token: ' + error.message);
    }
  }

  // Decode token (without verification)
  static decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      throw new Error('Error decoding token: ' + error.message);
    }
  }
}

module.exports = AuthHelper;
