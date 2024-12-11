export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        // Clear cookies if using cookies for authentication
        res.setHeader(
          'Set-Cookie',
          'authToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
        );
  
        // Invalidate session or token if needed
        // For example: revoke token from database
  
        res.status(200).json({ message: 'Logout successful' });
      } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  }
  