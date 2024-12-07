import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

const MONGODB_URI = process.env.MONGODB_URI;

const storage = new GridFsStorage({
  url: MONGODB_URI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: 'uploads', 
      filename: `${Date.now()}-${file.originalname}`, 
    };
  },
});

const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,
  },
};

const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      await runMiddleware(req, res, upload.single('file'));

      const file = (req).file; 

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
