const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// Register
exports.register = async (req, res) => {
      console.log("Registering user...");
      
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ msg: 'All fields required' });

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ msg: 'User already exists' });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await User.create({ name, email, passwordHash, role });
  const token = generateToken(newUser);

  res.cookie('token', token, { httpOnly: true });
  res.status(201).json({ user: { name: newUser.name, role: newUser.role }, token });
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ msg: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.cookie('token', token, { httpOnly: true });
  res.json({ user: { name: user.name, role: user.role }, token });
};

// Get current user info
exports.getUser = async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  res.json(user);
};

// Get all users (admin only)

exports.getAllUsers = async (req, res) => {
  try {
    const students = await User.find({ role: "user" }, "-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students" });
  }
};


exports.logout = async (req, res) => {
  res.clearCookie('token');
  
  res.status(200).json({ msg: 'Logged out successfully' });
};