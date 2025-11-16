const jwt = require('jsonwebtoken');
const Student = require('../models/User');
const College = require('../models/College');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (decoded.userType === 'student') {
      const student = await Student.findById(decoded.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      req.user = student; // Attach student data to the request
    } else if (decoded.userType === 'college') {
      const college = await College.findById(decoded.id);
      if (!college) {
        return res.status(404).json({ message: 'College not found' });
      }
      req.user = college; // Attach college data to the request
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    next();
  } catch (err) {
    console.error('Error in authentication middleware:', err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
