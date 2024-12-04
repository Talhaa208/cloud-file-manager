import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI as string;
const DATABASE_NAME = process.env.DATABASE_NAME;

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI or DATABASE_NAME environment variable');
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await MongoClient.connect(MONGODB_URI);
      const db = client.db(DATABASE_NAME);

      const files = await db.collection('uploads.files').find().toArray();

      res.status(200).json(files);

      await client.close(); // Ensure client is closed properly
    } catch (err) {
      console.error('Error fetching files:', err);
      res.status(500).json({ error: 'Error fetching files' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default handler;
