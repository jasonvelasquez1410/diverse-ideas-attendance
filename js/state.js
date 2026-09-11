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
  usdToPhpRate: 58.50, // Live USD to PHP exchange rate (PHP per 1 USD)
  lastRateUpdate: null,
  isLiveExchangeActive: true,
  organization: {
    companyName: 'Diverse Ideas GMBH',
    industry: 'Software Engineering & IT Consulting',
    address: 'Frankfurt, Germany • Global Remote Office',
    taxId: 'DE-2026-DIV99',
    voucherPrefix: 'DIV'
  },
  workSchedules: {
    shiftStart: '08:00',
    shiftEnd: '17:00',
    wfhDays: ['Monday'],
    onsiteDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    gracePeriodMins: 15
  },
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
      activeSession: null,
      leaveCredits: { vacation: 12, sick: 10, emergency: 5 }
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
      activeSession: null,
      leaveCredits: { vacation: 15, sick: 10, emergency: 5 }
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
      activeSession: null,
      leaveCredits: { vacation: 10, sick: 8, emergency: 5 }
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
      activeSession: null,
      leaveCredits: { vacation: 14, sick: 10, emergency: 5 }
    }
  ],
  projects: [
    { id: 'proj-1', name: 'Diverse Ideas Core Portal', code: 'DICP' },
    { id: 'proj-2', name: 'JETZ Enterprise System', code: 'JETZ' },
    { id: 'proj-3', name: 'Accounting & Payroll Module', code: 'ACCT' },
    { id: 'proj-4', name: 'Mobile App Optimization', code: 'MOBI' },
    { id: 'proj-5', name: 'Internal Tooling & Automation', code: 'TOOL' }
  ],
  // Sprout HR Requests (Leave, Certificate of Attendance COA, Overtime OT)
  requests: [
    {
      id: 'req-201',
      developerId: 'dev-1',
      type: 'Leave', // 'Leave' | 'COA' | 'Overtime'
      subType: 'Vacation Leave',
      startDate: '2026-09-18',
      endDate: '2026-09-19',
      days: 2,
      reason: 'Family milestone gathering',
      status: 'Approved',
      dateFiled: '2026-09-08'
    },
    {
      id: 'req-202',
      developerId: 'dev-2',
      type: 'COA',
      subType: 'Missed Clock OUT',
      startDate: '2026-09-09',
      hours: '05:00 PM',
      reason: 'Internet power fluctuation at home office',
      status: 'Approved',
      dateFiled: '2026-09-10'
    },
    {
      id: 'req-203',
      developerId: 'dev-3',
      type: 'Overtime',
      subType: 'Post-shift Overtime',
      startDate: '2026-09-10',
      hours: 2.5,
      reason: 'Critical database indexing sprint for JETZ release',
      status: 'Pending',
      dateFiled: '2026-09-10'
    }
  ],
  // Philippine Holidays
  holidays: [
    { date: '2026-01-01', name: 'New Year’s Day', type: 'Regular Holiday' },
    { date: '2026-04-02', name: 'Maundy Thursday', type: 'Regular Holiday' },
    { date: '2026-04-03', name: 'Good Friday', type: 'Regular Holiday' },
    { date: '2026-04-09', name: 'Araw ng Kagitingan', type: 'Regular Holiday' },
    { date: '2026-05-01', name: 'Labor Day', type: 'Regular Holiday' },
    { date: '2026-06-12', name: 'Independence Day', type: 'Regular Holiday' },
    { date: '2026-08-31', name: 'National Heroes Day', type: 'Regular Holiday' },
    { date: '2026-11-30', name: 'Bonifacio Day', type: 'Regular Holiday' },
    { date: '2026-12-25', name: 'Christmas Day', type: 'Regular Holiday' },
    { date: '2026-12-30', name: 'Rizal Day', type: 'Regular Holiday' }
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
        const parsed = JSON.parse(serialized);
        if (!parsed.usdToPhpRate) parsed.usdToPhpRate = 58.50;
        return parsed;
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

  getUsdToPhpRate() {
    return Number(this.state.usdToPhpRate) || 58.50;
  }

  setUsdToPhpRate(rate, lastUpdate = null) {
    this.state.usdToPhpRate = parseFloat(rate) || 58.50;
    if (lastUpdate) {
      this.state.lastRateUpdate = lastUpdate;
    }
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

  // Leave & Request Management (Sprout HR Style)
  getRequests(devId = null) {
    if (devId && devId !== 'all') {
      return this.state.requests.filter(r => r.developerId === devId);
    }
    return this.state.requests;
  }

  addRequest(reqData) {
    const newReq = {
      id: 'req-' + Date.now(),
      developerId: reqData.developerId,
      type: reqData.type, // 'Leave' | 'COA' | 'Overtime'
      subType: reqData.subType || reqData.type,
      startDate: reqData.startDate,
      endDate: reqData.endDate || reqData.startDate,
      days: reqData.days || 1,
      hours: reqData.hours || null,
      reason: reqData.reason,
      status: 'Pending',
      dateFiled: new Date().toISOString().split('T')[0]
    };
    this.state.requests.unshift(newReq);
    this.saveState();
    return newReq;
  }

  updateRequestStatus(reqId, status) {
    const req = this.state.requests.find(r => r.id === reqId);
    if (req) {
      req.status = status;
      this.saveState();
    }
  }

  getHolidays() {
    return this.state.holidays || [];
  }

  addHoliday(holidayData) {
    const holiday = {
      date: holidayData.date,
      name: holidayData.name,
      type: holidayData.type || 'Company Holiday'
    };
    if (!this.state.holidays) this.state.holidays = [];
    this.state.holidays.push(holiday);
    this.state.holidays.sort((a, b) => new Date(a.date) - new Date(b.date));
    this.saveState();
    return holiday;
  }

  deleteHoliday(date, name) {
    if (!this.state.holidays) return;
    this.state.holidays = this.state.holidays.filter(h => !(h.date === date && h.name === name));
    this.saveState();
  }

  getOrganization() {
    return this.state.organization || {
      companyName: 'Diverse Ideas GMBH',
      industry: 'Software Engineering',
      address: 'Frankfurt, Germany',
      taxId: 'DE-2026-DIV99',
      voucherPrefix: 'DIV'
    };
  }

  updateOrganization(updates) {
    this.state.organization = { ...this.getOrganization(), ...updates };
    this.saveState();
  }

  getWorkSchedules() {
    return this.state.workSchedules || {
      shiftStart: '08:00',
      shiftEnd: '17:00',
      wfhDays: ['Monday'],
      onsiteDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      gracePeriodMins: 15
    };
  }

  updateWorkSchedules(updates) {
    this.state.workSchedules = { ...this.getWorkSchedules(), ...updates };
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
