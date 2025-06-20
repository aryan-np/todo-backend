const User = require('../Models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure .env has JWT_SECRET

// ========== SIGNUP ==========
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error during signup'+err });
  }
};

// ========== LOGIN ==========
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      "jwtsecret",
      { expiresIn: '1h' }
    );
    
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login'+err });
  }
};

// ========== LOGOUT ==========
exports.logout = (req, res) => {
  // For stateless JWT: instruct client to delete token
  res.status(200).json({ message: 'Logged out. Please delete token on client.' });
};
