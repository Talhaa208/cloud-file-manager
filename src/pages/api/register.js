import bcrypt from 'bcryptjs';
import dbConnect from '../../lib/mongodb';
import User from '../../models/User';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      // Connect to the database
      await dbConnect();

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' }); // Conflict status code
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create and save the new user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      // Return a success response
      res.status(201).json({ message: 'User created successfully', userId: newUser._id });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Handle unsupported methods
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
