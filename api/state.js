/**
 * Serverless handler for /api/state on Vercel
 */
let inMemoryState = null;

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Pragma');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    if (inMemoryState) {
      inMemoryState._serverTimestamp = Date.now();
      return res.status(200).json(inMemoryState);
    }
    return res.status(200).json({ exists: false });
  }

  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!data || !Array.isArray(data.developers)) {
        return res.status(400).json({ error: 'Invalid state schema' });
      }
      data._serverTimestamp = Date.now();
      inMemoryState = data;
      return res.status(200).json({ success: true, timestamp: data._serverTimestamp });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
