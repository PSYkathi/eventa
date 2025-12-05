// server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      role, 
      companyName, 
      phoneNumber, 
      city,        
      language     
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      phoneNumber: phoneNumber || '',
      city: city || '',
      language: language || 'English',
      companyName: role === 'organizer' ? companyName : '', 
      isVerified: false 
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: "Registration Successful! "
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: token,
        message: "Login Successful! "
      });
    } else {
      res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// CRITICAL: Make sure both functions are exported!
module.exports = { registerUser, loginUser };