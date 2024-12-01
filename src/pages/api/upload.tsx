import { MongoClient, GridFSBucket } from 'mongodb';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_NAME = process.env.DATABASE_NAME;

// Configure GridFS storage
const storage = new GridFsStorage({
  url: MONGODB_URI as string,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: 'uploads', // Bucket to store files
      filename: `${Date.now()}-${file.originalname}`, // Unique filename
    };
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle multipart forms
  },
};

async function handler(req:any, res:any) {
  if (req.method === 'POST') {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: 'File upload failed' });
      }

      res.status(200).json({
        file: {
          id: req.file.id,
          filename: req.file.filename,
        },
      });
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default handler;
