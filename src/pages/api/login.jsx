import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '../lib/mongodb';
import User from '../models/User';
import * as dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is missing');
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      await dbConnect();

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        JWT_SECRET, 
        { expiresIn: '1h' }
      );

      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
