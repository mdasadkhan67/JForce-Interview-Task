const AuthHelper = require('../helper/auth');

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = AuthHelper.verifyToken(token);
    req.userId = decoded.userId;
    req.username = decoded.username;
    req.userEmail = decoded.email;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  verifyToken
};
