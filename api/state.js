/**
 * Serverless handler for /api/state on Vercel with Firebase Realtime Database persistence
 */
const FIREBASE_DB_URL = 'https://diverse-ideas-attendance-default-rtdb.asia-southeast1.firebasedatabase.app/state.json';

const legacyNames = ['JETZ Enterprise System', 'Accounting & Payroll Module', 'Mobile App Optimization', 'Internal Tooling & Automation'];
const legacyCodes = ['JETZ', 'ACCT', 'MOBI', 'TOOL'];

function sanitizeStateProjects(data) {
  if (!data || typeof data !== 'object') return;
  if (Array.isArray(data.projects)) {
    data.projects = data.projects.filter(p => p && p.name && !legacyNames.includes(p.name) && !legacyCodes.includes(p.code) && !['proj-2', 'proj-3', 'proj-4', 'proj-5'].includes(p.id));
    if (!data.projects.some(p => p.id === 'proj-1' || p.name === 'Diverse Ideas Core Portal')) {
      data.projects.unshift({ id: 'proj-1', name: 'Diverse Ideas Core Portal', code: 'DICP', description: 'Internal staff management & attendance suite', status: 'Active' });
    }
  } else {
    data.projects = [{ id: 'proj-1', name: 'Diverse Ideas Core Portal', code: 'DICP', description: 'Internal staff management & attendance suite', status: 'Active' }];
  }
  if (Array.isArray(data.attendanceRecords)) {
    data.attendanceRecords.forEach(rec => {
      if (['proj-2', 'proj-3', 'proj-4', 'proj-5'].includes(rec.projectId)) {
        rec.projectId = 'proj-1';
      }
    });
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control, Pragma');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    try {
      const fbRes = await fetch(FIREBASE_DB_URL, { headers: { 'Cache-Control': 'no-cache' } });
      if (fbRes.ok) {
        const cloudData = await fbRes.json();
        if (cloudData && Array.isArray(cloudData.developers)) {
          sanitizeStateProjects(cloudData);
          cloudData._serverTimestamp = Date.now();
          return res.status(200).json(cloudData);
        }
      }
    } catch (err) {
      console.warn('Firebase fetch fallback in api/state:', err.message);
    }
    return res.status(200).json({ exists: false });
  }

  if (req.method === 'POST') {
    try {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!data || !Array.isArray(data.developers)) {
        return res.status(400).json({ error: 'Invalid state schema' });
      }
      sanitizeStateProjects(data);
      data._serverTimestamp = Date.now();

      await fetch(FIREBASE_DB_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      return res.status(200).json({ success: true, timestamp: data._serverTimestamp });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
