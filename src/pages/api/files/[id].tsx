import { MongoClient, GridFSBucket } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';


const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query; // This is the filename from the URL.
  
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid file ID' });
  }
  if (req.method === 'GET') {
    try {
      const client = await MongoClient.connect(MONGODB_URI as string);
      const db = client.db(DATABASE_NAME);
      const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

      const downloadStream = bucket.openDownloadStreamByName(id);

      res.setHeader('Content-Disposition', `attachment; filename="${id}"`); // Optional: force download
      res.setHeader('Content-Type', 'application/octet-stream'); // Generic MIME type

      downloadStream.pipe(res).on('error', () => {
        res.status(404).json({ error: 'File not found' });
      });

      downloadStream.on('end', () => {
        client.close();
      });
    } catch (error) {
      console.error('Error retrieving file:', error);
      res.status(500).json({ error: 'Error retrieving file' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default handler;
