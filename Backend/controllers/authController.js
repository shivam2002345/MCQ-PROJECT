const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const errorHandler = require('../utils/errorHandler');

const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;
  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Add user_count = 0 and allowed_count = 1 on signup
    const newUser = await userModel.createUser(name, email, hashedPassword, 0, 1);

    res.status(201).json({ message: 'User created successfully', user_id: newUser.user_id });
  } catch (error) {
    errorHandler(res, error);
  }
};


const login = async (req, res) => {
  // 1. Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // 2. Destructure user input
  const { email, password } = req.body;

  try {
    // 3. Check if user exists
    const user = await userModel.findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    // 4. Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    // 5. Create a JWT token
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 6. Respond with the token and user_id
    res.json({
      message: 'Login successful',
      token,        // The JWT token
      user_id: user.user_id  // The user ID
    });
  } catch (error) {
    errorHandler(res, error);  // Handle errors
  }
};

module.exports = { signup, login };
