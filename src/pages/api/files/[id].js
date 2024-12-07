import { MongoClient, GridFSBucket } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;

if (!MONGODB_URI) {
  throw new Error('Missing required environment variables: MONGODB_URI or DATABASE_NAME');
}

let cachedClient = null;

async function connectToMongoClient() {
  if (cachedClient) return cachedClient;

  try {
    const client = await MongoClient.connect(MONGODB_URI);
    cachedClient = client;
    return client;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

async function handler(req, res) {
  const { id } = req.query;

  // Validate file ID
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid or missing file ID' });
  }

  if (req.method === 'GET') {
    try {
      const client = await connectToMongoClient();
      const db = client.db(DATABASE_NAME);

      // Create a GridFS bucket instance
      const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

      // Create a download stream
      const downloadStream = bucket.openDownloadStreamByName(id);

      // Set response headers for file download
      res.setHeader('Content-Disposition', `attachment; filename="${id}"`);
      res.setHeader('Content-Type', 'application/octet-stream');

      // Pipe the download stream to the response
      downloadStream
        .pipe(res)
        .on('error', (err) => {
          console.error('Error streaming file:', err);
          res.status(404).json({ message: 'File not found' });
        });

      downloadStream.on('end', () => {
        console.log(`File download completed for file: ${id}`);
      });
    } catch (error) {
      console.error('Error retrieving file:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

export default handler;
