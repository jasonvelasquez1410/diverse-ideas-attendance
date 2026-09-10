/**
 * DevTrack - State Management Store
 * Handles persistence, team rosters, attendance records, active sessions, and reactivity.
 */

const STORAGE_KEY = 'devtrack_app_state_v1';

// Default initial state if none exists in localStorage
const DEFAULT_INITIAL_STATE = {
  activeDeveloperId: 'dev-1',
  currency: 'USD',
  currencySymbol: '$',
  developers: [
    {
      id: 'dev-1',
      name: 'Alex Rivera',
      role: 'Lead Full-Stack Developer',
      hourlyRate: 35.00,
      currency: 'USD',
      currencySymbol: '$',
      avatarColor: '#6366f1',
      initials: 'AR',
      email: 'alex.rivera@diverseideas.de',
      status: 'offline', // 'working' | 'break' | 'offline'
      activeSession: null
    },
    {
      id: 'dev-2',
      name: 'Maria Santos',
      role: 'Senior Frontend Engineer',
      hourlyRate: 28.00,
      currency: 'USD',
      currencySymbol: '$',
      avatarColor: '#06b6d4',
      initials: 'MS',
      email: 'maria.santos@diverseideas.de',
      status: 'offline',
      activeSession: null
    },
    {
      id: 'dev-3',
      name: 'Kenji Takahashi',
      role: 'Backend & Systems Engineer',
      hourlyRate: 30.00,
      currency: 'USD',
      currencySymbol: '$',
      avatarColor: '#10b981',
      initials: 'KT',
      email: 'kenji.t@diverseideas.de',
      status: 'offline',
      activeSession: null
    },
    {
      id: 'dev-4',
      name: 'Chloe Gomez',
      role: 'UI/UX & QA Specialist',
      hourlyRate: 22.00,
      currency: 'USD',
      currencySymbol: '$',
      avatarColor: '#f59e0b',
      initials: 'CG',
      email: 'chloe.g@diverseideas.de',
      status: 'offline',
      activeSession: null
    }
  ],
  projects: [
    { id: 'proj-1', name: 'Diverse Ideas Core Portal', code: 'DICP' },
    { id: 'proj-2', name: 'JETZ Enterprise System', code: 'JETZ' },
    { id: 'proj-3', name: 'Accounting & Payroll Module', code: 'ACCT' },
    { id: 'proj-4', name: 'Mobile App Optimization', code: 'MOBI' },
    { id: 'proj-5', name: 'Internal Tooling & Automation', code: 'TOOL' }
  ],
  // Sample historical records
  attendanceRecords: [
    {
      id: 'rec-101',
      developerId: 'dev-1',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      startTime: new Date(Date.now() - 86400000 - 8 * 3600000).toISOString(),
      endTime: new Date(Date.now() - 86400000).toISOString(),
      breakDurationMinutes: 60,
      workedMinutes: 420, // 7.0 hours
      hourlyRate: 35.00,
      currencySymbol: '$',
      totalEarnings: 245.00,
      projectId: 'proj-2',
      workLocation: 'onsite', // 'wfh' | 'onsite'
      taskNote: 'API endpoints implementation and testing'
    },
    {
      id: 'rec-102',
      developerId: 'dev-2',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      startTime: new Date(Date.now() - 86400000 - 8.5 * 3600000).toISOString(),
      endTime: new Date(Date.now() - 86400000).toISOString(),
      breakDurationMinutes: 45,
      workedMinutes: 465, // 7.75 hours
      hourlyRate: 28.00,
      currencySymbol: '$',
      totalEarnings: 217.00,
      projectId: 'proj-1',
      workLocation: 'onsite',
      taskNote: 'Modern responsive glassmorphic dashboard design'
    },
    {
      id: 'rec-103',
      developerId: 'dev-3',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      startTime: new Date(Date.now() - 86400000 - 8 * 3600000).toISOString(),
      endTime: new Date(Date.now() - 86400000).toISOString(),
      breakDurationMinutes: 30,
      workedMinutes: 450, // 7.5 hours
      hourlyRate: 30.00,
      currencySymbol: '$',
      totalEarnings: 225.00,
      projectId: 'proj-3',
      workLocation: 'wfh',
      taskNote: 'Database schema migration and ledger query optimizations'
    }
  ]
};

class Store {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
    this.pullServerState();
  }

  pullServerState() {
    if (typeof window !== 'undefined' && window.location && window.location.protocol.startsWith('http')) {
      fetch('/api/state')
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.developers)) {
            this.state = data;
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
            } catch (e) {}
            this.notify();
          }
        })
        .catch(() => {});
    }
  }

  loadState() {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (serialized) {
        return JSON.parse(serialized);
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to persist state:', e);
    }
    this.notify();

    // Background server sync if served via server.js
    if (window.location.protocol.startsWith('http')) {
      fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state)
      }).catch(() => {
        // Silently ignore if standalone static file
      });
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  getState() {
    return this.state;
  }

  // Developer getters & mutations
  getActiveDeveloper() {
    return this.state.developers.find(d => d.id === this.state.activeDeveloperId) || this.state.developers[0];
  }

  setActiveDeveloper(devId) {
    this.state.activeDeveloperId = devId;
    this.saveState();
  }

  getDeveloperById(id) {
    return this.state.developers.find(d => d.id === id);
  }

  addDeveloper(devData) {
    const id = 'dev-' + Date.now();
    const initials = devData.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'DV';
    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newDev = {
      id,
      name: devData.name,
      role: devData.role || 'Software Developer',
      hourlyRate: parseFloat(devData.hourlyRate) || 25.00,
      currency: devData.currency || 'USD',
      currencySymbol: devData.currencySymbol || '$',
      avatarColor: devData.avatarColor || randomColor,
      initials,
      email: devData.email || '',
      status: 'offline',
      activeSession: null
    };

    this.state.developers.push(newDev);
    this.saveState();
    return newDev;
  }

  updateDeveloper(id, updates) {
    const dev = this.getDeveloperById(id);
    if (dev) {
      Object.assign(dev, updates);
      this.saveState();
    }
  }

  deleteDeveloper(id) {
    this.state.developers = this.state.developers.filter(d => d.id !== id);
    if (this.state.activeDeveloperId === id && this.state.developers.length > 0) {
      this.state.activeDeveloperId = this.state.developers[0].id;
    }
    this.saveState();
  }

  // Project getters & mutations
  getProjects() {
    return this.state.projects;
  }

  getProjectById(id) {
    return this.state.projects.find(p => p.id === id) || { id, name: 'General Work', code: 'GEN' };
  }

  addProject(name, code) {
    const id = 'proj-' + Date.now();
    this.state.projects.push({ id, name, code: code || name.substring(0, 4).toUpperCase() });
    this.saveState();
  }

  // Attendance Records
  addAttendanceRecord(record) {
    this.state.attendanceRecords.unshift({
      id: 'rec-' + Date.now(),
      ...record
    });
    this.saveState();
  }

  deleteAttendanceRecord(id) {
    this.state.attendanceRecords = this.state.attendanceRecords.filter(r => r.id !== id);
    this.saveState();
  }

  // Backup, Restore & Reset
  exportBackupJSON() {
    return JSON.stringify(this.state, null, 2);
  }

  importBackupJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && Array.isArray(parsed.developers) && Array.isArray(parsed.attendanceRecords)) {
        this.state = parsed;
        this.saveState();
        return true;
      }
    } catch (e) {
      console.error('Invalid backup JSON:', e);
    }
    return false;
  }

  resetToDefault() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
    this.saveState();
  }
}

// Global state instance
window.DevStore = new Store();
