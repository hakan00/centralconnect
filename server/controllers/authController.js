import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const registerUser = async (req, res) => {
  const { fullName, email, password, nationality } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ fullName, email, password, nationality });

  res.status(201).json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    nationality: user.nationality,
    role: user.role,
    token: generateToken(user._id)
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    nationality: user.nationality,
    role: user.role,
    token: generateToken(user._id)
  });
};

export const getMe = async (req, res) => {
  res.json(req.user);
};
