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

function mergeCloudAndClientState(existingData, incomingData) {
  if (!existingData || typeof existingData !== 'object' || !Array.isArray(existingData.developers)) {
    return incomingData;
  }
  if (!incomingData || typeof incomingData !== 'object' || !Array.isArray(incomingData.developers)) {
    return existingData;
  }

  sanitizeStateProjects(existingData);
  sanitizeStateProjects(incomingData);

  // 1. Merge attendance records: Union with deduplication
  const recordMap = new Map();
  const allRecords = [
    ...(Array.isArray(existingData.attendanceRecords) ? existingData.attendanceRecords : []),
    ...(Array.isArray(incomingData.attendanceRecords) ? incomingData.attendanceRecords : [])
  ];

  allRecords.forEach(rawRec => {
    if (!rawRec || !rawRec.developerId || !rawRec.date || rawRec.date <= '2026-09-18') return;
    const key = `${rawRec.developerId}_${rawRec.date}`;
    if (!recordMap.has(key)) {
      recordMap.set(key, rawRec);
    } else {
      const existing = recordMap.get(key);
      const existingEnd = existing.endTime ? new Date(existing.endTime).getTime() : 0;
      const currentEnd = rawRec.endTime ? new Date(rawRec.endTime).getTime() : 0;
      if (currentEnd >= existingEnd || (rawRec.workedMinutes || 0) >= (existing.workedMinutes || 0)) {
        recordMap.set(key, rawRec);
      }
    }
  });

  const mergedRecords = Array.from(recordMap.values());
  mergedRecords.sort((a, b) => {
    const cmp = (b.date || '').localeCompare(a.date || '');
    if (cmp !== 0) return cmp;
    return (b.startTime || '').localeCompare(a.startTime || '');
  });

  incomingData.attendanceRecords = mergedRecords;

  // 2. Merge developer active sessions
  if (Array.isArray(existingData.developers) && Array.isArray(incomingData.developers)) {
    incomingData.developers.forEach(inDev => {
      const exDev = existingData.developers.find(d => d.id === inDev.id);
      if (exDev) {
        // If exDev has an active working session and inDev is offline, verify if inDev explicitly completed the shift
        if ((exDev.status === 'working' || exDev.status === 'break') && exDev.activeSession && inDev.status === 'offline') {
          const exStart = exDev.activeSession.startTime;
          const hasClosedRecord = mergedRecords.some(r => r.developerId === exDev.id && r.startTime === exStart && r.endTime);
          if (!hasClosedRecord) {
            inDev.status = exDev.status;
            inDev.activeSession = exDev.activeSession;
          }
        }
      }
    });
  }

  return incomingData;
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
      let data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!data || !Array.isArray(data.developers)) {
        return res.status(400).json({ error: 'Invalid state schema' });
      }

      // Fetch existing cloud data to safely merge
      try {
        const fbRes = await fetch(FIREBASE_DB_URL, { headers: { 'Cache-Control': 'no-cache' } });
        if (fbRes.ok) {
          const existingCloud = await fbRes.json();
          if (existingCloud && Array.isArray(existingCloud.developers)) {
            data = mergeCloudAndClientState(existingCloud, data);
          }
        }
      } catch (mergeErr) {
        console.warn('Could not fetch existing cloud data for merge:', mergeErr.message);
      }

      sanitizeStateProjects(data);
      data._serverTimestamp = Date.now();

      await fetch(FIREBASE_DB_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      return res.status(200).json({ success: true, timestamp: data._serverTimestamp, state: data });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
