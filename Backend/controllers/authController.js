const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs'); // Changed to bcryptjs
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const errorHandler = require('../utils/errorHandler');

const signupValidations = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const loginValidations = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', errors: errors.array() });
  }

  const { name, email, password } = req.body;
  try {
    // Check for duplicate email
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ status: 'error', message: 'User already exists' });
    }

    // Hash password with bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add user_count = 0 and allowed_count = 1 on signup
    const newUser = await userModel.createUser(name, email, hashedPassword, 0, 1);

    res.status(201).json({ status: 'success', message: 'User created successfully', user_id: newUser.user_id });
  } catch (error) {
    errorHandler(res, error);
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'error', errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }

    // Compare password with bcryptjs
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      status: 'success',
      message: 'Login successful',
      token,
      user_id: user.user_id,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  signup,
  login,
  signupValidations,
  loginValidations,
};
