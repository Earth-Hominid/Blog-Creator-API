const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');

// @desc Register new user
// @route POST /api/users
// @access Public

const registerUser = asyncHandler(async (req, res) => {
  const { first_name, last_name, alias, email, password } = req.body;
  if (!first_name || !last_name || !alias || !email || !password) {
    res.status(400);
    throw new Error('Please complete all fields');
  }
  // check if user exists, use email as it is set to unique in the schema.
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    first_name,
    last_name,
    email,
    alias,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: first_name + ' ' + last_name,
      email: user.email,
      alias: user.alias,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc Authenticate new user
// @route POST /api/users/login
// @access Public

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Search if user email exists in db.
  const user = await User.findOne({ email });

  // check the password, password in db is hashed
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc Get user data
// @route GET /api/users/me
// @access Public

const getMe = asyncHandler(async (req, res) => {
  res.json({ message: 'User data display' });
});

module.exports = { registerUser, loginUser, getMe };
