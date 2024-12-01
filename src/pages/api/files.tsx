import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;

async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    try {
      const client = await MongoClient.connect(MONGODB_URI as string);
      const db = client.db(DATABASE_NAME);
      const files = await db.collection('uploads.files').find().toArray();

      res.status(200).json(files);
      client.close();
    } catch (error) {
      res.status(500).json({ error: 'Error fetching files' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default handler;
