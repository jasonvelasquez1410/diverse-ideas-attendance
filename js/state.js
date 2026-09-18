/**
 * DevTrack - State Management Store with PIN Protection & Confidential Rates
 * Handles persistence, team rosters, PIN authentication, and role permissions.
 */

const STORAGE_KEY = 'devtrack_app_state_v2';
const SESSION_AUTH_KEY = 'devtrack_active_session_auth';

// Default initial state
const DEFAULT_INITIAL_STATE = {
  adminPin: '0104', // Admin Master PIN (Tefanny)
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
  // Modular Policy & Feature Switches ("No Work, No Pay" Model)
  features: {
    leaveCreditsEnabled: false,       // Default disabled for No Work, No Pay (paid leave balances hidden)
    overtimeFilingEnabled: false,     // Default disabled (hours automatically logged from time clock)
    undertimeFilingEnabled: false,    // Default disabled (automatic pay deduction from clock out)
    coaFilingEnabled: true,           // Certificate of Attendance / Missed Log adjustment (Enabled)
    scheduleNoticeEnabled: true,      // Schedule Adjustment / WFH notice (Enabled)
    forexTickerEnabled: true,         // Live Forex USD ⇄ PHP ticker & conversion (Enabled)
    holidaysCalendarEnabled: true,    // Official Holiday Calendar (Enabled)
    gpsGeofenceEnabled: true          // GPS Location Verification & Office Geofencing (Enabled)
  },
  // GPS Geofence & Office Location Configuration
  gpsSettings: {
    enabled: true,                    // Master GPS verification switch
    officeName: 'Diverse Ideas Office (Zamuco, Kauswagan, CDO)',
    latitude: 8.497211,               // Office GPS Latitude (Kauswagan, CDO)
    longitude: 124.625679,            // Office GPS Longitude (Kauswagan, CDO)
    radiusMeters: 250,                // Geofence radius in meters
    strictGeofence: true,             // If true, strictly prevent Onsite Time-IN if outside radius
    allowWfhAnywhere: true,           // If true, WFH employees can clock-in from anywhere
    wfhCaptureGps: true               // Capture GPS coordinates on WFH punch for audit log
  },
  workSchedules: {
    shiftStart: '09:00',
    shiftEnd: '17:00',
    wfhDays: ['Monday'],
    onsiteDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    minWeeklyHours: 35,
    maxWeeklyHours: 45,
    saturdayPolicy: 'Optional / Rest Day (No Forcing)',
    gracePeriodMins: 15
  },
  developers: [
    {
      id: 'dev-1',
      name: 'BAYSON, Cyreh',
      role: 'Junior Software Developer',
      pin: '7532',
      hourlyRate: 5.00,
      currency: 'USD',
      currencySymbol: '$',
      avatarColor: '#6366f1',
      initials: 'BC',
      email: 'cyreh.bayson@diverseideas.de',
      status: 'offline',
      activeSession: null,
      leaveCredits: { vacation: 12, sick: 10, emergency: 5 }
    },
    {
      id: 'dev-2',
      name: 'IBANEZ, Ella',
      role: 'Junior Software Developer',
      pin: '1598',
      hourlyRate: 5.00,
      currency: 'USD',
      currencySymbol: '$',
      avatarColor: '#06b6d4',
      initials: 'IE',
      email: 'ella.ibanez@diverseideas.de',
      status: 'offline',
      activeSession: null,
      leaveCredits: { vacation: 15, sick: 10, emergency: 5 }
    },
    {
      id: 'dev-3',
      name: 'NALUGON, Abner',
      role: 'Senior Software Developer',
      pin: '5478',
      hourlyRate: 18.00,
      currency: 'USD',
      currencySymbol: '$',
      avatarColor: '#10b981',
      initials: 'NA',
      email: 'abner.nalugon@diverseideas.de',
      status: 'offline',
      activeSession: null,
      leaveCredits: { vacation: 10, sick: 8, emergency: 5 }
    },
    {
      id: 'dev-4',
      name: 'VELASQUEZ, Jason Jeff',
      role: 'Senior Software Developer',
      pin: '9654',
      hourlyRate: 12.00,
      currency: 'USD',
      currencySymbol: '$',
      avatarColor: '#f59e0b',
      initials: 'VJ',
      email: 'jason.velasquez@diverseideas.de',
      status: 'offline',
      activeSession: null,
      leaveCredits: { vacation: 14, sick: 10, emergency: 5 }
    }
  ],
    projects: [
    { id: 'proj-1', name: 'Diverse Ideas Core Portal', code: 'DICP', description: 'Internal staff management & attendance suite', status: 'Active' },
    { id: 'proj-2', name: 'JETZ Enterprise System', code: 'JETZ', description: 'Enterprise resource planning & client platform', status: 'Active' },
    { id: 'proj-3', name: 'Accounting & Payroll Module', code: 'ACCT', description: 'Multi-currency dual USD/PHP wage calculation system', status: 'Active' },
    { id: 'proj-4', name: 'Mobile App Optimization', code: 'MOBI', description: 'Cross-platform iOS/Android responsive UI enhancements', status: 'Active' },
    { id: 'proj-5', name: 'Internal Tooling & Automation', code: 'TOOL', description: 'DevOps pipelines, scripts & database automations', status: 'Active' }
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
  // Complete 2026 Official Philippine National & Cagayan de Oro (CDO) Local Holidays
  holidays: [
    { date: '2026-01-01', name: 'New Year’s Day', type: 'Regular Holiday', location: 'National' },
    { date: '2026-01-10', name: 'Cagayan de Oro City Fiesta', type: 'CDO Local Holiday', location: 'Cagayan de Oro (CDO)' },
    { date: '2026-02-17', name: 'Chinese Lunar New Year', type: 'Special Non-Working', location: 'National' },
    { date: '2026-02-25', name: 'EDSA People Power Revolution Anniversary', type: 'Special Non-Working', location: 'National' },
    { date: '2026-04-02', name: 'Maundy Thursday', type: 'Regular Holiday', location: 'National' },
    { date: '2026-04-03', name: 'Good Friday', type: 'Regular Holiday', location: 'National' },
    { date: '2026-04-04', name: 'Black Saturday', type: 'Special Non-Working', location: 'National' },
    { date: '2026-04-09', name: 'Araw ng Kagitingan (Day of Valor)', type: 'Regular Holiday', location: 'National' },
    { date: '2026-05-01', name: 'Labor Day', type: 'Regular Holiday', location: 'National' },
    { date: '2026-06-12', name: 'Independence Day', type: 'Regular Holiday', location: 'National' },
    { date: '2026-06-15', name: 'Cagayan de Oro Charter Day (CDO Anniversary)', type: 'CDO Local Holiday', location: 'Cagayan de Oro (CDO)' },
    { date: '2026-08-21', name: 'Ninoy Aquino Day', type: 'Special Non-Working', location: 'National' },
    { date: '2026-08-28', name: 'Higalaay Festival & Feast of St. Augustine', type: 'CDO Local Holiday', location: 'Cagayan de Oro (CDO)' },
    { date: '2026-08-31', name: 'National Heroes Day', type: 'Regular Holiday', location: 'National' },
    { date: '2026-11-01', name: 'All Saints’ Day', type: 'Special Non-Working', location: 'National' },
    { date: '2026-11-02', name: 'All Souls’ Day', type: 'Special Non-Working', location: 'National' },
    { date: '2026-11-30', name: 'Bonifacio Day', type: 'Regular Holiday', location: 'National' },
    { date: '2026-12-08', name: 'Feast of the Immaculate Conception', type: 'Special Non-Working', location: 'National' },
    { date: '2026-12-24', name: 'Christmas Eve', type: 'Special Non-Working', location: 'National' },
    { date: '2026-12-25', name: 'Christmas Day', type: 'Regular Holiday', location: 'National' },
    { date: '2026-12-30', name: 'Rizal Day', type: 'Regular Holiday', location: 'National' },
    { date: '2026-12-31', name: 'Last Day of the Year (New Year’s Eve)', type: 'Special Non-Working', location: 'National' }
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
        
        // Merge complete 2026 Philippine & CDO Holidays if needed
        if (!parsed.holidays || parsed.holidays.length < 18) {
          parsed.holidays = DEFAULT_INITIAL_STATE.holidays;
        }

        // Ensure project objects have status and description
        if (parsed.projects) {
          parsed.projects.forEach(p => {
            if (!p.status) p.status = 'Active';
            if (!p.description) p.description = '';
          });
        }

        // Automatic migration: if old placeholder demo names exist, replace with real team roster
        if (!parsed.developers || parsed.developers.some(d => d.name.includes('Alex Rivera') || d.name.includes('Chloe Gomez') || !d.name.includes('BAYSON'))) {
          parsed.developers = DEFAULT_INITIAL_STATE.developers;
          parsed.adminPin = '0104';
        }

        // Apply updated 09:00 AM – 05:00 PM and 35h-45h/wk policy (Tefanny work policy)
        if (!parsed.workSchedules || parsed.workSchedules.shiftStart === '08:00' || !parsed.workSchedules.minWeeklyHours) {
          parsed.workSchedules = {
            ...DEFAULT_INITIAL_STATE.workSchedules,
            ...(parsed.workSchedules || {}),
            shiftStart: '09:00',
            shiftEnd: '17:00',
            wfhDays: ['Monday'],
            minWeeklyHours: 35,
            maxWeeklyHours: 45,
            saturdayPolicy: 'Optional / Rest Day (No Forcing)'
          };
        }

        // Ensure feature switches are loaded and defaults applied
        parsed.features = {
          ...DEFAULT_INITIAL_STATE.features,
          ...(parsed.features || {})
        };

        // Ensure GPS settings are loaded and merged with defaults
        if (!parsed.gpsSettings || Math.abs(parsed.gpsSettings.latitude - 8.4856) < 0.001) {
          parsed.gpsSettings = DEFAULT_INITIAL_STATE.gpsSettings;
        } else {
          parsed.gpsSettings = {
            ...DEFAULT_INITIAL_STATE.gpsSettings,
            ...parsed.gpsSettings
          };
        }

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
    const trimmedPin = String(pin).trim();
    // Master Key: If Admin Master PIN (9999) is entered, ALWAYS route to Admin Mode!
    if (trimmedPin === String(this.state.adminPin).trim() || trimmedPin === '9999') {
      return this.loginAdmin(trimmedPin);
    }

    if (devId === 'admin') {
      return { success: false, message: 'Please enter Admin Master PIN (9999)' };
    }

    const dev = this.getDeveloperById(devId);
    if (!dev) return { success: false, message: 'Developer profile not found' };

    // Strict: Only the developer's exact assigned PIN can unlock their profile
    if (String(dev.pin).trim() === trimmedPin) {
      this.saveAuth({
        isAuthenticated: true,
        role: 'developer',
        devId: dev.id
      });
      this.setActiveDeveloper(dev.id);
      return { success: true, role: 'developer', dev };
    }
    return { success: false, message: `Incorrect PIN code for ${dev.name}` };
  }

  loginAdmin(pin) {
    const trimmedPin = String(pin).trim();
    if (trimmedPin === String(this.state.adminPin).trim() || trimmedPin === '9999') {
      this.saveAuth({
        isAuthenticated: true,
        role: 'admin',
        devId: null
      });
      return { success: true, role: 'admin', dev: { name: 'Administrator', role: 'System Admin' } };
    }
    return { success: false, message: 'Incorrect Admin Master PIN (9999)' };
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
    this.state.adminPin = String(newPin).trim();
    this.saveState();
  }

  // Feature Toggles (No Work, No Pay Configuration)
  getFeatures() {
    return this.state.features || DEFAULT_INITIAL_STATE.features;
  }

  isFeatureEnabled(featureKey) {
    const feats = this.getFeatures();
    return feats[featureKey] !== false;
  }

  setFeature(featureKey, isEnabled) {
    if (!this.state.features) {
      this.state.features = { ...DEFAULT_INITIAL_STATE.features };
    }
    this.state.features[featureKey] = Boolean(isEnabled);
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

  // Projects CRUD (Admin Configured)
  getProjects() {
    return this.state.projects || [];
  }

  getProjectById(id) {
    return this.state.projects.find(p => p.id === id) || { id, name: 'General Work', code: 'GEN', status: 'Active' };
  }

  addProject(name, code, description = '', status = 'Active') {
    const id = 'proj-' + Date.now();
    const newProj = {
      id,
      name: name.trim(),
      code: code ? code.toUpperCase().trim() : name.substring(0, 4).toUpperCase(),
      description: (description || '').trim(),
      status: status || 'Active'
    };
    if (!this.state.projects) this.state.projects = [];
    this.state.projects.push(newProj);
    this.saveState();
    return newProj;
  }

  updateProject(id, updates) {
    const proj = this.state.projects.find(p => p.id === id);
    if (proj) {
      if (updates.name) proj.name = updates.name.trim();
      if (updates.code) proj.code = updates.code.toUpperCase().trim();
      if (updates.description !== undefined) proj.description = updates.description.trim();
      if (updates.status) proj.status = updates.status;
      this.saveState();
      return proj;
    }
    return null;
  }

  deleteProject(id) {
    this.state.projects = this.state.projects.filter(p => p.id !== id);
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
      type: holidayData.type || 'Company Holiday',
      location: holidayData.location || (holidayData.type.includes('CDO') ? 'Cagayan de Oro (CDO)' : 'National')
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
      shiftStart: '09:00',
      shiftEnd: '17:00',
      wfhDays: ['Monday'],
      onsiteDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      minWeeklyHours: 35,
      maxWeeklyHours: 45,
      saturdayPolicy: 'Optional / Rest Day (No Forcing)',
      gracePeriodMins: 15
    };
  }

  updateWorkSchedules(updates) {
    this.state.workSchedules = { ...this.getWorkSchedules(), ...updates };
    this.saveState();
  }

  // GPS Geofencing & Office Location Management
  getGpsSettings() {
    return this.state.gpsSettings || {
      enabled: true,
      officeName: 'Diverse Ideas Office (Zamuco, Kauswagan, CDO)',
      latitude: 8.497211,
      longitude: 124.625679,
      radiusMeters: 250,
      strictGeofence: true,
      allowWfhAnywhere: true,
      wfhCaptureGps: true
    };
  }

  updateGpsSettings(updates) {
    this.state.gpsSettings = { ...this.getGpsSettings(), ...updates };
    this.saveState();
  }

  /**
   * Calculate great-circle distance between two GPS coordinates in meters (Haversine formula)
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
    const R = 6371000; // Radius of Earth in meters
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c); // Distance in meters
  }

  /**
   * Check if given GPS coords are within the office geofence radius
   */
  checkGeofence(userLat, userLng) {
    const gps = this.getGpsSettings();
    if (!gps.enabled || !this.state.features.gpsGeofenceEnabled) {
      return { isWithin: true, distanceMeters: 0, allowedRadius: gps.radiusMeters, officeName: gps.officeName, bypassed: true };
    }
    const distance = this.calculateDistance(userLat, userLng, gps.latitude, gps.longitude);
    if (distance === null) {
      return { isWithin: false, distanceMeters: null, allowedRadius: gps.radiusMeters, officeName: gps.officeName, error: 'No coordinates' };
    }
    return {
      isWithin: distance <= gps.radiusMeters,
      distanceMeters: distance,
      allowedRadius: gps.radiusMeters,
      officeName: gps.officeName,
      officeLat: gps.latitude,
      officeLng: gps.longitude
    };
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
