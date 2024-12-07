import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;

if (!MONGODB_URI) {
  throw new Error('Missing required environment variables: MONGODB_URI or DATABASE_NAME');
}

// Use a global variable to reuse the database connection across requests
let cachedClient = null;

async function connectToMongoClient() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = await MongoClient.connect(MONGODB_URI);
    cachedClient = client; // Cache the MongoDB client instance
    return client;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await connectToMongoClient();
      const db = client.db(DATABASE_NAME); // Specify the database
      const collection = db.collection('uploads.files');

      // Fetch all files from the collection
      const files = await collection.find().toArray();

      const serializedFiles = files.map((file) => ({
        ...file,
        _id: file._id.toString(), // Convert ObjectId to string
      }));

      // Respond with the fetched files
      res.status(200).json(serializedFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

export default handler;


