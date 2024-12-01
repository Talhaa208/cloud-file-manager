import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

// Environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Configure GridFS storage
const storage = new GridFsStorage({
  url: MONGODB_URI as string,
  options: { useUnifiedTopology: true },
  file: (req: any, file: Express.Multer.File) => {
    return {
      bucketName: 'uploads', // Bucket to store files
      filename: `${Date.now()}-${file.originalname}`, // Unique filename
    };
  },
});

// Multer upload configuration
const upload = multer({ storage });

// Disable default body parser for multipart forms
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper function to handle Multer uploads
const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Main API handler
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      await runMiddleware(req, res, upload.single('file'));

      const file = (req as any).file; // Safely typecast to access file object

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      return res.status(200).json({
        file: {
          id: file.id,
          filename: file.filename,
        },
      });
    } catch (error) {
      console.error('File upload error:', error);
      return res.status(500).json({ error: 'File upload failed' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default handler;
