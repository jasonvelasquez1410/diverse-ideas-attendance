/**
 * DevTrack - State Management Store with PIN Protection & Confidential Rates
 * Handles persistence, team rosters, PIN authentication, and role permissions.
 */

const STORAGE_KEY = 'devtrack_app_state_v2';
const SESSION_AUTH_KEY = 'devtrack_active_session_auth';

// Default initial state
const DEFAULT_INITIAL_STATE = {
  adminPin: '9999', // Default Admin Master PIN
  activeDeveloperId: 'dev-1',
  currency: 'USD',
  currencySymbol: '$',
  developers: [
    {
      id: 'dev-1',
      name: 'Alex Rivera',
      role: 'Lead Full-Stack Developer',
      pin: '1234',
      hourlyRate: 35.00,
      currency: 'USD',
      currencySymbol: '$',
      avatarColor: '#6366f1',
      initials: 'AR',
      email: 'alex.rivera@diverseideas.de',
      status: 'offline',
      activeSession: null
    },
    {
      id: 'dev-2',
      name: 'Maria Santos',
      role: 'Senior Frontend Engineer',
      pin: '2345',
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
      pin: '3456',
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
      pin: '4567',
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
  attendanceRecords: [
    {
      id: 'rec-101',
      developerId: 'dev-1',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      startTime: new Date(Date.now() - 86400000 - 8 * 3600000).toISOString(),
      endTime: new Date(Date.now() - 86400000).toISOString(),
      breakDurationMinutes: 60,
      workedMinutes: 420,
      hourlyRate: 35.00,
      currencySymbol: '$',
      totalEarnings: 245.00,
      projectId: 'proj-2',
      workLocation: 'onsite',
      taskNote: 'API endpoints implementation and testing'
    },
    {
      id: 'rec-102',
      developerId: 'dev-2',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      startTime: new Date(Date.now() - 86400000 - 8.5 * 3600000).toISOString(),
      endTime: new Date(Date.now() - 86400000).toISOString(),
      breakDurationMinutes: 45,
      workedMinutes: 465,
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
      workedMinutes: 450,
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
    this.auth = this.loadAuth();
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
  }

  loadAuth() {
    try {
      const auth = sessionStorage.getItem(SESSION_AUTH_KEY);
      if (auth) return JSON.parse(auth);
    } catch (e) {}
    return { isAuthenticated: false, role: null, devId: null };
  }

  saveAuth(authObj) {
    this.auth = authObj;
    try {
      sessionStorage.setItem(SESSION_AUTH_KEY, JSON.stringify(authObj));
    } catch (e) {}
    this.notify();
  }

  // Authentication & Verification
  loginDeveloper(devId, pin) {
    const dev = this.getDeveloperById(devId);
    if (!dev) return { success: false, message: 'Developer not found' };

    if (dev.pin === pin || pin === this.state.adminPin) {
      const isAdmin = (pin === this.state.adminPin);
      this.saveAuth({
        isAuthenticated: true,
        role: isAdmin ? 'admin' : 'developer',
        devId: dev.id
      });
      this.setActiveDeveloper(dev.id);
      return { success: true, role: isAdmin ? 'admin' : 'developer', dev };
    }
    return { success: false, message: 'Incorrect PIN code' };
  }

  loginAdmin(pin) {
    if (pin === this.state.adminPin) {
      this.saveAuth({
        isAuthenticated: true,
        role: 'admin',
        devId: null
      });
      return { success: true };
    }
    return { success: false, message: 'Incorrect Admin PIN' };
  }

  logout() {
    this.saveAuth({ isAuthenticated: false, role: null, devId: null });
  }

  getAuth() {
    return this.auth;
  }

  isAdmin() {
    return this.auth && this.auth.isAuthenticated && this.auth.role === 'admin';
  }

  setAdminPin(newPin) {
    this.state.adminPin = newPin;
    this.saveState();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state, this.auth));
  }

  getState() {
    return this.state;
  }

  // Developer getters & mutations
  getActiveDeveloper() {
    if (this.auth.role === 'developer' && this.auth.devId) {
      return this.getDeveloperById(this.auth.devId);
    }
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
      pin: devData.pin || '1234',
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

  // Projects
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
