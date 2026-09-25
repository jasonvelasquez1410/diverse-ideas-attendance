/**
 * DevTrack - State Management Store with PIN Protection & Confidential Rates
 * Handles persistence, team rosters, PIN authentication, role permissions,
 * and live bidirectional server synchronization across office network / cloud.
 */

const STORAGE_KEY = 'devtrack_app_state_v7';
const SESSION_AUTH_KEY = 'devtrack_active_session_auth';
const FIREBASE_DB_URL = 'https://diverse-ideas-attendance-default-rtdb.asia-southeast1.firebasedatabase.app/state.json';

// Default initial state
const DEFAULT_INITIAL_STATE = {
  adminPin: '1410', // Admin Master PIN (Tefanny - 1410)
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
    radiusMeters: 750,                // Expanded geofence radius to accommodate mobile GPS indoors
    strictGeofence: false,            // Flexible geofence: logs location for audit without blocking on GPS drift
    allowWfhAnywhere: true,           // If true, WFH & Saturday employees can clock-in from anywhere
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
    gracePeriodMins: 15,
    autoTimeoutEnabled: true,          // Automatic timeout if employee forgets to clock out
    autoTimeoutTargetTime: '17:00'     // Stamps timeout as 5:00 PM (17:00)
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
    { id: 'proj-1', name: 'Diverse Ideas Core Portal', code: 'DICP', description: 'Internal staff management & attendance suite', status: 'Active' }
  ],
  // Sprout HR Requests (Leave, Certificate of Attendance COA, Overtime OT)
  requests: [
    {
      id: 'req-201',
      developerId: 'dev-1',
      type: 'Leave',
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
    "id": "rec-101-2026-09-25",
    "developerId": "dev-1",
    "date": "2026-09-25",
    "startTime": "2026-09-25T00:48:00.000Z",
    "endTime": "2026-09-25T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 492,
    "hourlyRate": 5,
    "currencySymbol": "$",
    "totalEarnings": 41,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Core feature development & sprint backlog"
  },
  {
    "id": "rec-102-2026-09-25",
    "developerId": "dev-2",
    "date": "2026-09-25",
    "startTime": "2026-09-25T00:41:00.000Z",
    "endTime": "2026-09-25T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 499,
    "hourlyRate": 5,
    "currencySymbol": "$",
    "totalEarnings": 41.58,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Modern responsive glassmorphic dashboard design"
  },
  {
    "id": "rec-103-2026-09-25",
    "developerId": "dev-3",
    "date": "2026-09-25",
    "startTime": "2026-09-25T01:00:00.000Z",
    "endTime": "2026-09-25T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 480,
    "hourlyRate": 18,
    "currencySymbol": "$",
    "totalEarnings": 144,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Database schema migration, query optimization & payroll logic sprint"
  },
  {
    "id": "rec-104-2026-09-25",
    "developerId": "dev-4",
    "date": "2026-09-25",
    "startTime": "2026-09-25T00:28:00.000Z",
    "endTime": "2026-09-25T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 512,
    "hourlyRate": 12,
    "currencySymbol": "$",
    "totalEarnings": 102.4,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Core system architecture, attendance synchronization & DTR portal engine"
  },
  {
    "id": "rec-101-2026-09-24",
    "developerId": "dev-1",
    "date": "2026-09-24",
    "startTime": "2026-09-24T00:49:00.000Z",
    "endTime": "2026-09-24T09:02:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 493,
    "hourlyRate": 5,
    "currencySymbol": "$",
    "totalEarnings": 41.08,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Core feature development & sprint backlog"
  },
  {
    "id": "rec-102-2026-09-24",
    "developerId": "dev-2",
    "date": "2026-09-24",
    "startTime": "2026-09-24T00:44:00.000Z",
    "endTime": "2026-09-24T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 496,
    "hourlyRate": 5,
    "currencySymbol": "$",
    "totalEarnings": 41.33,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Modern responsive glassmorphic dashboard design"
  },
  {
    "id": "rec-103-2026-09-24",
    "developerId": "dev-3",
    "date": "2026-09-24",
    "startTime": "2026-09-24T00:58:00.000Z",
    "endTime": "2026-09-24T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 482,
    "hourlyRate": 18,
    "currencySymbol": "$",
    "totalEarnings": 144.6,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Database schema migration, query optimization & payroll logic sprint"
  },
  {
    "id": "rec-104-2026-09-24",
    "developerId": "dev-4",
    "date": "2026-09-24",
    "startTime": "2026-09-24T00:25:00.000Z",
    "endTime": "2026-09-24T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 515,
    "hourlyRate": 12,
    "currencySymbol": "$",
    "totalEarnings": 103,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Core system architecture, attendance synchronization & DTR portal engine"
  },
  {
    "id": "rec-101-2026-09-23",
    "developerId": "dev-1",
    "date": "2026-09-23",
    "startTime": "2026-09-23T00:46:00.000Z",
    "endTime": "2026-09-23T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 494,
    "hourlyRate": 5,
    "currencySymbol": "$",
    "totalEarnings": 41.17,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Core feature development & sprint backlog"
  },
  {
    "id": "rec-102-2026-09-23",
    "developerId": "dev-2",
    "date": "2026-09-23",
    "startTime": "2026-09-23T00:43:00.000Z",
    "endTime": "2026-09-23T09:05:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 502,
    "hourlyRate": 5,
    "currencySymbol": "$",
    "totalEarnings": 41.83,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Modern responsive glassmorphic dashboard design"
  },
  {
    "id": "rec-103-2026-09-23",
    "developerId": "dev-3",
    "date": "2026-09-23",
    "startTime": "2026-09-23T01:00:00.000Z",
    "endTime": "2026-09-23T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 480,
    "hourlyRate": 18,
    "currencySymbol": "$",
    "totalEarnings": 144,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Database schema migration, query optimization & payroll logic sprint"
  },
  {
    "id": "rec-104-2026-09-23",
    "developerId": "dev-4",
    "date": "2026-09-23",
    "startTime": "2026-09-23T00:30:00.000Z",
    "endTime": "2026-09-23T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 510,
    "hourlyRate": 12,
    "currencySymbol": "$",
    "totalEarnings": 102,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Core system architecture, attendance synchronization & DTR portal engine"
  },
  {
    "id": "rec-101-2026-09-22",
    "developerId": "dev-1",
    "date": "2026-09-22",
    "startTime": "2026-09-22T00:50:00.000Z",
    "endTime": "2026-09-22T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 490,
    "hourlyRate": 5,
    "currencySymbol": "$",
    "totalEarnings": 40.83,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Core feature development & sprint backlog"
  },
  {
    "id": "rec-102-2026-09-22",
    "developerId": "dev-2",
    "date": "2026-09-22",
    "startTime": "2026-09-22T00:39:00.000Z",
    "endTime": "2026-09-22T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 501,
    "hourlyRate": 5,
    "currencySymbol": "$",
    "totalEarnings": 41.75,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Modern responsive glassmorphic dashboard design"
  },
  {
    "id": "rec-103-2026-09-22",
    "developerId": "dev-3",
    "date": "2026-09-22",
    "startTime": "2026-09-22T00:55:00.000Z",
    "endTime": "2026-09-22T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 485,
    "hourlyRate": 18,
    "currencySymbol": "$",
    "totalEarnings": 145.5,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Database schema migration, query optimization & payroll logic sprint"
  },
  {
    "id": "rec-104-2026-09-22",
    "developerId": "dev-4",
    "date": "2026-09-22",
    "startTime": "2026-09-22T00:27:00.000Z",
    "endTime": "2026-09-22T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 513,
    "hourlyRate": 12,
    "currencySymbol": "$",
    "totalEarnings": 102.6,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Core system architecture, attendance synchronization & DTR portal engine"
  },
  {
    "id": "rec-101-2026-09-21",
    "developerId": "dev-1",
    "date": "2026-09-21",
    "startTime": "2026-09-21T00:48:00.000Z",
    "endTime": "2026-09-21T09:01:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 493,
    "hourlyRate": 5,
    "currencySymbol": "$",
    "totalEarnings": 41.08,
    "projectId": "proj-1",
    "workLocation": "wfh",
    "taskNote": "Core feature development & sprint backlog"
  },
  {
    "id": "rec-102-2026-09-21",
    "developerId": "dev-2",
    "date": "2026-09-21",
    "startTime": "2026-09-21T00:40:00.000Z",
    "endTime": "2026-09-21T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 500,
    "hourlyRate": 5,
    "currencySymbol": "$",
    "totalEarnings": 41.67,
    "projectId": "proj-1",
    "workLocation": "wfh",
    "taskNote": "Modern responsive glassmorphic dashboard design"
  },
  {
    "id": "rec-103-2026-09-21",
    "developerId": "dev-3",
    "date": "2026-09-21",
    "startTime": "2026-09-21T01:00:00.000Z",
    "endTime": "2026-09-21T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 480,
    "hourlyRate": 18,
    "currencySymbol": "$",
    "totalEarnings": 144,
    "projectId": "proj-1",
    "workLocation": "wfh",
    "taskNote": "Database schema migration, query optimization & payroll logic sprint"
  },
  {
    "id": "rec-104-2026-09-21",
    "developerId": "dev-4",
    "date": "2026-09-21",
    "startTime": "2026-09-21T00:26:00.000Z",
    "endTime": "2026-09-21T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 514,
    "hourlyRate": 12,
    "currencySymbol": "$",
    "totalEarnings": 102.8,
    "projectId": "proj-1",
    "workLocation": "wfh",
    "taskNote": "Core system architecture, attendance synchronization & DTR portal engine"
  },
  {
    "id": "rec-101-2026-09-19",
    "developerId": "dev-1",
    "date": "2026-09-19",
    "startTime": "2026-09-19T00:48:00.000Z",
    "endTime": "2026-09-19T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 492,
    "hourlyRate": 5,
    "currencySymbol": "$",
    "totalEarnings": 41,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Core feature development & sprint backlog"
  },
  {
    "id": "rec-102-2026-09-19",
    "developerId": "dev-2",
    "date": "2026-09-19",
    "startTime": "2026-09-19T00:42:00.000Z",
    "endTime": "2026-09-19T09:14:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 512,
    "hourlyRate": 5,
    "currencySymbol": "$",
    "totalEarnings": 42.67,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Modern responsive glassmorphic dashboard design"
  },
  {
    "id": "rec-103-2026-09-19",
    "developerId": "dev-3",
    "date": "2026-09-19",
    "startTime": "2026-09-19T00:59:00.000Z",
    "endTime": "2026-09-19T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 481,
    "hourlyRate": 18,
    "currencySymbol": "$",
    "totalEarnings": 144.3,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Database schema migration, query optimization & payroll logic sprint"
  },
  {
    "id": "rec-104-2026-09-19",
    "developerId": "dev-4",
    "date": "2026-09-19",
    "startTime": "2026-09-19T00:46:00.000Z",
    "endTime": "2026-09-19T09:00:00.000Z",
    "breakDurationMinutes": 0,
    "workedMinutes": 494,
    "hourlyRate": 12,
    "currencySymbol": "$",
    "totalEarnings": 98.8,
    "projectId": "proj-1",
    "workLocation": "onsite",
    "taskNote": "Core system architecture, attendance synchronization & DTR portal engine"
  }
]
};

class Store {
  constructor() {
    this.listeners = [];
    this.state = this.loadState();
    this.auth = this.loadAuth();
    this.isServerConnected = false;
    this.lastServerSyncTimestamp = 0;
    this.serverSyncTimeout = null;

    // Cross-tab synchronization
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (event) => {
        if ((event.key === STORAGE_KEY || event.key === 'devtrack_app_state_v2') && event.newValue) {
          try {
            const externalState = JSON.parse(event.newValue);
            this.ensureAllDevelopersAttendanceRecords(externalState);
            this.state = externalState;
            this.notify();
          } catch (err) {}
        }
      });
    }

    // Start background sync with server
    this.initServerSync();
  }

  calculateShiftRenderedTime(options) {
    const {
      startTime,
      endTime,
      breakDurationMinutes = 0,
      developerId,
      date,
      workLocation = 'onsite'
    } = options;

    if (!startTime) {
      return { workedMinutes: 0, totalEarnings: 0, netWorkedMs: 0, breakMinutes: 0, effectiveStart: null, effectiveEnd: null, hourlyRate: 0 };
    }

    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      return { workedMinutes: 0, totalEarnings: 0, netWorkedMs: 0, breakMinutes: 0, effectiveStart: null, effectiveEnd: null, hourlyRate: 0 };
    }

    // Work Schedule & Shift Settings
    const schedules = (this.state && this.state.workSchedules) || { shiftStart: '09:00', shiftEnd: '17:00' };
    const shiftStartStr = schedules.shiftStart || '09:00';
    const shiftEndStr = schedules.shiftEnd || '17:00';
    const [startH, startM] = shiftStartStr.split(':').map(Number);
    const [endH, endM] = shiftEndStr.split(':').map(Number);

    const shiftYear = start.getFullYear();
    const shiftMonth = start.getMonth();
    const shiftDate = start.getDate();

    // Official shift boundary Date objects on the shift's calendar day
    const officialShiftStart = new Date(shiftYear, shiftMonth, shiftDate, startH, startM, 0, 0);
    const officialShiftEnd = new Date(shiftYear, shiftMonth, shiftDate, endH, endM, 0, 0);

    // Check if weekend / Saturday mode (flexible sprint)
    const isSaturday = (workLocation === 'saturday') || (start.getDay() === 6);

    let effectiveStart = start;
    let effectiveEnd = end;

    if (!isSaturday) {
      // 1. Early Time IN rule: Clamped to 09:00 AM (no early OT counted unless approved)
      if (start < officialShiftStart) {
        effectiveStart = officialShiftStart;
      }

      // 2. Late Time OUT rule: Clamped to 05:00 PM (17:00) unless approved OT request exists
      let allowedEnd = officialShiftEnd;
      
      // Check for approved Overtime request
      const recDate = date || (startTime ? startTime.split('T')[0] : '');
      const requests = (this.state && Array.isArray(this.state.requests)) ? this.state.requests : [];
      const approvedOtReq = requests.find(r => 
        r.developerId === developerId && 
        r.type === 'Overtime' && 
        r.status === 'Approved' && 
        (r.startDate === recDate || r.date === recDate)
      );

      if (approvedOtReq) {
        const otHours = parseFloat(approvedOtReq.hours) || 0;
        allowedEnd = new Date(officialShiftEnd.getTime() + (otHours * 3600000));
      }

      if (end > allowedEnd) {
        effectiveEnd = allowedEnd;
      }
    }

    // Calculate elapsed span between effective start and effective end
    let effectiveElapsedMs = 0;
    if (effectiveEnd > effectiveStart) {
      effectiveElapsedMs = effectiveEnd - effectiveStart;
    }

    // Lunch / Break rule: Lunch is PAID. No automatic 1-hour lunch break deduction.
    // Only explicitly logged manual breaks are deducted.
    const breakMs = Math.max(0, (parseInt(breakDurationMinutes) || 0) * 60000);
    const netWorkedMs = Math.max(0, effectiveElapsedMs - breakMs);
    const workedMinutes = Math.round(netWorkedMs / 60000);

    // Earnings calculation
    const dev = this.getDeveloperById(developerId);
    const rate = dev ? (parseFloat(dev.hourlyRate) || 0) : 0;
    const totalEarnings = parseFloat(((netWorkedMs / 3600000) * rate).toFixed(2));

    return {
      workedMinutes,
      totalEarnings,
      netWorkedMs,
      breakMinutes: Math.round(breakMs / 60000),
      effectiveStart,
      effectiveEnd,
      hourlyRate: rate
    };
  }

  sanitizeAndDeduplicateAttendanceRecords(records) {
    if (!Array.isArray(records)) return [];

    const seenKeyMap = new Map();
    const devRateMap = { 'dev-1': 5.00, 'dev-2': 5.00, 'dev-3': 18.00, 'dev-4': 12.00 };

    records.forEach(rawRec => {
      if (!rawRec || !rawRec.developerId) return;
      const rec = { ...rawRec };

      // 0. Exclude dates 18 and below (historical cutoff)
      if (rec.date && rec.date <= '2026-09-18') return;

      // 1. Fix historical typos in dates: 2026-09-11 or 2026-09-12 -> 2026-09-19
      if (rec.date === '2026-09-11' || rec.date === '2026-09-12') {
        rec.date = '2026-09-19';
      }
      if (typeof rec.startTime === 'string' && (rec.startTime.startsWith('2026-09-11') || rec.startTime.startsWith('2026-09-12'))) {
        rec.startTime = rec.startTime.replace(/2026-09-(11|12)/, '2026-09-19');
      }
      if (typeof rec.endTime === 'string' && (rec.endTime.startsWith('2026-09-11') || rec.endTime.startsWith('2026-09-12'))) {
        rec.endTime = rec.endTime.replace(/2026-09-(11|12)/, '2026-09-19');
      }

      // 2. Normalize developer hourly rate & defaults
      if (devRateMap[rec.developerId] !== undefined) {
        rec.hourlyRate = devRateMap[rec.developerId];
      }
      rec.currencySymbol = rec.currencySymbol || '$';
      if (!rec.projectId || ['proj-2', 'proj-3', 'proj-4', 'proj-5'].includes(rec.projectId)) {
        rec.projectId = 'proj-1';
      }

      // 3. Compute/verify workedMinutes and totalEarnings accurately (Shift Clamped & Paid Lunch)
      if (rec.startTime && rec.endTime) {
        const rendered = this.calculateShiftRenderedTime({
          startTime: rec.startTime,
          endTime: rec.endTime,
          breakDurationMinutes: rec.breakDurationMinutes || 0,
          developerId: rec.developerId,
          date: rec.date,
          workLocation: rec.workLocation || 'onsite'
        });
        rec.workedMinutes = rendered.workedMinutes;
        rec.breakDurationMinutes = rendered.breakMinutes;
        rec.totalEarnings = rendered.totalEarnings;
        if (!rec.hourlyRate) rec.hourlyRate = rendered.hourlyRate;
      }

      // 4. Duplicate removal: Key by devId + date
      const key = `${rec.developerId}_${rec.date}`;
      if (!seenKeyMap.has(key)) {
        seenKeyMap.set(key, rec);
      } else {
        const existing = seenKeyMap.get(key);
        const existingEndMs = existing.endTime ? new Date(existing.endTime).getTime() : 0;
        const currentEndMs = rec.endTime ? new Date(rec.endTime).getTime() : 0;
        if (currentEndMs >= existingEndMs || (rec.workedMinutes || 0) >= (existing.workedMinutes || 0)) {
          seenKeyMap.set(key, rec);
        }
      }
    });

    const result = Array.from(seenKeyMap.values());
    // Sort descending: newest date and newest time first
    result.sort((a, b) => {
      const cmpDate = (b.date || '').localeCompare(a.date || '');
      if (cmpDate !== 0) return cmpDate;
      return (b.startTime || '').localeCompare(a.startTime || '');
    });

    return result;
  }

  loadState() {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('devtrack_app_state_v4') || localStorage.getItem('devtrack_app_state_v2');
      if (serialized) {
        const parsed = JSON.parse(serialized);
        if (!parsed.usdToPhpRate) parsed.usdToPhpRate = 58.50;
        
        // Ensure holidays array exists
        if (!parsed.holidays || !Array.isArray(parsed.holidays) || parsed.holidays.length === 0) {
          parsed.holidays = DEFAULT_INITIAL_STATE.holidays;
        }

        // Clean up legacy placeholder projects; leave Diverse Ideas Core Portal and user added projects
        this.sanitizeProjects(parsed);

        // Safe migration: ensure all 4 default developers exist
        if (!Array.isArray(parsed.developers) || parsed.developers.length === 0) {
          parsed.developers = JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE.developers));
        } else {
          DEFAULT_INITIAL_STATE.developers.forEach(defDev => {
            const exists = parsed.developers.some(d => d.id === defDev.id);
            if (!exists) {
              parsed.developers.push(JSON.parse(JSON.stringify(defDev)));
            }
          });
        }

        // Ensure default admin PIN exists or migrate legacy PINs (9999, 0104) to 1410
        if (!parsed.adminPin || parsed.adminPin === '9999' || parsed.adminPin === '0104') {
          parsed.adminPin = '1410';
        }

        // Ensure workSchedules
        if (!parsed.workSchedules) {
          parsed.workSchedules = { ...DEFAULT_INITIAL_STATE.workSchedules };
        }

        // Ensure feature switches
        parsed.features = {
          ...DEFAULT_INITIAL_STATE.features,
          ...(parsed.features || {})
        };

        // Ensure GPS settings
        parsed.gpsSettings = {
          ...DEFAULT_INITIAL_STATE.gpsSettings,
          ...(parsed.gpsSettings || {}),
          strictGeofence: false, // Ensure non-blocking by default on mobile
          radiusMeters: Math.max(750, (parsed.gpsSettings && parsed.gpsSettings.radiusMeters) || 750)
        };

        this.ensureAllDevelopersAttendanceRecords(parsed);

        // Save into new storage key
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        } catch (e) {}

        return parsed;
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE));
  }

  sanitizeProjects(stateObj) {
    if (!stateObj) return;
    const legacyPlaceholderProjects = [
      'JETZ Enterprise System',
      'Accounting & Payroll Module',
      'Mobile App Optimization',
      'Internal Tooling & Automation'
    ];
    const legacyCodes = ['JETZ', 'ACCT', 'MOBI', 'TOOL'];

    if (Array.isArray(stateObj.projects)) {
      stateObj.projects = stateObj.projects.filter(p => {
        if (!p || !p.name) return false;
        if (legacyPlaceholderProjects.includes(p.name)) return false;
        if (p.code && legacyCodes.includes(p.code)) return false;
        if (['proj-2', 'proj-3', 'proj-4', 'proj-5'].includes(p.id)) return false;
        return true;
      });
      if (!stateObj.projects.some(p => p.id === 'proj-1' || p.name === 'Diverse Ideas Core Portal')) {
        stateObj.projects.unshift({
          id: 'proj-1',
          name: 'Diverse Ideas Core Portal',
          code: 'DICP',
          description: 'Internal staff management & attendance suite',
          status: 'Active'
        });
      }
      stateObj.projects.forEach(p => {
        if (!p.status) p.status = 'Active';
        if (!p.description) p.description = '';
      });
    } else {
      stateObj.projects = [
        {
          id: 'proj-1',
          name: 'Diverse Ideas Core Portal',
          code: 'DICP',
          description: 'Internal staff management & attendance suite',
          status: 'Active'
        }
      ];
    }

    // Remap any attendance records with old placeholder project IDs to proj-1
    if (Array.isArray(stateObj.attendanceRecords)) {
      stateObj.attendanceRecords.forEach(rec => {
        if (['proj-2', 'proj-3', 'proj-4', 'proj-5'].includes(rec.projectId)) {
          rec.projectId = 'proj-1';
        }
      });
    }
  }

  sanitizeDeveloperStatuses(stateObj) {
    if (!stateObj || !Array.isArray(stateObj.developers)) return;
    stateObj.developers.forEach(dev => {
      // Only sanitize if developer status is working/break but activeSession is missing or empty
      if ((dev.status === 'working' || dev.status === 'break') && (!dev.activeSession || !dev.activeSession.startTime)) {
        dev.status = 'offline';
        dev.activeSession = null;
      }
    });
  }

  ensureAllDevelopersAttendanceRecords(stateObj) {
    if (!stateObj) return stateObj;
    if (!Array.isArray(stateObj.attendanceRecords)) {
      stateObj.attendanceRecords = [];
    }

    this.sanitizeProjects(stateObj);

    // Ensure all 4 developers exist in developers roster
    if (!Array.isArray(stateObj.developers) || stateObj.developers.length === 0) {
      stateObj.developers = JSON.parse(JSON.stringify(DEFAULT_INITIAL_STATE.developers));
    } else {
      DEFAULT_INITIAL_STATE.developers.forEach(defDev => {
        if (!stateObj.developers.some(d => d.id === defDev.id)) {
          stateObj.developers.push(JSON.parse(JSON.stringify(defDev)));
        }
      });
    }

    // Ensure all 4 developers have records for all standard working dates
    const allDevs = ['dev-1', 'dev-2', 'dev-3', 'dev-4'];
    const requiredDates = [
      '2026-09-25',
      '2026-09-24',
      '2026-09-23',
      '2026-09-22',
      '2026-09-21',
      '2026-09-19',
      '2026-09-18',
      '2026-09-17',
      '2026-09-16',
      '2026-09-15',
      '2026-09-14'
    ];

    allDevs.forEach(devId => {
      requiredDates.forEach(dStr => {
        const hasDateRecord = stateObj.attendanceRecords.some(r => r.developerId === devId && r.date === dStr);
        if (!hasDateRecord) {
          const seed = DEFAULT_INITIAL_STATE.attendanceRecords.find(r => r.developerId === devId && r.date === dStr);
          if (seed) stateObj.attendanceRecords.push({ ...seed });
        }
      });
    });

    // Final clean sort and deduplication
    stateObj.attendanceRecords = this.sanitizeAndDeduplicateAttendanceRecords(stateObj.attendanceRecords);

    // Reset corrupted/empty working sessions without clearing legitimate active punches
    this.sanitizeDeveloperStatuses(stateObj);

    return stateObj;
  }

  saveState(syncToServer = true) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to persist state to localStorage:', e);
    }
    this.notify();

    if (syncToServer) {
      this.debouncedSaveToServer();
    }
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

  // ==========================================
  // Bidirectional Firebase Cloud Synchronization Engine
  // ==========================================

  async initServerSync() {
    if (typeof window === 'undefined' || !window.fetch) return;

    // Initial server fetch
    await this.fetchServerState(true);

    // High-frequency live background cloud sync every 3.5 seconds
    setInterval(() => {
      this.fetchServerState(false);
    }, 3500);
  }

  dispatchSyncStatus(status, detail = {}) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('devtrack:syncStatus', {
        detail: { status, isServerConnected: this.isServerConnected, ...detail }
      }));
    }
  }

  hasMeaningfulServerChanges(localState, serverData) {
    if (!localState || !serverData) return true;
    if ((localState.attendanceRecords || []).length !== (serverData.attendanceRecords || []).length) return true;
    for (let i = 0; i < (serverData.developers || []).length; i++) {
      const sDev = serverData.developers[i];
      const lDev = (localState.developers || []).find(d => d.id === sDev.id);
      if (!lDev) return true;
      if (lDev.status !== sDev.status) return true;
      const lSession = lDev.activeSession ? lDev.activeSession.startTime : null;
      const sSession = sDev.activeSession ? sDev.activeSession.startTime : null;
      if (lSession !== sSession) return true;
    }
    return false;
  }

  async fetchServerState(isInitial = false) {
    try {
      let serverData = null;

      // 1. Direct fetch from Firebase Realtime Database
      try {
        const fbRes = await fetch(FIREBASE_DB_URL, { headers: { 'Cache-Control': 'no-cache' } });
        if (fbRes.ok) {
          serverData = await fbRes.json();
        }
      } catch (fbErr) {
        console.warn('Direct Firebase sync fallback to API:', fbErr.message);
      }

      // 2. Fallback to /api/state proxy if needed
      if (!serverData) {
        const response = await fetch('/api/state', {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (response.ok) {
          serverData = await response.json();
        }
      }

      if (!serverData) {
        throw new Error('No cloud response');
      }

      this.isServerConnected = true;

      if (serverData.exists === false || !Array.isArray(serverData.developers)) {
        // Cloud database is empty -> push local state to seed
        await this.postStateToServer(this.state);
        this.dispatchSyncStatus('synced', { message: 'Cloud database initialized' });
        return;
      }

      const serverTimestamp = serverData._serverTimestamp || 0;

      // Check if server data is newer or has live status updates from other team members
      if (isInitial || serverTimestamp > this.lastServerSyncTimestamp || this.hasMeaningfulServerChanges(this.state, serverData)) {
        this.sanitizeProjects(serverData);
        this.ensureAllDevelopersAttendanceRecords(serverData);

        // 1. Merge attendance records: Union with deduplication so NO record is ever lost
        const mergedRecords = this.sanitizeAndDeduplicateAttendanceRecords([
          ...(this.state.attendanceRecords || []),
          ...(serverData.attendanceRecords || [])
        ]);
        serverData.attendanceRecords = mergedRecords;

        // 2. Intelligent developer active session merge across all developers
        if (Array.isArray(this.state.developers) && Array.isArray(serverData.developers)) {
          this.state.developers.forEach(localDev => {
            const serverDev = serverData.developers.find(d => d.id === localDev.id);
            if (!serverDev) return;

            // If localDev is working/break and serverDev is offline:
            // Preserve local active session unless server has a completed record matching this session
            if ((localDev.status === 'working' || localDev.status === 'break') && localDev.activeSession) {
              const localStart = localDev.activeSession.startTime;
              const hasCompleted = mergedRecords.some(
                r => r.developerId === localDev.id && r.startTime === localStart && r.endTime
              );
              if (!hasCompleted) {
                serverDev.status = localDev.status;
                serverDev.activeSession = localDev.activeSession;
              }
            }
          });
        }

        this.state = serverData;
        this.lastServerSyncTimestamp = serverTimestamp;

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        } catch (e) {}

        this.notify();
        this.dispatchSyncStatus('synced', { message: '🟢 Cloud Synced (Firebase)' });
      }
    } catch (err) {
      this.isServerConnected = false;
      this.dispatchSyncStatus('local', { error: err.message });
    }
  }

  debouncedSaveToServer() {
    if (this.serverSyncTimeout) {
      clearTimeout(this.serverSyncTimeout);
    }
    this.dispatchSyncStatus('saving');

    this.serverSyncTimeout = setTimeout(async () => {
      await this.postStateToServer(this.state);
    }, 250);
  }

  async postStateToServer(stateData) {
    try {
      this.sanitizeProjects(stateData);
      stateData._serverTimestamp = Date.now();
      const payload = JSON.stringify(stateData);

      // Direct Firebase PUT (Instant sub-second cloud sync)
      try {
        await fetch(FIREBASE_DB_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: payload
        });
      } catch (e) {}

      // Also notify /api/state proxy
      try {
        await fetch('/api/state', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: payload
        });
      } catch (e) {}

      this.isServerConnected = true;
      this.lastServerSyncTimestamp = stateData._serverTimestamp;
      this.dispatchSyncStatus('synced', { timestamp: this.lastServerSyncTimestamp, message: '🟢 Cloud Synced (Firebase)' });
    } catch (err) {
      this.isServerConnected = false;
      this.dispatchSyncStatus('local', { error: err.message });
    }
  }

  // ==========================================
  // Authentication & Verification
  // ==========================================

  loginDeveloper(devId, pin) {
    const trimmedPin = String(pin).trim();
    // Master Key: If Admin Master PIN (1410) is entered, ALWAYS route to Admin Mode!
    if (trimmedPin === String(this.state.adminPin).trim() || trimmedPin === '1410') {
      return this.loginAdmin(trimmedPin);
    }

    if (devId === 'admin') {
      return { success: false, message: 'Please enter Admin Master PIN (1410)' };
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
    if (trimmedPin === String(this.state.adminPin).trim() || trimmedPin === '1410') {
      this.saveAuth({
        isAuthenticated: true,
        role: 'admin',
        devId: null
      });
      return { success: true, role: 'admin', dev: { name: 'Administrator', role: 'System Admin' } };
    }
    return { success: false, message: 'Incorrect Admin Master PIN (1410)' };
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
      activeSession: null,
      leaveCredits: devData.leaveCredits || { vacation: 12, sick: 10, emergency: 5 }
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
    this.sanitizeProjects(this.state);
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
  getAttendanceRecordById(id) {
    return (this.state.attendanceRecords || []).find(r => r.id === id);
  }

  addAttendanceRecord(record) {
    if (!this.state.attendanceRecords) this.state.attendanceRecords = [];
    this.state.attendanceRecords.unshift({
      id: record.id || ('rec-' + Date.now()),
      ...record
    });
    this.state.attendanceRecords = this.sanitizeAndDeduplicateAttendanceRecords(this.state.attendanceRecords);
    this.saveState(true);
    this.postStateToServer(this.state);
  }

  updateAttendanceRecord(id, updates) {
    if (!this.state.attendanceRecords) return null;
    const rec = this.state.attendanceRecords.find(r => r.id === id);
    if (!rec) return null;

    Object.assign(rec, updates);

    // If startTime and endTime are updated, recalculate workedMinutes and totalEarnings with shift clamping & paid lunch
    if (updates.startTime && updates.endTime) {
      const rendered = this.calculateShiftRenderedTime({
        startTime: updates.startTime,
        endTime: updates.endTime,
        breakDurationMinutes: rec.breakDurationMinutes || 0,
        developerId: rec.developerId,
        date: rec.date,
        workLocation: rec.workLocation || 'onsite'
      });
      rec.workedMinutes = rendered.workedMinutes;
      rec.breakDurationMinutes = rendered.breakMinutes;
      rec.totalEarnings = rendered.totalEarnings;
      rec.hourlyRate = rendered.hourlyRate;
    } else if (updates.workedMinutes !== undefined) {
      const dev = this.getDeveloperById(rec.developerId);
      const rate = dev ? (parseFloat(dev.hourlyRate) || 0) : (parseFloat(rec.hourlyRate) || 0);
      rec.totalEarnings = parseFloat(((rec.workedMinutes / 60) * rate).toFixed(2));
    }

    this.state.attendanceRecords = this.sanitizeAndDeduplicateAttendanceRecords(this.state.attendanceRecords);
    this.saveState(true);
    this.postStateToServer(this.state);
    return rec;
  }

  deleteAttendanceRecord(id) {
    if (!this.state.attendanceRecords) return;
    this.state.attendanceRecords = this.state.attendanceRecords.filter(r => r.id !== id);
    this.saveState(true);
    this.postStateToServer(this.state);
  }

  // Leave & Request Management (Sprout HR Style)
  getRequests(devId = null) {
    if (!this.state.requests) return [];
    if (devId && devId !== 'all') {
      return this.state.requests.filter(r => r.developerId === devId);
    }
    return this.state.requests;
  }

  addRequest(reqData) {
    const newReq = {
      id: 'req-' + Date.now(),
      developerId: reqData.developerId,
      type: reqData.type,
      subType: reqData.subType || reqData.type,
      startDate: reqData.startDate,
      endDate: reqData.endDate || reqData.startDate,
      days: reqData.days || 1,
      hours: reqData.hours || null,
      reason: reqData.reason,
      status: 'Pending',
      dateFiled: new Date().toISOString().split('T')[0]
    };
    if (!this.state.requests) this.state.requests = [];
    this.state.requests.unshift(newReq);
    this.saveState();
    return newReq;
  }

  updateRequestStatus(reqId, status) {
    if (!this.state.requests) return;
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
      gracePeriodMins: 15,
      autoTimeoutEnabled: true,
      autoTimeoutTargetTime: '17:00'
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
      radiusMeters: 750,
      strictGeofence: false,
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
  checkGeofence(userLat, userLng, userAccuracy = 0) {
    const gps = this.getGpsSettings();
    if (!gps.enabled || !this.state.features.gpsGeofenceEnabled) {
      return { isWithin: true, distanceMeters: 0, allowedRadius: gps.radiusMeters || 750, officeName: gps.officeName, bypassed: true };
    }
    const distance = this.calculateDistance(userLat, userLng, gps.latitude, gps.longitude);
    if (distance === null) {
      return { isWithin: !gps.strictGeofence, distanceMeters: null, allowedRadius: gps.radiusMeters || 750, officeName: gps.officeName, error: 'No coordinates' };
    }
    const radius = Math.max(750, gps.radiusMeters || 750);
    const effectiveRadius = Math.max(radius, radius + Math.min(1000, (userAccuracy || 0)));
    const withinGeofence = distance <= effectiveRadius;
    return {
      isWithin: (!gps.strictGeofence) ? true : withinGeofence,
      isGeofenceMatch: withinGeofence,
      distanceMeters: distance,
      allowedRadius: radius,
      officeName: gps.officeName,
      officeLat: gps.latitude,
      officeLng: gps.longitude,
      accuracy: userAccuracy
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
