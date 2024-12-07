import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../../lib/mongodb';
import User from '../../models/User';
import * as dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is missing');
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      await dbConnect(); // Connect to the database

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' }); // Unauthorized
      }

      // Verify the password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid email or password' }); // Unauthorized
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Respond with the token
      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Handle unsupported methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
