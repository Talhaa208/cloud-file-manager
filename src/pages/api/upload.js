import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is missing');
}

// Configure the GridFS storage
const storage = new GridFsStorage({
  url: MONGODB_URI,
  options: { useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: 'uploads', // Bucket name in GridFS
      filename: `${Date.now()}-${file.originalname}`, // Unique filename
    };
  },
});

// Initialize the multer upload middleware
const upload = multer({ storage });

// Disable body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

// Utility function to run middleware
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

// Main handler for the API route
async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Use the multer middleware to handle the file upload
      await runMiddleware(req, res, upload.single('file'));

      const file = req.file; // Retrieve the uploaded file from the request

      if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Respond with the file details
      return res.status(200).json({
        message: 'File uploaded successfully',
        file: {
          id: file.id,
          filename: file.filename,
        },
      });
    } catch (error) {
      console.error('File upload error:', error);
      return res.status(500).json({ message: 'File upload failed' });
    }
  } else {
    // Handle unsupported methods
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

export default handler;
