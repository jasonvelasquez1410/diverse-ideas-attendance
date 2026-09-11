/**
 * DevTrack - Main Application Controller with PIN Security & Rate Confidentiality
 */

document.addEventListener('DOMContentLoaded', () => {
  const store = window.DevStore;
  const attendance = window.DevAttendance;
  const payroll = window.DevPayroll;
  const exporter = window.DevExport;

  // DOM Elements - Navigation & Header
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const headerLiveTime = document.getElementById('header-live-time');
  const btnHeaderAuthSwitch = document.getElementById('btn-header-auth-switch');
  const headerUserAvatar = document.getElementById('header-user-avatar');
  const headerUserName = document.getElementById('header-user-name');
  const headerUserRoleBadge = document.getElementById('header-user-role-badge');
  const btnLogout = document.getElementById('btn-logout');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');

  // DOM Elements - Auth Lock Overlay
  const authLockScreen = document.getElementById('auth-lock-screen');
  const authDevGrid = document.getElementById('auth-dev-grid');
  const authPinForm = document.getElementById('auth-pin-form');
  const authPinInput = document.getElementById('auth-pin-input');
  const authErrorMsg = document.getElementById('auth-error-msg');
  const btnAdminLoginModal = document.getElementById('btn-admin-login-modal');
  let selectedAuthDevId = null;

  // DOM Elements - Terminal / Clock View
  const terminalDevAvatar = document.getElementById('terminal-dev-avatar');
  const terminalDevName = document.getElementById('terminal-dev-name');
  const terminalDevRole = document.getElementById('terminal-dev-role');
  const terminalDevRate = document.getElementById('terminal-dev-rate');
  const terminalStatusBadge = document.getElementById('terminal-status-badge');
  const terminalTimerDigits = document.getElementById('terminal-timer-digits');
  const terminalWorkedVal = document.getElementById('terminal-worked-val');
  const terminalBreakVal = document.getElementById('terminal-break-val');
  const terminalEarningsVal = document.getElementById('terminal-earnings-val');
  const terminalLocationSelect = document.getElementById('terminal-location-select');
  const terminalProjectSelect = document.getElementById('terminal-project-select');
  const terminalTaskNotes = document.getElementById('terminal-task-notes');
  const btnClockIn = document.getElementById('btn-clock-in');
  const btnBreak = document.getElementById('btn-break');
  const btnClockOut = document.getElementById('btn-clock-out');
  const todayActivityList = document.getElementById('today-activity-list');

  // DOM Elements - DTR Log
  const dtrTimeIn = document.getElementById('dtr-time-in');
  const dtrDateIn = document.getElementById('dtr-date-in');
  const dtrBreakTime = document.getElementById('dtr-break-time');
  const dtrBreakStatus = document.getElementById('dtr-break-status');
  const dtrTimeOut = document.getElementById('dtr-time-out');
  const dtrDateOut = document.getElementById('dtr-date-out');
  const dtrTotalRendered = document.getElementById('dtr-total-rendered');
  const dtrShiftStatus = document.getElementById('dtr-shift-status');

  // DOM Elements - Attendance View
  const attendanceGrid = document.getElementById('attendance-grid');
  const statOnlineDevs = document.getElementById('stat-online-devs');
  const statTodayHours = document.getElementById('stat-today-hours');
  const statTodayPayroll = document.getElementById('stat-today-payroll');

  // DOM Elements - Timesheet / Payroll View
  const payrollDateFilter = document.getElementById('payroll-date-filter');
  const payrollDevFilter = document.getElementById('payroll-dev-filter');
  const payrollProjectFilter = document.getElementById('payroll-project-filter');
  const customDateRangeContainer = document.getElementById('custom-date-range-container');
  const customStartDate = document.getElementById('custom-start-date');
  const customEndDate = document.getElementById('custom-end-date');
  const timesheetTableBody = document.getElementById('timesheet-table-body');
  const summaryTotalHours = document.getElementById('summary-total-hours');
  const summaryTotalPayroll = document.getElementById('summary-total-payroll');
  const summaryTotalPayrollPhp = document.getElementById('summary-total-payroll-php');
  const summaryTotalSessions = document.getElementById('summary-total-sessions');
  const summaryAvgRate = document.getElementById('summary-avg-rate');
  const summaryAvgRatePhp = document.getElementById('summary-avg-rate-php');
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnPrintReport = document.getElementById('btn-print-report');
  const btnOpenManualEntry = document.getElementById('btn-open-manual-entry');

  // Forex & Real-Time Conversion Elements
  const exchangeRateDisplay = document.getElementById('exchange-rate-display');
  const exchangeSourceBadge = document.getElementById('exchange-source-badge');
  const exchangeLastUpdated = document.getElementById('exchange-last-updated');
  const btnRefreshExchangeRate = document.getElementById('btn-refresh-exchange-rate');
  const btnCustomExchangeRate = document.getElementById('btn-custom-exchange-rate');

  // Bottom Real-Time Conversion Summary Elements
  const bottomConversionCard = document.getElementById('bottom-conversion-card');
  const bottomActiveRateBadge = document.getElementById('bottom-active-rate-badge');
  const bottomUsdTotal = document.getElementById('bottom-usd-total');
  const bottomPhpTotal = document.getElementById('bottom-php-total');
  const bottomPhpAvgRate = document.getElementById('bottom-php-avg-rate');
  const bottomHoursCount = document.getElementById('bottom-hours-count');
  const bottomDevBreakdownGrid = document.getElementById('bottom-dev-breakdown-grid');

  // Custom Forex Modal Elements
  const modalCustomRate = document.getElementById('modal-custom-rate');
  const formCustomRate = document.getElementById('form-custom-rate');
  const inputCustomRate = document.getElementById('input-custom-rate');
  const btnCloseCustomRate = document.getElementById('btn-close-custom-rate');
  const btnCancelCustomRate = document.getElementById('btn-cancel-custom-rate');
  const btnFetchLiveForex = document.getElementById('btn-fetch-live-forex');
  const btnDefaultForex = document.getElementById('btn-default-forex');

  // Payslip Modal Elements
  const modalPayslipPreview = document.getElementById('modal-payslip-preview');
  const btnClosePayslip = document.getElementById('btn-close-payslip');
  const btnClosePayslipFooter = document.getElementById('btn-close-payslip-footer');
  const btnPrintPayslipDirect = document.getElementById('btn-print-payslip-direct');
  const payslipEmpName = document.getElementById('payslip-emp-name');
  const payslipEmpRole = document.getElementById('payslip-emp-role');
  const payslipPeriodDates = document.getElementById('payslip-period-dates');
  const payslipRateApplied = document.getElementById('payslip-rate-applied');
  const payslipBreakdownRows = document.getElementById('payslip-breakdown-rows');
  const payslipNetUsd = document.getElementById('payslip-net-usd');
  const payslipNetPhp = document.getElementById('payslip-net-php');
  const payslipVoucherNo = document.getElementById('payslip-voucher-no');

  // DOM Elements - Settings View
  const settingsDevTableBody = document.getElementById('settings-dev-table-body');
  const settingsProjectTableBody = document.getElementById('settings-project-table-body');
  const btnOpenAddDev = document.getElementById('btn-open-add-dev');
  const btnOpenAddProject = document.getElementById('btn-open-add-project');
  const btnExportBackup = document.getElementById('btn-export-backup');
  const btnTriggerImport = document.getElementById('btn-trigger-import');
  const fileImportInput = document.getElementById('file-import-input');
  const btnResetData = document.getElementById('btn-reset-data');

  // Toast Container
  const toastContainer = document.getElementById('toast-container');

  // ==========================================
  // 1. Authentication & PIN Security Engine
  // ==========================================
  function checkAuth() {
    const auth = store.getAuth();
    if (!auth.isAuthenticated) {
      renderAuthLockScreen();
      authLockScreen.style.display = 'flex';
    } else {
      authLockScreen.style.display = 'none';
      updateHeaderAuthProfile();
    }
  }

  function renderAuthLockScreen() {
    const state = store.getState();
    authDevGrid.innerHTML = '';
    authErrorMsg.textContent = '';
    authPinInput.value = '';

    if (!selectedAuthDevId) {
      selectedAuthDevId = 'admin';
    }

    // 1. Admin Master Profile Button
    const adminBtn = document.createElement('button');
    adminBtn.type = 'button';
    adminBtn.className = `auth-dev-btn ${selectedAuthDevId === 'admin' ? 'selected' : ''}`;
    adminBtn.innerHTML = `
      <div style="width: 26px; height: 26px; border-radius: 50%; background: #ec4899; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; color: white;">
        ADM
      </div>
      <span>Administrator</span>
    `;
    adminBtn.addEventListener('click', () => {
      selectedAuthDevId = 'admin';
      document.querySelectorAll('.auth-dev-btn').forEach(b => b.classList.remove('selected'));
      adminBtn.classList.add('selected');
      authPinInput.placeholder = '••••';
      authPinInput.focus();
    });
    authDevGrid.appendChild(adminBtn);

    // 2. Developer Profile Buttons
    state.developers.forEach(dev => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `auth-dev-btn ${dev.id === selectedAuthDevId ? 'selected' : ''}`;
      btn.innerHTML = `
        <div style="width: 26px; height: 26px; border-radius: 50%; background: ${dev.avatarColor}; display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 700; color: white;">
          ${dev.initials}
        </div>
        <span>${dev.name.split(' ')[0]}</span>
      `;

      btn.addEventListener('click', () => {
        selectedAuthDevId = dev.id;
        document.querySelectorAll('.auth-dev-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        authPinInput.placeholder = '••••';
        authPinInput.focus();
      });

      authDevGrid.appendChild(btn);
    });
  }

  authPinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pin = authPinInput.value.trim();
    if (!pin) return;

    // 1. If Administrator profile is selected: MUST enter Admin Master PIN (9999)
    if (selectedAuthDevId === 'admin') {
      const result = store.loginAdmin(pin);
      if (result.success) {
        authLockScreen.style.display = 'none';
        showToast('Welcome, Administrator (Management Mode)', 'success');
        const navBtnTerminal = document.getElementById('nav-btn-terminal');
        if (navBtnTerminal) navBtnTerminal.click();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderAll();
        return;
      } else {
        authErrorMsg.textContent = '❌ Incorrect Admin Master PIN (9999).';
        authPinInput.value = '';
        authPinInput.focus();
        return;
      }
    }

    // 2. If Staff profile is selected (Alex, Maria, Kenji, Chloe): MUST enter Developer's specific PIN
    const result = store.loginDeveloper(selectedAuthDevId, pin);
    if (result.success) {
      authLockScreen.style.display = 'none';
      showToast(`Welcome, ${result.dev.name}!`, 'success');
      const navBtnTerminal = document.getElementById('nav-btn-terminal');
      if (navBtnTerminal) navBtnTerminal.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      renderAll();
    } else {
      const targetDev = store.getDeveloperById(selectedAuthDevId);
      const devName = targetDev ? targetDev.name.split(' ')[0] : 'Staff';
      authErrorMsg.textContent = `❌ Incorrect PIN for ${devName}. (Admin 9999 is only for Administrator)`;
      authPinInput.value = '';
      authPinInput.focus();
    }
  });

  btnAdminLoginModal.addEventListener('click', () => {
    const pin = prompt('Enter Admin Master PIN (9999):');
    if (pin !== null) {
      const result = store.loginAdmin(pin.trim());
      if (result.success) {
        authLockScreen.style.display = 'none';
        showToast('Unlocked Admin Mode (Full Payroll & Rates Access)', 'success');
        renderAll();
      } else {
        alert('❌ Access Denied: Incorrect Admin PIN.');
      }
    }
  });

  function updateHeaderAuthProfile() {
    const auth = store.getAuth();
    if (auth.role === 'admin') {
      headerUserAvatar.textContent = 'ADM';
      headerUserAvatar.style.background = '#ec4899';
      headerUserName.textContent = 'Administrator';
      headerUserRoleBadge.textContent = 'ADMIN';
      headerUserRoleBadge.style.background = 'rgba(236, 72, 153, 0.2)';
      headerUserRoleBadge.style.color = '#f472b6';
    } else {
      const dev = store.getDeveloperById(auth.devId);
      if (dev) {
        headerUserAvatar.textContent = dev.initials;
        headerUserAvatar.style.background = dev.avatarColor;
        headerUserName.textContent = dev.name;
        headerUserRoleBadge.textContent = 'DEV';
        headerUserRoleBadge.style.background = 'rgba(99, 102, 241, 0.2)';
        headerUserRoleBadge.style.color = 'var(--accent-cyan)';
      }
    }
  }

  btnLogout.addEventListener('click', () => {
    store.logout();
    showToast('Locked. Please enter PIN to access.', 'info');
    checkAuth();
  });

  btnHeaderAuthSwitch.addEventListener('click', () => {
    store.logout();
    checkAuth();
  });

  // ==========================================
  // 2. Header Live Clock & Theme Toggle
  // ==========================================
  function initHeaderClock() {
    const liveDateEl = document.getElementById('sprout-live-date');
    const liveTimeEl = document.getElementById('sprout-live-time');
    
    function updateClock() {
      const now = new Date();
      const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      if(headerLiveTime) {
        headerLiveTime.textContent = now.toLocaleDateString('en-US', options);
      }
      if (liveDateEl) {
        liveDateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      }
      if (liveTimeEl) {
        liveTimeEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('devtrack_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (themeToggleBtn) {
      themeToggleBtn.innerHTML = savedTheme === 'light'
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    }
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('devtrack_theme', newTheme);
    themeToggleBtn.innerHTML = newTheme === 'light' 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    showToast(`Switched to ${newTheme.toUpperCase()} mode`, 'info');
  });

  initTheme();

  // ==========================================
  // 3. Navigation Tabs
  // ==========================================
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPaneId = tab.getAttribute('data-tab');

      // Restrict Settings tab to Admin
      if (targetPaneId === 'tab-settings' && !store.isAdmin()) {
        const pin = prompt('Team & Rates configuration is confidential.\nEnter Admin Master PIN to access:');
        if (pin === store.getState().adminPin) {
          store.loginAdmin(pin);
          updateHeaderAuthProfile();
        } else {
          alert('Access denied. Admin PIN required.');
          return;
        }
      }

      navTabs.forEach(t => t.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetPaneId);
      if (targetPane) targetPane.classList.add('active');

      if (targetPaneId === 'tab-attendance') renderAttendanceBoard();
      if (targetPaneId === 'tab-leaves') renderLeavesAndRequests();
      if (targetPaneId === 'tab-payroll') renderTimesheetsAndPayroll();
      if (targetPaneId === 'tab-settings') renderSettings();
    });
  });

  // ==========================================
  // 4. Clock Terminal View (Confidential to Active Developer)
  // ==========================================
  function renderProjectDropdowns() {
    const projects = store.getProjects();
    terminalProjectSelect.innerHTML = '';
    payrollProjectFilter.innerHTML = '<option value="all">All Projects</option>';

    projects.forEach(p => {
      const opt1 = document.createElement('option');
      opt1.value = p.id;
      opt1.textContent = `[${p.code}] ${p.name}`;
      terminalProjectSelect.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = p.id;
      opt2.textContent = `[${p.code}] ${p.name}`;
      payrollProjectFilter.appendChild(opt2);
    });
  }

  function setDefaultWorkLocation() {
    const day = new Date().getDay();
    if (terminalLocationSelect) {
      terminalLocationSelect.value = (day === 1) ? 'wfh' : 'onsite';
    }
  }

  function renderClockTerminal() {
    const activeDev = store.getActiveDeveloper();
    if (!activeDev) return;

    renderPaydayWidgets();

    terminalDevAvatar.textContent = activeDev.initials;
    terminalDevAvatar.style.background = activeDev.avatarColor;
    terminalDevName.textContent = activeDev.name;
    terminalDevRole.textContent = activeDev.role;
    terminalDevRate.textContent = `Rate: Confidential 🔒`;

    // Check today's logged records for active developer
    const todayStr = new Date().toISOString().split('T')[0];
    const todayRecords = store.getState().attendanceRecords.filter(r => r.developerId === activeDev.id && r.date === todayStr);

    if (activeDev.status === 'working') {
      terminalStatusBadge.className = 'badge badge-working';
      terminalStatusBadge.innerHTML = `<span class="badge-dot"></span> Present (Working)`;
      btnClockIn.disabled = true;
      btnBreak.disabled = false;
      btnBreak.textContent = '☕ Start Break';
      btnBreak.className = 'btn btn-warning btn-lg';
      btnClockOut.disabled = false;

      if (activeDev.activeSession) {
        const inDate = new Date(activeDev.activeSession.startTime);
        dtrTimeIn.textContent = inDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        dtrDateIn.textContent = `Logged at ${inDate.toLocaleDateString()}`;
        dtrTimeOut.textContent = '--:--:--';
        dtrDateOut.textContent = 'Shift ongoing';
        
        const totalBreakMins = Math.round((activeDev.activeSession.breaks || []).reduce((acc, b) => acc + (b.durationMs || 0), 0) / 60000);
        dtrBreakTime.textContent = totalBreakMins > 0 ? `${totalBreakMins}m` : '0m';
        dtrBreakStatus.textContent = 'No active break';

        terminalProjectSelect.value = activeDev.activeSession.projectId || 'proj-1';
        terminalTaskNotes.value = activeDev.activeSession.taskNote || '';
        if (activeDev.activeSession.workLocation) {
          terminalLocationSelect.value = activeDev.activeSession.workLocation;
        }
      }
    } else if (activeDev.status === 'break') {
      terminalStatusBadge.className = 'badge badge-break';
      terminalStatusBadge.innerHTML = `<span class="badge-dot"></span> On Scheduled Break`;
      btnClockIn.disabled = true;
      btnBreak.disabled = false;
      btnBreak.textContent = '▶ End Break (Resume)';
      btnBreak.className = 'btn btn-success btn-lg';
      btnClockOut.disabled = false;

      if (activeDev.activeSession) {
        const inDate = new Date(activeDev.activeSession.startTime);
        dtrTimeIn.textContent = inDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        dtrDateIn.textContent = `Logged at ${inDate.toLocaleDateString()}`;
        dtrBreakStatus.textContent = 'Break in progress...';
      }
    } else {
      terminalStatusBadge.className = 'badge badge-offline';
      terminalStatusBadge.innerHTML = `<span class="badge-dot"></span> Offline / Not Logged In`;
      btnClockIn.disabled = false;
      btnBreak.disabled = true;
      btnBreak.textContent = '☕ Start Break';
      btnBreak.className = 'btn btn-warning btn-lg';
      btnClockOut.disabled = true;

      if (todayRecords.length > 0) {
        const latest = todayRecords[0];
        const inDate = new Date(latest.startTime);
        const outDate = new Date(latest.endTime);
        dtrTimeIn.textContent = inDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        dtrDateIn.textContent = `Time IN (${latest.workLocation.toUpperCase()})`;
        dtrTimeOut.textContent = outDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        dtrDateOut.textContent = `Time OUT logged`;
        dtrBreakTime.textContent = `${latest.breakDurationMinutes}m`;
        dtrBreakStatus.textContent = 'Completed break';
        dtrTotalRendered.textContent = `${(latest.workedMinutes / 60).toFixed(2)} hrs`;
        dtrShiftStatus.textContent = 'Shift Completed';
      } else {
        dtrTimeIn.textContent = '--:--:--';
        dtrDateIn.textContent = 'Not yet logged';
        dtrBreakTime.textContent = '--:--';
        dtrBreakStatus.textContent = 'No active break';
        dtrTimeOut.textContent = '--:--:--';
        dtrDateOut.textContent = 'End of shift';
        dtrTotalRendered.textContent = '0.00 hrs';
        dtrShiftStatus.textContent = 'Standard Shift';
      }
      setDefaultWorkLocation();
    }

    renderTodayActivityList(activeDev.id);
  }

  function renderTodayActivityList(devId) {
    const todayStr = new Date().toISOString().split('T')[0];
    const records = store.getState().attendanceRecords.filter(r => r.developerId === devId && r.date === todayStr);

    todayActivityList.innerHTML = '';
    if (records.length === 0) {
      todayActivityList.innerHTML = `
        <div style="background: var(--bg-tertiary); padding: 18px; border-radius: var(--radius-md); text-align: center; color: var(--text-muted); font-size: 0.88rem; border: 1px dashed var(--border-color);">
          No completed shift entries logged today yet. Punch <strong>Time IN</strong> above to start your shift.
        </div>
      `;
      return;
    }

    records.forEach(r => {
      const proj = store.getProjectById(r.projectId);
      const start = new Date(r.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const end = new Date(r.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const duration = (r.workedMinutes / 60).toFixed(2);
      const isWfh = r.workLocation === 'wfh';

      const div = document.createElement('div');
      div.className = 'glass-card glass-card-hover';
      div.style.padding = '16px 20px';
      div.style.marginBottom = '12px';
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';
      div.style.flexWrap = 'wrap';
      div.style.gap = '12px';

      div.innerHTML = `
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <strong style="font-size: 0.95rem; color: var(--text-primary);">${proj.name}</strong>
            <span class="badge badge-working" style="font-size: 0.72rem;">${duration} hrs</span>
            <span class="badge" style="font-size: 0.72rem; background: rgba(99, 102, 241, 0.15); color: var(--accent-cyan);">
              ${isWfh ? '🏠 WFH (Home)' : '🏢 Onsite (Office)'}
            </span>
          </div>
          <div style="font-size: 0.82rem; color: var(--text-secondary); display: flex; align-items: center; gap: 12px;">
            <span><strong>IN:</strong> ${start}</span>
            <span><strong>OUT:</strong> ${end}</span>
            <span><strong>Break:</strong> ${r.breakDurationMinutes}m</span>
          </div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">Task: ${r.taskNote || 'Work session'}</div>
        </div>
        <div style="text-align: right;">
          <span class="badge badge-working" style="padding: 6px 12px; font-size: 0.8rem;">
            🟢 Shift Completed
          </span>
        </div>
      `;
      todayActivityList.appendChild(div);
    });
  }

  // Punch Action Listeners (Time IN / Break / Time OUT)
  btnClockIn.addEventListener('click', () => {
    const dev = store.getActiveDeveloper();
    const projId = terminalProjectSelect.value;
    const taskNotes = terminalTaskNotes.value.trim() || 'Development Sprint';
    const location = terminalLocationSelect.value || 'onsite';

    attendance.clockIn(dev.id, projId, taskNotes, location);
    showToast(`Time IN recorded (${location.toUpperCase()}) for ${dev.name}!`, 'success');
    renderClockTerminal();
    renderAttendanceBoard();
  });

  btnBreak.addEventListener('click', () => {
    const dev = store.getActiveDeveloper();
    if (dev.status === 'working') {
      attendance.startBreak(dev.id);
      showToast(`Break started at ${new Date().toLocaleTimeString()}`, 'warning');
    } else if (dev.status === 'break') {
      attendance.resumeWork(dev.id);
      showToast(`Break ended. Resumed shift at ${new Date().toLocaleTimeString()}`, 'success');
    }
    renderClockTerminal();
    renderAttendanceBoard();
  });

  btnClockOut.addEventListener('click', () => {
    const dev = store.getActiveDeveloper();
    if (confirm(`Time OUT (Clock Out) for ${dev.name} and finalize today's DTR record?`)) {
      const savedRecord = attendance.clockOut(dev.id);
      if (savedRecord) {
        showToast(`Time OUT recorded! Logged ${(savedRecord.workedMinutes / 60).toFixed(2)} hrs`, 'success');
      }
      renderClockTerminal();
      renderAttendanceBoard();
      renderTimesheetsAndPayroll();
    }
  });

  // Master Render
  function renderAll() {
    renderProjectDropdowns();
    populatePayrollDevFilter();
    renderClockTerminal();
    renderAttendanceBoard();
    renderLeavesAndRequests();
    renderTimesheetsAndPayroll();
    renderSettings();
    updateHeaderAuthProfile();
  }

  terminalProjectSelect.addEventListener('change', () => {
    const dev = store.getActiveDeveloper();
    if (dev.status === 'working' || dev.status === 'break') {
      attendance.updateSessionContext(dev.id, terminalProjectSelect.value, terminalTaskNotes.value, terminalLocationSelect.value);
    }
  });

  terminalLocationSelect.addEventListener('change', () => {
    const dev = store.getActiveDeveloper();
    if (dev.status === 'working' || dev.status === 'break') {
      attendance.updateSessionContext(dev.id, terminalProjectSelect.value, terminalTaskNotes.value, terminalLocationSelect.value);
      showToast(`Updated location to ${terminalLocationSelect.value === 'wfh' ? 'Work From Home' : 'Onsite Office'}`, 'info');
      renderAttendanceBoard();
    }
  });

  terminalTaskNotes.addEventListener('input', () => {
    const dev = store.getActiveDeveloper();
    if (dev.status === 'working' || dev.status === 'break') {
      attendance.updateSessionContext(dev.id, terminalProjectSelect.value, terminalTaskNotes.value, terminalLocationSelect.value);
    }
  });

  // Real-time calculation updater
  window.addEventListener('devtrack:timerTick', (e) => {
    const { activeDev, liveStats } = e.detail;
    if (activeDev.status === 'working' || activeDev.status === 'break') {
      const renderedHrs = (liveStats.netMinutesWorked / 60).toFixed(2);
      dtrTotalRendered.textContent = `${renderedHrs} hrs`;
      dtrBreakTime.textContent = `${liveStats.totalBreakMinutes}m`;
      dtrShiftStatus.textContent = activeDev.status === 'working' ? '🟢 Present (Working)' : '🟡 On Scheduled Break';
    }
  });

  // ==========================================
  // 5. Live Attendance Board View (Rates are Hidden from Team)
  // ==========================================
  function renderAttendanceBoard() {
    const state = store.getState();
    attendanceGrid.innerHTML = '';

    let onlineCount = 0;
    let todayTotalMinutes = 0;
    let todayTotalGross = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    state.attendanceRecords.filter(r => r.date === todayStr).forEach(r => {
      todayTotalMinutes += (r.workedMinutes || 0);
      todayTotalGross += (r.totalEarnings || 0);
    });

    state.developers.forEach(dev => {
      if (dev.status === 'working' || dev.status === 'break') {
        onlineCount++;
      }

      const liveStats = attendance.calculateLiveStats(dev);
      todayTotalMinutes += liveStats.netMinutesWorked;
      todayTotalGross += liveStats.currentEarnings;

      const card = document.createElement('div');
      card.className = 'glass-card glass-card-hover attendance-card';

      let statusBadgeHtml = '';
      if (dev.status === 'working') {
        statusBadgeHtml = `<span class="badge badge-working"><span class="badge-dot"></span> Working</span>`;
      } else if (dev.status === 'break') {
        statusBadgeHtml = `<span class="badge badge-break"><span class="badge-dot"></span> Break</span>`;
      } else {
        statusBadgeHtml = `<span class="badge badge-offline"><span class="badge-dot"></span> Offline</span>`;
      }

      const currentProj = dev.activeSession ? store.getProjectById(dev.activeSession.projectId).name : 'Idle';
      const currentTask = dev.activeSession ? (dev.activeSession.taskNote || 'Working') : 'Not clocked in';
      const isWfh = (dev.activeSession && dev.activeSession.workLocation === 'wfh');
      const locationPill = dev.activeSession 
        ? `<span class="badge" style="background: rgba(99, 102, 241, 0.15); color: var(--accent-cyan); font-size: 0.72rem;">${isWfh ? '🏠 WFH' : '🏢 Onsite'}</span>`
        : '';

      card.innerHTML = `
        <div class="attendance-card-header">
          <div class="attendance-user-info">
            <div class="attendance-user-avatar" style="background: ${dev.avatarColor};">
              ${dev.initials}
              <div class="online-indicator ${dev.status}"></div>
            </div>
            <div>
              <div style="font-weight: 700; color: var(--text-primary); font-size: 0.98rem; display: flex; align-items: center; gap: 6px;">
                ${dev.name} ${locationPill}
              </div>
              <div style="font-size: 0.8rem; color: var(--text-secondary);">${dev.role}</div>
            </div>
          </div>
          ${statusBadgeHtml}
        </div>

        <div class="attendance-details-list">
          <div class="attendance-detail-row">
            <span class="attendance-detail-label">Current Project:</span>
            <span class="attendance-detail-value" style="font-family: var(--font-sans); font-size: 0.82rem; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 150px;">
              ${currentProj}
            </span>
          </div>
          <div class="attendance-detail-row">
            <span class="attendance-detail-label">Active Session:</span>
            <span class="attendance-detail-value" style="color: var(--accent-cyan);">${liveStats.formattedTime}</span>
          </div>
          <div class="attendance-detail-row">
            <span class="attendance-detail-label">Status:</span>
            <span class="attendance-detail-value" style="color: var(--text-secondary); font-size: 0.82rem;">Active Today</span>
          </div>
        </div>

        <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${currentTask}</span>
        </div>
      `;

      attendanceGrid.appendChild(card);
    });

    statOnlineDevs.textContent = `${onlineCount} / ${state.developers.length}`;
    statTodayHours.textContent = `${(todayTotalMinutes / 60).toFixed(1)} hrs`;
    statTodayPayroll.textContent = store.isAdmin() ? `$${todayTotalGross.toFixed(2)}` : '••••••';
  }

  // ==========================================
  // 6. Real-Time USD ⇄ PHP Forex Exchange Engine
  // ==========================================
  async function fetchLiveExchangeRate(showNotification = false) {
    try {
      if (exchangeSourceBadge) {
        exchangeSourceBadge.textContent = '⏳ Fetching...';
      }
      const response = await fetch('https://open.er-api.com/v6/latest/USD', { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const data = await response.json();

      if (data && data.rates && data.rates.PHP) {
        const phpRate = parseFloat(data.rates.PHP);
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        store.setUsdToPhpRate(phpRate, timeStr);
        updateForexUI(phpRate, timeStr, true);
        if (showNotification) {
          showToast(`Forex rate updated: 1 USD = ₱${phpRate.toFixed(2)} PHP`, 'success');
        }
        renderTimesheetsAndPayroll();
        return;
      }
    } catch (err) {
      console.warn('Live forex fetch failed, using stored/fallback rate:', err);
      const currentRate = store.getUsdToPhpRate();
      updateForexUI(currentRate, 'Fallback / Manual', false);
      if (showNotification) {
        showToast(`Using stored exchange rate: 1 USD = ₱${currentRate.toFixed(2)} PHP`, 'info');
      }
    }
  }

  function updateForexUI(rate, updateTime = null, isLive = true) {
    const formatted = parseFloat(rate).toFixed(2);
    if (exchangeRateDisplay) {
      exchangeRateDisplay.textContent = `$1.00 USD = ₱${formatted} PHP`;
    }
    if (exchangeSourceBadge) {
      exchangeSourceBadge.textContent = isLive ? '🟢 Live Forex' : '⚙️ Custom Rate';
      exchangeSourceBadge.className = isLive ? 'badge badge-working' : 'badge badge-break';
    }
    if (exchangeLastUpdated) {
      const state = store.getState();
      const time = updateTime || state.lastRateUpdate || 'Recent';
      exchangeLastUpdated.textContent = isLive ? `Live Forex synced at ${time}` : `Manual rate applied (₱${formatted}/$)`;
    }
    if (bottomActiveRateBadge) {
      bottomActiveRateBadge.textContent = `Conversion Rate: 1 USD = ₱${formatted} PHP`;
    }
  }

  if (btnRefreshExchangeRate) {
    btnRefreshExchangeRate.addEventListener('click', () => {
      fetchLiveExchangeRate(true);
    });
  }

  if (btnCustomExchangeRate) {
    btnCustomExchangeRate.addEventListener('click', () => {
      inputCustomRate.value = store.getUsdToPhpRate().toFixed(2);
      modalCustomRate.classList.add('active');
      inputCustomRate.focus();
    });
  }

  if (btnCloseCustomRate && btnCancelCustomRate) {
    [btnCloseCustomRate, btnCancelCustomRate].forEach(b => b.addEventListener('click', () => {
      modalCustomRate.classList.remove('active');
    }));
  }

  if (btnFetchLiveForex) {
    btnFetchLiveForex.addEventListener('click', async () => {
      await fetchLiveExchangeRate(true);
      inputCustomRate.value = store.getUsdToPhpRate().toFixed(2);
    });
  }

  if (btnDefaultForex) {
    btnDefaultForex.addEventListener('click', () => {
      inputCustomRate.value = '58.50';
    });
  }

  if (formCustomRate) {
    formCustomRate.addEventListener('submit', (e) => {
      e.preventDefault();
      const newRate = parseFloat(inputCustomRate.value);
      if (isNaN(newRate) || newRate <= 0) {
        showToast('Please enter a valid exchange rate', 'error');
        return;
      }
      store.setUsdToPhpRate(newRate, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      updateForexUI(newRate, 'Custom Manual', false);
      modalCustomRate.classList.remove('active');
      showToast(`Applied custom conversion rate: ₱${newRate.toFixed(2)}/USD`, 'success');
      renderTimesheetsAndPayroll();
    });
  }

  // ==========================================
  // 7. Timesheet & Payroll Analytics View (Dual Currency USD & PHP)
  // ==========================================
  let currentFilteredRecords = [];

  function renderTimesheetsAndPayroll() {
    const rangeType = payrollDateFilter.value;
    const auth = store.getAuth();
    // Non-admin developers ONLY see their own records!
    const devFilter = store.isAdmin() ? payrollDevFilter.value : auth.devId;
    const projFilter = payrollProjectFilter.value;
    const start = customStartDate.value;
    const end = customEndDate.value;
    const rate = store.getUsdToPhpRate();

    currentFilteredRecords = payroll.filterRecords(rangeType, devFilter, projFilter, start, end);
    const summary = payroll.generateSummary(currentFilteredRecords);

    // Format Top Metric Cards
    summaryTotalHours.textContent = `${summary.totalHours} hrs`;
    const weekRecords = payroll.filterRecords('week', devFilter, projFilter);
    const weekSummary = payroll.generateSummary(weekRecords);
    const weekHours = parseFloat(weekSummary.totalHours) || 0;
    const hoursSub = document.getElementById('summary-hours-subtitle');
    if (hoursSub) {
      if (rangeType === 'week') {
        if (weekHours < 35) {
          hoursSub.innerHTML = `<span style="color: #f59e0b; font-weight: 700;">${(35 - weekHours).toFixed(1)} hrs to 35h min</span> • Cap: 45h`;
        } else if (weekHours <= 45) {
          hoursSub.innerHTML = `<span style="color: var(--status-working); font-weight: 700;">✅ 35h min reached</span> (${(45 - weekHours).toFixed(1)}h to 45h max)`;
        } else {
          hoursSub.innerHTML = `<span style="color: #ef4444; font-weight: 700;">⚠️ Max 45h/wk reached (${weekHours}h)</span>`;
        }
      } else {
        hoursSub.textContent = `Target: 35h min – 45h max/week (Sat Optional)`;
      }
    }
    if (store.isAdmin()) {
      summaryTotalPayroll.textContent = `$${parseFloat(summary.totalGrossPay).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      summaryTotalPayrollPhp.textContent = `≈ ₱${parseFloat(summary.totalGrossPhp).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PHP`;
      summaryAvgRate.textContent = `$${parseFloat(summary.avgHourlyPay).toFixed(2)}/hr`;
      summaryAvgRatePhp.textContent = `≈ ₱${parseFloat(summary.avgHourlyPhp).toFixed(2)}/hr`;
    } else {
      summaryTotalPayroll.textContent = 'Confidential 🔒';
      summaryTotalPayrollPhp.textContent = 'Log in as Admin to view';
      summaryAvgRate.textContent = 'Confidential 🔒';
      summaryAvgRatePhp.textContent = '••••';
    }
    summaryTotalSessions.textContent = summary.totalRecords;

    // Hide dev selector for regular developers
    payrollDevFilter.style.display = store.isAdmin() ? 'block' : 'none';

    // Render Table Rows
    timesheetTableBody.innerHTML = '';
    if (currentFilteredRecords.length === 0) {
      timesheetTableBody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; color: var(--text-muted); padding: 32px;">
            No timesheet records found for the selected filter criteria.
          </td>
        </tr>
      `;
    } else {
      currentFilteredRecords.forEach(rec => {
        const dev = store.getDeveloperById(rec.developerId) || { name: 'Unknown', avatarColor: '#6366f1', initials: '?' };
        const proj = store.getProjectById(rec.projectId);
        const startT = rec.startTime ? new Date(rec.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
        const endT = rec.endTime ? new Date(rec.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
        const hours = ((rec.workedMinutes || 0) / 60).toFixed(2);
        const isWfh = rec.workLocation === 'wfh';

        const rateUsdVal = (rec.hourlyRate || 0);
        const grossUsdVal = (rec.totalEarnings || 0);
        const ratePhpVal = (rateUsdVal * rate);
        const grossPhpVal = (grossUsdVal * rate);

        const rateDisplay = store.isAdmin() 
          ? `<span>$${rateUsdVal.toFixed(2)}</span><span class="php-subtext">≈ ₱${ratePhpVal.toFixed(2)}</span>`
          : '<span class="confidential-pill">••••</span>';

        const payDisplay = store.isAdmin()
          ? `<span style="color: var(--status-working); font-weight: 700;">$${grossUsdVal.toFixed(2)}</span><span class="php-subtext" style="color: var(--status-working);">≈ ₱${grossPhpVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>`
          : '<span class="confidential-pill">Confidential</span>';

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 28px; height: 28px; border-radius: 50%; background: ${dev.avatarColor}; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: white;">
                ${dev.initials}
              </div>
              <div>
                <strong>${dev.name}</strong>
              </div>
            </div>
          </td>
          <td class="font-mono">${rec.date}</td>
          <td>
            <span class="badge" style="background: ${isWfh ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.15)'}; color: ${isWfh ? 'var(--accent-cyan)' : 'var(--status-working)'}; font-size: 0.72rem;">
              ${isWfh ? '🏠 WFH' : '🏢 Onsite'}
            </span>
          </td>
          <td>
            <span class="badge badge-working" style="background: rgba(99, 102, 241, 0.15); color: #818cf8; border-color: rgba(99, 102, 241, 0.3);">
              ${proj.name}
            </span>
          </td>
          <td class="font-mono">${startT} - ${endT}</td>
          <td class="font-mono">${rec.breakDurationMinutes || 0}m</td>
          <td class="font-mono" style="font-weight: 700; color: var(--text-primary);">${hours} hrs</td>
          <td class="font-mono">${rateDisplay}</td>
          <td class="font-mono">${payDisplay}</td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.72rem; color: var(--accent-cyan);" onclick="generateSinglePayslip('${rec.developerId}', '${rec.id}')" title="Generate and print payslip for this entry">
                📄 Slip
              </button>
              <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.72rem; color: var(--status-danger);" onclick="deleteTimesheetRecord('${rec.id}')" title="Delete record">
                🗑️
              </button>
            </div>
          </td>
        `;
        timesheetTableBody.appendChild(tr);
      });
    }

    // Render Bottom Real-Time Computation & PHP Summary Card
    if (bottomConversionCard) {
      if (store.isAdmin()) {
        bottomUsdTotal.textContent = `$${parseFloat(summary.totalGrossPay).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        bottomPhpTotal.textContent = `₱${parseFloat(summary.totalGrossPhp).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        bottomPhpAvgRate.textContent = `₱${parseFloat(summary.avgHourlyPhp).toFixed(2)} / hr`;
        bottomHoursCount.textContent = `${summary.totalHours} billable hours rendered`;

        // Render Developer-by-Developer Converted Breakdown Grid
        bottomDevBreakdownGrid.innerHTML = '';
        if (summary.byDeveloper.length === 0) {
          bottomDevBreakdownGrid.innerHTML = `<div style="grid-column: span 4; color: var(--text-muted); font-size: 0.82rem;">No developer records to compute.</div>`;
        } else {
          summary.byDeveloper.forEach(item => {
            const dev = item.developer;
            const card = document.createElement('div');
            card.className = 'glass-card';
            card.style.padding = '14px 16px';
            card.style.borderRadius = 'var(--radius-md)';
            card.innerHTML = `
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: ${dev.avatarColor || '#6366f1'}; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; color: white;">
                    ${dev.initials || 'DV'}
                  </div>
                  <strong style="font-size: 0.88rem; color: var(--text-primary); text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${dev.name}</strong>
                </div>
                <button class="btn btn-secondary" style="padding: 3px 8px; font-size: 0.72rem; color: var(--accent-cyan);" onclick="openPayslipModal('${dev.id}')" title="Run official payslip for ${dev.name}">
                  📄 Slip
                </button>
              </div>
              <div style="font-size: 0.76rem; color: var(--text-secondary);">${item.hoursWorked} hrs • ${item.sessionCount} session(s)</div>
              <div style="margin-top: 6px; display: flex; justify-content: space-between; align-items: baseline;">
                <span style="font-family: var(--font-mono); font-weight: 700; color: var(--text-primary); font-size: 0.92rem;">$${item.totalEarnings.toFixed(2)}</span>
                <span style="font-family: var(--font-mono); font-weight: 800; color: var(--status-working); font-size: 0.95rem;">₱${parseFloat(item.totalEarningsPhp).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            `;
            bottomDevBreakdownGrid.appendChild(card);
          });
        }
      } else {
        bottomUsdTotal.textContent = 'Confidential 🔒';
        bottomPhpTotal.textContent = 'Confidential 🔒';
        bottomPhpAvgRate.textContent = '••••';
        bottomHoursCount.textContent = `${summary.totalHours} billable hours rendered`;
        bottomDevBreakdownGrid.innerHTML = `
          <div style="grid-column: span 4; text-align: center; color: var(--text-muted); padding: 12px; font-size: 0.85rem;">
            🔒 Financial conversions and team wage summaries are restricted to Administrator PIN.
          </div>
        `;
      }
    }
  }

  function populatePayrollDevFilter() {
    const devs = store.getState().developers;
    const quickDevSelect = document.getElementById('quick-payslip-dev-select');
    
    if (payrollDevFilter) {
      payrollDevFilter.innerHTML = '<option value="all">All Developers (Team)</option>';
      devs.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = `${d.name} (${d.role.split(' ')[0]})`;
        payrollDevFilter.appendChild(opt);
      });
    }

    if (quickDevSelect) {
      quickDevSelect.innerHTML = '';
      devs.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = `👤 ${d.name} (${d.role})`;
        quickDevSelect.appendChild(opt);
      });
    }
  }

  const btnQuickRunPayslip = document.getElementById('btn-quick-run-payslip');
  if (btnQuickRunPayslip) {
    btnQuickRunPayslip.addEventListener('click', () => {
      const select = document.getElementById('quick-payslip-dev-select');
      const devId = select ? select.value : null;
      window.openPayslipModal(devId);
    });
  }

  payrollDateFilter.addEventListener('change', () => {
    if (payrollDateFilter.value === 'custom') {
      customDateRangeContainer.style.display = 'flex';
    } else {
      customDateRangeContainer.style.display = 'none';
    }
    renderTimesheetsAndPayroll();
  });

  payrollDevFilter.addEventListener('change', renderTimesheetsAndPayroll);
  payrollProjectFilter.addEventListener('change', renderTimesheetsAndPayroll);
  customStartDate.addEventListener('change', renderTimesheetsAndPayroll);
  customEndDate.addEventListener('change', renderTimesheetsAndPayroll);

  window.deleteTimesheetRecord = function(recordId) {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      store.deleteAttendanceRecord(recordId);
      showToast('Attendance record deleted', 'info');
      renderTimesheetsAndPayroll();
    }
  };

  btnExportCsv.addEventListener('click', () => {
    exporter.exportToCSV(currentFilteredRecords);
    showToast('Exported timesheet records with USD & PHP conversions to CSV', 'success');
  });

  // ==========================================
  // 8. Official Payslip Generator & Print Controller
  // ==========================================
  window.openPayslipModal = function(targetDevId = null, targetRecordId = null) {
    const state = store.getState();
    const rate = store.getUsdToPhpRate();
    const auth = store.getAuth();
    
    // Choose developer: explicit target or active filter or current logged dev
    let devId = targetDevId;
    if (!devId) {
      devId = (store.isAdmin() && payrollDevFilter.value !== 'all') ? payrollDevFilter.value : auth.devId || state.activeDeveloperId;
    }

    const dev = store.getDeveloperById(devId) || state.developers[0];
    let records = currentFilteredRecords.filter(r => r.developerId === dev.id);

    if (targetRecordId) {
      records = currentFilteredRecords.filter(r => r.id === targetRecordId);
    }

    if (records.length === 0) {
      // Fallback to all records of dev if filtered subset is empty
      records = state.attendanceRecords.filter(r => r.developerId === dev.id);
    }

    let totalMinutes = 0;
    let totalGrossUsd = 0;
    const projectBreakdown = {};

    records.forEach(r => {
      totalMinutes += (r.workedMinutes || 0);
      totalGrossUsd += (r.totalEarnings || 0);
      const pName = store.getProjectById(r.projectId).name;
      if (!projectBreakdown[pName]) {
        projectBreakdown[pName] = { hours: 0, usd: 0, rateUsd: r.hourlyRate || dev.hourlyRate };
      }
      projectBreakdown[pName].hours += (r.workedMinutes / 60);
      projectBreakdown[pName].usd += (r.totalEarnings || 0);
    });

    const totalGrossPhp = totalGrossUsd * rate;
    const totalHours = (totalMinutes / 60).toFixed(2);
    const dateRangeLabel = payrollDateFilter.options[payrollDateFilter.selectedIndex]?.text || 'Current Period';

    // Populate Payslip Modal fields
    payslipEmpName.textContent = dev.name;
    payslipEmpRole.textContent = `${dev.role} (${dev.email || 'Diverse Ideas Remote'})`;
    payslipPeriodDates.textContent = `${dateRangeLabel} • ${records.length} Work Session(s)`;
    payslipRateApplied.textContent = `$1.00 USD = ₱${rate.toFixed(2)} PHP`;
    payslipVoucherNo.textContent = `VOUCHER #DIV-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

    // Populate and bind Employee Selector in Modal for Admin
    const payslipSelectDev = document.getElementById('payslip-select-dev');
    if (payslipSelectDev) {
      payslipSelectDev.innerHTML = '';
      state.developers.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = `${d.name} — ${d.role}`;
        if (d.id === dev.id) opt.selected = true;
        payslipSelectDev.appendChild(opt);
      });
      payslipSelectDev.onchange = (e) => {
        window.openPayslipModal(e.target.value);
      };
      // Only show selector for Admin
      const controlsBar = document.getElementById('payslip-modal-controls');
      if (controlsBar) {
        controlsBar.style.display = store.isAdmin() ? 'flex' : 'none';
      }
    }

    // Populate rows
    payslipBreakdownRows.innerHTML = '';
    const projKeys = Object.keys(projectBreakdown);
    if (projKeys.length === 0) {
      payslipBreakdownRows.innerHTML = `
        <tr>
          <td>Standard Development Services</td>
          <td style="text-align: center;">0.00 hrs</td>
          <td style="text-align: right;">$${dev.hourlyRate.toFixed(2)}</td>
          <td style="text-align: right;">₱${(dev.hourlyRate * rate).toFixed(2)}</td>
          <td style="text-align: right;">$0.00</td>
          <td style="text-align: right;">₱0.00</td>
        </tr>
      `;
    } else {
      projKeys.forEach(pName => {
        const item = projectBreakdown[pName];
        const phpEarned = item.usd * rate;
        const phpRate = item.rateUsd * rate;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${pName}</strong> - Software Engineering</td>
          <td style="text-align: center;">${item.hours.toFixed(2)} hrs</td>
          <td style="text-align: right;">$${item.rateUsd.toFixed(2)}</td>
          <td style="text-align: right;">₱${phpRate.toFixed(2)}</td>
          <td style="text-align: right; font-weight: 700;">$${item.usd.toFixed(2)}</td>
          <td style="text-align: right; font-weight: 700; color: var(--status-working);">₱${phpEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        </tr>
        `;
        payslipBreakdownRows.appendChild(tr);
      });
    }

    payslipNetUsd.textContent = `$${totalGrossUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
    payslipNetPhp.textContent = `≈ ₱${totalGrossPhp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PHP`;

    const hourlyRateVal = parseFloat(dev.hourlyRate) || 0;
    const hourlyPhpVal = (hourlyRateVal * rate).toFixed(2);

    const elTotalHours = document.getElementById('payslip-total-hours');
    if (elTotalHours) elTotalHours.textContent = `${totalHours} hrs`;

    const elRateBadge = document.getElementById('payslip-rate-badge');
    if (elRateBadge) elRateBadge.textContent = `$${hourlyRateVal.toFixed(2)} / hr (≈ ₱${hourlyPhpVal} / hr)`;

    const elFootHours = document.getElementById('payslip-foot-total-hours');
    if (elFootHours) elFootHours.textContent = `${totalHours} hrs`;

    const elFootUsd = document.getElementById('payslip-foot-total-usd');
    if (elFootUsd) elFootUsd.textContent = `$${totalGrossUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const elFootPhp = document.getElementById('payslip-foot-total-php');
    if (elFootPhp) elFootPhp.textContent = `₱${totalGrossPhp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const elNetHours = document.getElementById('payslip-net-hours-badge');
    if (elNetHours) elNetHours.textContent = totalHours;

    const elNetFormula = document.getElementById('payslip-net-calc-formula');
    if (elNetFormula) {
      elNetFormula.textContent = `Auto-computed: ${totalHours} hrs rendered × $${hourlyRateVal.toFixed(2)}/hr = $${totalGrossUsd.toFixed(2)} USD (≈ ₱${totalGrossPhp.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PHP @ ₱${rate.toFixed(2)}/$)`;
    }

    modalPayslipPreview.classList.add('active');
  };

  window.generateSinglePayslip = function(devId, recordId) {
    window.openPayslipModal(devId, recordId);
  };

  btnPrintReport.addEventListener('click', () => {
    window.openPayslipModal();
  });

  if (btnClosePayslip) {
    btnClosePayslip.addEventListener('click', () => modalPayslipPreview.classList.remove('active'));
  }
  if (btnClosePayslipFooter) {
    btnClosePayslipFooter.addEventListener('click', () => modalPayslipPreview.classList.remove('active'));
  }
  if (btnPrintPayslipDirect) {
    btnPrintPayslipDirect.addEventListener('click', () => {
      window.print();
    });
  }

  window.addEventListener('beforeprint', () => {
    if (!modalPayslipPreview.classList.contains('active')) {
      window.openPayslipModal();
    }
  });

  // ==========================================
  // 7. Enterprise Settings View (Jibble Suite Style)
  // ==========================================
  function initSettingsSubtabs() {
    const subtabBtns = document.querySelectorAll('.settings-subtab-btn');
    const subpanes = document.querySelectorAll('.settings-subpane');

    subtabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-subtab');
        subtabBtns.forEach(b => b.classList.remove('active'));
        subpanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');
      });
    });
  }

  function renderOrganizationSettings() {
    const org = store.getOrganization();
    const nameEl = document.getElementById('setting-org-name');
    const indEl = document.getElementById('setting-org-industry');
    const addrEl = document.getElementById('setting-org-address');
    const taxEl = document.getElementById('setting-org-tax');
    const prefixEl = document.getElementById('setting-org-prefix');

    if (nameEl) nameEl.value = org.companyName || 'Diverse Ideas GMBH';
    if (indEl) indEl.value = org.industry || '';
    if (addrEl) addrEl.value = org.address || '';
    if (taxEl) taxEl.value = org.taxId || '';
    if (prefixEl) prefixEl.value = org.voucherPrefix || 'DIV';
  }

  const formSettingsOrg = document.getElementById('form-settings-org');
  if (formSettingsOrg) {
    formSettingsOrg.addEventListener('submit', (e) => {
      e.preventDefault();
      const companyName = document.getElementById('setting-org-name').value.trim();
      const industry = document.getElementById('setting-org-industry').value.trim();
      const address = document.getElementById('setting-org-address').value.trim();
      const taxId = document.getElementById('setting-org-tax').value.trim();
      const voucherPrefix = document.getElementById('setting-org-prefix').value.trim().toUpperCase() || 'DIV';

      store.updateOrganization({ companyName, industry, address, taxId, voucherPrefix });
      showToast('Organization profile saved successfully!', 'success');
      renderAll();
    });
  }

  function renderScheduleSettings() {
    const sched = store.getWorkSchedules();
    const startEl = document.getElementById('setting-shift-start');
    const endEl = document.getElementById('setting-shift-end');
    const wfhEl = document.getElementById('setting-wfh-days');
    const graceEl = document.getElementById('setting-grace-mins');
    const minHoursEl = document.getElementById('setting-min-hours');
    const maxHoursEl = document.getElementById('setting-max-hours');
    const satPolicyEl = document.getElementById('setting-saturday-policy');

    if (startEl) startEl.value = sched.shiftStart || '09:00';
    if (endEl) endEl.value = sched.shiftEnd || '17:00';
    if (wfhEl) wfhEl.value = Array.isArray(sched.wfhDays) ? sched.wfhDays.join(', ') : (sched.wfhDays || 'Monday');
    if (graceEl) graceEl.value = sched.gracePeriodMins || 15;
    if (minHoursEl) minHoursEl.value = sched.minWeeklyHours || 35;
    if (maxHoursEl) maxHoursEl.value = sched.maxWeeklyHours || 45;
    if (satPolicyEl) satPolicyEl.value = sched.saturdayPolicy || 'Optional / Rest Day (Walay pugsanay)';

    // Update greeting weekday text & shift pill
    const greetingWeekdayText = document.getElementById('greeting-weekday-text');
    if (greetingWeekdayText) {
      greetingWeekdayText.textContent = `Official Shift: 09:00 AM – 05:00 PM (WFH Mondays • 35h min / 45h max)`;
    }
    const terminalShiftText = document.getElementById('terminal-shift-schedule-text');
    if (terminalShiftText) {
      terminalShiftText.textContent = `Shift Schedule: 09:00 AM – 05:00 PM`;
    }
  }

  const formSettingsSchedules = document.getElementById('form-settings-schedules');
  if (formSettingsSchedules) {
    formSettingsSchedules.addEventListener('submit', (e) => {
      e.preventDefault();
      const shiftStart = document.getElementById('setting-shift-start').value;
      const shiftEnd = document.getElementById('setting-shift-end').value;
      const rawWfh = document.getElementById('setting-wfh-days').value;
      const wfhDays = rawWfh.split(',').map(s => s.trim()).filter(Boolean);
      const gracePeriodMins = parseInt(document.getElementById('setting-grace-mins').value) || 15;
      const minWeeklyHours = parseFloat(document.getElementById('setting-min-hours').value) || 35;
      const maxWeeklyHours = parseFloat(document.getElementById('setting-max-hours').value) || 45;

      store.updateWorkSchedules({ shiftStart, shiftEnd, wfhDays, gracePeriodMins, minWeeklyHours, maxWeeklyHours });
      showToast('Work schedule & hybrid rules updated (09:00 AM - 05:00 PM, 35h-45h target)!', 'success');
      renderAll();
    });
  }

  function renderSettings() {
    const state = store.getState();
    renderOrganizationSettings();
    renderScheduleSettings();

    settingsDevTableBody.innerHTML = '';
    state.developers.forEach(dev => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${dev.avatarColor}; display: flex; align-items: center; justify-content: center; font-weight: 700; color: white;">
              ${dev.initials}
            </div>
            <div>
              <div style="font-weight: 600;">${dev.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${dev.email}</div>
            </div>
          </div>
        </td>
        <td>${dev.role}</td>
        <td class="font-mono" style="font-weight: 700; color: var(--status-working);">
          ${dev.currencySymbol}${dev.hourlyRate.toFixed(2)} / hr (PIN: ${dev.pin})
        </td>
        <td>
          <span class="badge ${dev.status === 'working' ? 'badge-working' : (dev.status === 'break' ? 'badge-break' : 'badge-offline')}">
            ${dev.status.toUpperCase()}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.78rem;" onclick="openPayslipModal('${dev.id}')" title="Generate and print official payslip for ${dev.name}">
              📄 Run Payslip
            </button>
            <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.78rem;" onclick="editDeveloperModal('${dev.id}')" title="Edit rate, PIN, and leave credits">
              ✏️ Edit Profile
            </button>
            <button class="btn btn-danger" style="padding: 6px 10px; font-size: 0.78rem;" onclick="deleteDeveloperConfirm('${dev.id}')" title="Remove developer">
              Remove
            </button>
          </div>
        </td>
      `;
      settingsDevTableBody.appendChild(tr);
    });

    settingsProjectTableBody.innerHTML = '';
    state.projects.forEach(p => {
      const tr = document.createElement('tr');
      const isAct = p.status === 'Active';
      
      let actionButtons = '';
      if (store.isAdmin()) {
        actionButtons = `
          <div style="display: flex; gap: 6px;">
            <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 0.78rem;" onclick="openEditProjectModal('${p.id}')" title="Edit project code, name and status">
              ✏️ Edit
            </button>
            <button class="btn btn-danger" style="padding: 4px 10px; font-size: 0.78rem;" onclick="deleteProjectConfirm('${p.id}')" title="Delete project">
              🗑️ Delete
            </button>
          </div>
        `;
      } else {
        actionButtons = `<span style="font-size: 0.75rem; color: var(--text-muted);">Admin Protected</span>`;
      }

      tr.innerHTML = `
        <td><span class="badge ${isAct ? 'badge-working' : 'badge-offline'}" style="font-family: var(--font-mono); font-weight: 700;">${p.code}</span></td>
        <td>
          <div style="font-weight: 600; color: var(--text-primary);">${p.name}</div>
        </td>
        <td style="font-size: 0.82rem; color: var(--text-secondary); max-width: 250px;">${p.description || '—'}</td>
        <td>
          <span class="badge ${isAct ? 'badge-working' : 'badge-offline'}" style="font-size: 0.72rem;">
            ${isAct ? '🟢 Active' : '⚪ Archived'}
          </span>
        </td>
        <td>${actionButtons}</td>
      `;
      settingsProjectTableBody.appendChild(tr);
    });
  }

  // Edit Developer Modal Handler (Admin)
  const modalEditDev = document.getElementById('modal-edit-dev');
  const formEditDev = document.getElementById('form-edit-dev');
  const btnCloseEditDev = document.getElementById('btn-close-edit-dev');
  const btnCancelEditDev = document.getElementById('btn-cancel-edit-dev');

  window.editDeveloperModal = function(devId) {
    const dev = store.getDeveloperById(devId);
    if (!dev) return;

    document.getElementById('edit-dev-id').value = dev.id;
    document.getElementById('edit-dev-name').value = dev.name;
    document.getElementById('edit-dev-role').value = dev.role;
    document.getElementById('edit-dev-email').value = dev.email || '';
    document.getElementById('edit-dev-currency').value = dev.currencySymbol || '$';
    document.getElementById('edit-dev-rate').value = dev.hourlyRate;
    document.getElementById('edit-dev-pin').value = dev.pin || '1234';
    
    const credits = dev.leaveCredits || { vacation: 12, sick: 10, emergency: 5 };
    document.getElementById('edit-dev-vl').value = credits.vacation;
    document.getElementById('edit-dev-sl').value = credits.sick;
    document.getElementById('edit-dev-el').value = credits.emergency;

    modalEditDev.classList.add('active');
  };

  [btnCloseEditDev, btnCancelEditDev].forEach(b => b.addEventListener('click', () => {
    modalEditDev.classList.remove('active');
  }));

  formEditDev.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-dev-id').value;
    const name = document.getElementById('edit-dev-name').value.trim();
    const role = document.getElementById('edit-dev-role').value.trim();
    const email = document.getElementById('edit-dev-email').value.trim();
    const currencySymbol = document.getElementById('edit-dev-currency').value;
    const hourlyRate = parseFloat(document.getElementById('edit-dev-rate').value) || 0;
    const pin = document.getElementById('edit-dev-pin').value.trim();
    const vacation = parseInt(document.getElementById('edit-dev-vl').value) || 0;
    const sick = parseInt(document.getElementById('edit-dev-sl').value) || 0;
    const emergency = parseInt(document.getElementById('edit-dev-el').value) || 0;

    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'DV';

    store.updateDeveloper(id, {
      name,
      role,
      email,
      initials,
      currencySymbol,
      hourlyRate,
      pin,
      leaveCredits: { vacation, sick, emergency }
    });

    showToast(`Updated employee profile for ${name}!`, 'success');
    modalEditDev.classList.remove('active');
    renderAll();
  });

  window.deleteDeveloperConfirm = function(devId) {
    const dev = store.getDeveloperById(devId);
    if (confirm(`Are you sure you want to remove ${dev.name} from the team?`)) {
      store.deleteDeveloper(devId);
      showToast(`${dev.name} removed from team roster`, 'info');
      renderSettings();
    }
  };

  btnExportBackup.addEventListener('click', () => {
    exporter.exportJSONBackup();
    showToast('Database backup downloaded', 'success');
  });

  btnTriggerImport.addEventListener('click', () => {
    fileImportInput.click();
  });

  fileImportInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const success = store.importBackupJSON(evt.target.result);
      if (success) {
        showToast('Database successfully restored from backup!', 'success');
        renderAll();
      } else {
        alert('Failed to import backup. Invalid JSON schema.');
      }
    };
    reader.readAsText(file);
  });

  btnResetData.addEventListener('click', () => {
    if (confirm('Reset database back to initial default demo data?')) {
      store.resetToDefault();
      showToast('Database reset to defaults', 'info');
      renderAll();
    }
  });

  // Modals handling
  const modalAddDev = document.getElementById('modal-add-dev');
  const formAddDev = document.getElementById('form-add-dev');
  const btnCloseAddDev = document.getElementById('btn-close-add-dev');
  const btnCancelAddDev = document.getElementById('btn-cancel-add-dev');

  btnOpenAddDev.addEventListener('click', () => modalAddDev.classList.add('active'));
  [btnCloseAddDev, btnCancelAddDev].forEach(b => b.addEventListener('click', () => modalAddDev.classList.remove('active')));

  formAddDev.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('dev-name-input').value.trim();
    const role = document.getElementById('dev-role-input').value.trim();
    const hourlyRate = parseFloat(document.getElementById('dev-rate-input').value) || 25;
    const currencySymbol = document.getElementById('dev-currency-input').value;
    const email = document.getElementById('dev-email-input').value.trim();

    const dev = store.addDeveloper({ name, role, hourlyRate, currencySymbol, email });
    showToast(`Added ${name} (Default PIN: ${dev.pin})`, 'success');
    modalAddDev.classList.remove('active');
    formAddDev.reset();
    renderAll();
  });

  // Manual Entry Modal
  const modalManualEntry = document.getElementById('modal-manual-entry');
  const formManualEntry = document.getElementById('form-manual-entry');
  const manualDevSelect = document.getElementById('manual-dev-select');
  const manualProjectSelect = document.getElementById('manual-project-select');
  const btnCloseManualEntry = document.getElementById('btn-close-manual-entry');
  const btnCancelManualEntry = document.getElementById('btn-cancel-manual-entry');

  btnOpenManualEntry.addEventListener('click', () => {
    manualDevSelect.innerHTML = '';
    const auth = store.getAuth();
    const devList = store.isAdmin() ? store.getState().developers : [store.getDeveloperById(auth.devId)];

    devList.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = d.name;
      manualDevSelect.appendChild(opt);
    });

    manualProjectSelect.innerHTML = '';
    store.getProjects().forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name;
      manualProjectSelect.appendChild(opt);
    });

    document.getElementById('manual-date-input').value = new Date().toISOString().split('T')[0];
    modalManualEntry.classList.add('active');
  });

  [btnCloseManualEntry, btnCancelManualEntry].forEach(b => b.addEventListener('click', () => modalManualEntry.classList.remove('active')));

  formManualEntry.addEventListener('submit', (e) => {
    e.preventDefault();
    const devId = manualDevSelect.value;
    const dev = store.getDeveloperById(devId);
    const projId = manualProjectSelect.value;
    const location = document.getElementById('manual-location-select').value || 'onsite';
    const date = document.getElementById('manual-date-input').value;
    const hours = parseFloat(document.getElementById('manual-hours-input').value) || 0;
    const breakMins = parseInt(document.getElementById('manual-break-input').value) || 0;
    const notes = document.getElementById('manual-notes-input').value.trim() || 'Manual timesheet entry';

    const workedMinutes = Math.round(hours * 60);
    const totalEarnings = parseFloat(((hours) * dev.hourlyRate).toFixed(2));

    const rec = {
      developerId: devId,
      date,
      startTime: `${date}T09:00:00.000Z`,
      endTime: `${date}T17:00:00.000Z`,
      breakDurationMinutes: breakMins,
      workedMinutes,
      hourlyRate: dev.hourlyRate,
      currencySymbol: dev.currencySymbol,
      totalEarnings,
      projectId: projId,
      workLocation: location,
      taskNote: notes
    };

    store.addAttendanceRecord(rec);
    showToast(`Saved timesheet record for ${dev.name}`, 'success');
    modalManualEntry.classList.remove('active');
    formManualEntry.reset();
    renderTimesheetsAndPayroll();
  });

  // Project Modals (Add & Edit - Admin Only)
  const modalAddProject = document.getElementById('modal-add-project');
  const formAddProject = document.getElementById('form-add-project');
  const btnCloseAddProject = document.getElementById('btn-close-add-project');
  const btnCancelAddProject = document.getElementById('btn-cancel-add-project');

  const modalEditProject = document.getElementById('modal-edit-project');
  const formEditProject = document.getElementById('form-edit-project');
  const btnCloseEditProject = document.getElementById('btn-close-edit-project');
  const btnCancelEditProject = document.getElementById('btn-cancel-edit-project');

  if (btnOpenAddProject) {
    btnOpenAddProject.addEventListener('click', () => {
      if (!store.isAdmin()) {
        const pin = prompt('Enter Admin Master PIN (9999) to create projects:');
        if (pin !== store.getState().adminPin) {
          alert('❌ Access Denied. Admin PIN required.');
          return;
        }
        store.loginAdmin(pin);
        updateHeaderAuthProfile();
      }
      formAddProject.reset();
      modalAddProject.classList.add('active');
    });
  }

  [btnCloseAddProject, btnCancelAddProject].forEach(b => {
    if (b) b.addEventListener('click', () => modalAddProject.classList.remove('active'));
  });

  if (formAddProject) {
    formAddProject.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!store.isAdmin()) {
        alert('❌ Only Administrators can add projects.');
        return;
      }
      const name = document.getElementById('proj-name-input').value.trim();
      const code = document.getElementById('proj-code-input').value.trim().toUpperCase();
      const description = document.getElementById('proj-desc-input').value.trim();
      const status = document.getElementById('proj-status-input').value;

      if (name && code) {
        store.addProject(name, code, description, status);
        showToast(`Created project [${code}] ${name}!`, 'success');
        modalAddProject.classList.remove('active');
        formAddProject.reset();
        renderAll();
      }
    });
  }

  window.openEditProjectModal = function(projId) {
    if (!store.isAdmin()) {
      const pin = prompt('Enter Admin Master PIN (9999) to edit projects:');
      if (pin !== store.getState().adminPin) {
        alert('❌ Access Denied. Admin PIN required.');
        return;
      }
      store.loginAdmin(pin);
      updateHeaderAuthProfile();
    }

    const proj = store.getProjectById(projId);
    if (!proj) return;

    document.getElementById('edit-proj-id').value = proj.id;
    document.getElementById('edit-proj-code').value = proj.code;
    document.getElementById('edit-proj-name').value = proj.name;
    document.getElementById('edit-proj-desc').value = proj.description || '';
    document.getElementById('edit-proj-status').value = proj.status || 'Active';

    modalEditProject.classList.add('active');
  };

  [btnCloseEditProject, btnCancelEditProject].forEach(b => {
    if (b) b.addEventListener('click', () => modalEditProject.classList.remove('active'));
  });

  if (formEditProject) {
    formEditProject.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!store.isAdmin()) {
        alert('❌ Only Administrators can edit projects.');
        return;
      }
      const id = document.getElementById('edit-proj-id').value;
      const code = document.getElementById('edit-proj-code').value.trim().toUpperCase();
      const name = document.getElementById('edit-proj-name').value.trim();
      const description = document.getElementById('edit-proj-desc').value.trim();
      const status = document.getElementById('edit-proj-status').value;

      store.updateProject(id, { name, code, description, status });
      showToast(`Updated project [${code}] ${name}!`, 'success');
      modalEditProject.classList.remove('active');
      renderAll();
    });
  }

  window.deleteProjectConfirm = function(projId) {
    if (!store.isAdmin()) {
      const pin = prompt('Enter Admin Master PIN (9999) to delete projects:');
      if (pin !== store.getState().adminPin) {
        alert('❌ Access Denied. Admin PIN required.');
        return;
      }
      store.loginAdmin(pin);
      updateHeaderAuthProfile();
    }

    const proj = store.getProjectById(projId);
    if (!proj) return;

    if (confirm(`Are you sure you want to delete project [${proj.code}] ${proj.name}?`)) {
      store.deleteProject(projId);
      showToast(`Deleted project: ${proj.name}`, 'info');
      renderAll();
    }
  };

  // Toast
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg} <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => toast.remove(), 200);
    }, 3500);
  }

  // ==========================================
  // Leaves & Requests View (Sprout HR Module)
  // ==========================================
  const requestsTableBody = document.getElementById('requests-table-body');
  const holidaysGrid = document.getElementById('holidays-grid');
  const creditVl = document.getElementById('credit-vl');
  const creditSl = document.getElementById('credit-sl');
  const creditEl = document.getElementById('credit-el');
  const btnOpenFileRequest = document.getElementById('btn-open-file-request');
  const modalFileRequest = document.getElementById('modal-file-request');
  const formFileRequest = document.getElementById('form-file-request');
  const reqTypeSelect = document.getElementById('req-type-select');
  const reqSubtypeGroup = document.getElementById('req-subtype-group');
  const reqEndDateGroup = document.getElementById('req-end-date-group');
  const reqTimeGroup = document.getElementById('req-time-group');
  const btnCloseFileRequest = document.getElementById('btn-close-file-request');
  const btnCancelFileRequest = document.getElementById('btn-cancel-file-request');

  function renderLeavesAndRequests() {
    const auth = store.getAuth();
    const currentDev = store.getActiveDeveloper();

    if (currentDev && currentDev.leaveCredits) {
      creditVl.textContent = `${currentDev.leaveCredits.vacation} Days`;
      creditSl.textContent = `${currentDev.leaveCredits.sick} Days`;
      creditEl.textContent = `${currentDev.leaveCredits.emergency} Days`;
    }

    // Render Requests Table
    const requests = store.isAdmin() ? store.getRequests('all') : store.getRequests(auth.devId);
    requestsTableBody.innerHTML = '';
    
    if (requests.length === 0) {
      requestsTableBody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 28px;">
            No filed applications found. Click <strong>+ File Application</strong> above to file a Leave, COA, or Overtime request.
          </td>
        </tr>
      `;
    } else {
      requests.forEach(req => {
        const dev = store.getDeveloperById(req.developerId) || { name: 'Unknown', initials: '?' };
        const tr = document.createElement('tr');
        
        let typeBadgeClass = 'badge-working';
        if (req.type === 'COA') typeBadgeClass = 'badge-break';
        if (req.type === 'Overtime') typeBadgeClass = 'badge-working';

        let statusBadge = `<span class="badge ${req.status === 'Approved' ? 'badge-working' : (req.status === 'Pending' ? 'badge-break' : 'badge-offline')}">${req.status}</span>`;

        let actionBtns = '-';
        if (store.isAdmin() && req.status === 'Pending') {
          actionBtns = `
            <button class="btn btn-success" style="padding: 4px 8px; font-size: 0.72rem;" onclick="approveRequest('${req.id}')">Approve</button>
            <button class="btn btn-danger" style="padding: 4px 8px; font-size: 0.72rem; margin-left: 4px;" onclick="rejectRequest('${req.id}')">Reject</button>
          `;
        }

        tr.innerHTML = `
          <td>
            <div style="font-weight: 700; color: var(--text-primary);">${req.type}</div>
            <div style="font-size: 0.75rem; color: var(--text-secondary);">${req.subType}</div>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 8px;">
              <div style="width: 24px; height: 24px; border-radius: 50%; background: var(--accent-primary); display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 700; color: white;">
                ${dev.initials}
              </div>
              <span>${dev.name}</span>
            </div>
          </td>
          <td class="font-mono">${req.dateFiled}</td>
          <td class="font-mono">${req.startDate} ${req.endDate && req.endDate !== req.startDate ? 'to ' + req.endDate : (req.hours ? '(' + req.hours + ')' : '')}</td>
          <td style="max-width: 220px; font-size: 0.82rem; color: var(--text-secondary);">${req.reason}</td>
          <td>${statusBadge}</td>
          <td>${actionBtns}</td>
        `;
        requestsTableBody.appendChild(tr);
      });
    }

    // Render Philippine, CDO & Company Holidays Grid
    const holidays = store.getHolidays();
    holidaysGrid.innerHTML = '';
    holidays.forEach(h => {
      const isCDO = h.type.includes('CDO') || (h.location && h.location.includes('CDO'));
      const isCompany = h.type.includes('Company');
      const isCustom = isCDO || isCompany || h.type.includes('Special') || h.type.includes('Regional');
      
      let icon = '🇵🇭';
      let locTag = 'National';
      if (isCDO) {
        icon = '📍';
        locTag = 'Cagayan de Oro (CDO)';
      } else if (isCompany) {
        icon = '🏢';
        locTag = 'Company-Wide';
      }

      const card = document.createElement('div');
      card.className = `holiday-card ${isCustom ? 'holiday-card-custom' : ''}`;
      
      const deleteBtnHtml = (store.isAdmin() || isCustom) 
        ? `<button class="holiday-delete-btn" onclick="deleteHolidayConfirm('${h.date}', '${h.name.replace(/'/g, "\\'")}')" title="Delete holiday">🗑️</button>`
        : '';

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent-cyan); font-weight: 700;">${h.date}</span>
            <span class="badge" style="font-size: 0.65rem; background: rgba(99, 102, 241, 0.12); color: var(--accent-primary); padding: 2px 6px;">${icon} ${locTag}</span>
          </div>
          ${deleteBtnHtml}
        </div>
        <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-primary); margin: 6px 0;">${h.name}</div>
        <div style="font-size: 0.74rem; color: var(--status-working); font-weight: 600;">${h.type}</div>
      `;
      holidaysGrid.appendChild(card);
    });
  }

  window.deleteHolidayConfirm = function(date, name) {
    if (!store.isAdmin()) {
      const pin = prompt('Enter Admin Master PIN (9999) to delete holidays:');
      if (pin !== store.getState().adminPin) {
        alert('❌ Access Denied. Admin PIN required.');
        return;
      }
      store.loginAdmin(pin);
      updateHeaderAuthProfile();
    }

    if (confirm(`Remove holiday "${name}" on ${date}?`)) {
      store.deleteHoliday(date, name);
      showToast(`Removed holiday: ${name}`, 'info');
      renderLeavesAndRequests();
    }
  };

  // Holiday Modal & Presets Handlers
  const btnOpenAddHoliday = document.getElementById('btn-open-add-holiday');
  const modalAddHoliday = document.getElementById('modal-add-holiday');
  const formAddHoliday = document.getElementById('form-add-holiday');
  const btnCloseAddHoliday = document.getElementById('btn-close-add-holiday');
  const btnCancelAddHoliday = document.getElementById('btn-cancel-add-holiday');
  const holidayPresetSelect = document.getElementById('holiday-preset-select');

  if (holidayPresetSelect) {
    holidayPresetSelect.addEventListener('change', () => {
      const opt = holidayPresetSelect.options[holidayPresetSelect.selectedIndex];
      if (opt && opt.value) {
        const name = opt.getAttribute('data-name');
        const date = opt.getAttribute('data-date');
        const type = opt.getAttribute('data-type');
        const loc = opt.getAttribute('data-loc');

        if (name) document.getElementById('holiday-name-input').value = name;
        if (date) document.getElementById('holiday-date-input').value = date;
        if (type) document.getElementById('holiday-type-select').value = type;
        if (loc) document.getElementById('holiday-location-select').value = loc;
      }
    });
  }

  if (btnOpenAddHoliday) {
    btnOpenAddHoliday.addEventListener('click', () => {
      if (!store.isAdmin()) {
        const pin = prompt('Enter Admin Master PIN (9999) to add holidays:');
        if (pin !== store.getState().adminPin) {
          alert('❌ Access Denied. Admin PIN required.');
          return;
        }
        store.loginAdmin(pin);
        updateHeaderAuthProfile();
      }
      formAddHoliday.reset();
      document.getElementById('holiday-date-input').value = new Date().toISOString().split('T')[0];
      modalAddHoliday.classList.add('active');
    });
  }

  if (btnCloseAddHoliday && btnCancelAddHoliday) {
    [btnCloseAddHoliday, btnCancelAddHoliday].forEach(b => b.addEventListener('click', () => {
      modalAddHoliday.classList.remove('active');
    }));
  }

  if (formAddHoliday) {
    formAddHoliday.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!store.isAdmin()) {
        alert('❌ Only Administrators can add holidays.');
        return;
      }
      const name = document.getElementById('holiday-name-input').value.trim();
      const date = document.getElementById('holiday-date-input').value;
      const type = document.getElementById('holiday-type-select').value;
      const location = document.getElementById('holiday-location-select').value;

      if (name && date) {
        store.addHoliday({ name, date, type, location });
        showToast(`Added holiday "${name}" on ${date}!`, 'success');
        modalAddHoliday.classList.remove('active');
        formAddHoliday.reset();
        renderLeavesAndRequests();
      }
    });
  }

  window.approveRequest = function(reqId) {
    store.updateRequestStatus(reqId, 'Approved');
    showToast('Application Approved successfully!', 'success');
    renderLeavesAndRequests();
  };

  window.rejectRequest = function(reqId) {
    store.updateRequestStatus(reqId, 'Rejected');
    showToast('Application Rejected.', 'info');
    renderLeavesAndRequests();
  };

  // ==========================================
  // PayDay Sprout My Stuff & Apply Dropdown Handlers
  // ==========================================
  const btnApplyDropdownToggle = document.getElementById('btn-apply-dropdown-toggle');
  const applyMenuDropdown = document.getElementById('apply-menu-dropdown');
  const paydayRecentTimelogs = document.getElementById('payday-recent-timelogs');
  const myStuffPendingList = document.getElementById('my-stuff-pending-list');
  const greetingTodayDate = document.getElementById('greeting-today-date');

  // Toggle Apply Dropdown
  if (btnApplyDropdownToggle && applyMenuDropdown) {
    btnApplyDropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      applyMenuDropdown.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      applyMenuDropdown.classList.remove('active');
    });
  }

  // Helper to open specific Sprout Request modal
  window.openSpecificRequestModal = function(type) {
    applyMenuDropdown.classList.remove('active');
    document.getElementById('req-start-date').value = new Date().toISOString().split('T')[0];

    if (type === 'COA') {
      reqTypeSelect.value = 'COA';
      reqSubtypeGroup.style.display = 'none';
      reqEndDateGroup.style.display = 'none';
      reqTimeGroup.style.display = 'block';
      document.getElementById('req-time-input').placeholder = 'e.g. Missed Time OUT at 05:30 PM (Forgot to clock out)';
    } else if (type === 'Overtime') {
      reqTypeSelect.value = 'Overtime';
      reqSubtypeGroup.style.display = 'none';
      reqEndDateGroup.style.display = 'none';
      reqTimeGroup.style.display = 'block';
      document.getElementById('req-time-input').placeholder = 'e.g. 2.5 hours post-shift (API deployment)';
    } else {
      reqTypeSelect.value = 'Leave';
      reqSubtypeGroup.style.display = 'block';
      reqEndDateGroup.style.display = 'block';
      reqTimeGroup.style.display = 'none';
    }

    modalFileRequest.classList.add('active');
  };

  function renderPaydayWidgets() {
    const auth = store.getAuth();
    const activeDev = store.getActiveDeveloper();
    const now = new Date();

    if (greetingTodayDate) {
      greetingTodayDate.textContent = `📅 Today is ${now.getMonth() + 1}/${now.getDate()}/${String(now.getFullYear()).slice(-2)}`;
    }

    // Render Leave credits in My Stuff card
    if (activeDev && activeDev.leaveCredits) {
      const vl = document.getElementById('mystuff-credit-vl');
      const sl = document.getElementById('mystuff-credit-sl');
      const el = document.getElementById('mystuff-credit-el');
      if (vl) vl.textContent = activeDev.leaveCredits.vacation;
      if (sl) sl.textContent = activeDev.leaveCredits.sick;
      if (el) el.textContent = activeDev.leaveCredits.emergency;
    }

    // Render Recent IN / OUT logs in Attendance card (PayDay style)
    if (paydayRecentTimelogs) {
      const records = store.getState().attendanceRecords.filter(r => r.developerId === activeDev.id).slice(0, 4);
      paydayRecentTimelogs.innerHTML = '';

      if (records.length === 0) {
        paydayRecentTimelogs.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-muted); padding: 8px 0;">No attendance records yet.</div>`;
      } else {
        records.forEach(r => {
          const datePart = r.date.split('-').slice(1).join('/') + '/' + r.date.split('-')[0].slice(-2);
          const inTime = new Date(r.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const outTime = r.endTime ? new Date(r.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';

          const rowOut = document.createElement('div');
          rowOut.style.display = 'flex';
          rowOut.style.justifyContent = 'space-between';
          rowOut.style.alignItems = 'center';
          rowOut.style.fontSize = '0.84rem';
          rowOut.innerHTML = `
            <span style="color: var(--text-secondary);">${datePart}</span>
            <span style="font-weight: 700; color: #f59e0b;">OUT</span>
            <span class="font-mono">${outTime}</span>
          `;

          const rowIn = document.createElement('div');
          rowIn.style.display = 'flex';
          rowIn.style.justifyContent = 'space-between';
          rowIn.style.alignItems = 'center';
          rowIn.style.fontSize = '0.84rem';
          rowIn.innerHTML = `
            <span style="color: var(--text-secondary);">${datePart}</span>
            <span style="font-weight: 700; color: #10b981;">IN</span>
            <span class="font-mono">${inTime}</span>
          `;

          paydayRecentTimelogs.appendChild(rowOut);
          paydayRecentTimelogs.appendChild(rowIn);
        });
      }
    }

    // Render Pending Requests in My Stuff card
    if (myStuffPendingList) {
      const pending = store.getRequests(auth.devId).filter(r => r.status === 'Pending').slice(0, 2);
      myStuffPendingList.innerHTML = '';

      if (pending.length === 0) {
        myStuffPendingList.innerHTML = `<div style="font-size: 0.78rem; color: var(--text-muted);">No pending applications</div>`;
      } else {
        pending.forEach(p => {
          const div = document.createElement('div');
          div.style.display = 'flex';
          div.style.justifyContent = 'space-between';
          div.style.fontSize = '0.78rem';
          div.style.padding = '4px 0';
          div.innerHTML = `
            <span>${p.startDate.slice(5)} - ${p.type}</span>
            <span class="badge badge-break" style="font-size: 0.65rem;">Pending</span>
          `;
          myStuffPendingList.appendChild(div);
        });
      }
    }
  }

  [btnCloseFileRequest, btnCancelFileRequest].forEach(b => b.addEventListener('click', () => {
    modalFileRequest.classList.remove('active');
  }));

  reqTypeSelect.addEventListener('change', () => {
    const val = reqTypeSelect.value;
    if (val === 'Leave') {
      reqSubtypeGroup.style.display = 'block';
      reqEndDateGroup.style.display = 'block';
      reqTimeGroup.style.display = 'none';
    } else if (val === 'COA') {
      reqSubtypeGroup.style.display = 'none';
      reqEndDateGroup.style.display = 'none';
      reqTimeGroup.style.display = 'block';
      document.getElementById('req-time-input').placeholder = 'e.g. Missed Time OUT at 05:00 PM';
    } else if (val === 'Overtime') {
      reqSubtypeGroup.style.display = 'none';
      reqEndDateGroup.style.display = 'none';
      reqTimeGroup.style.display = 'block';
      document.getElementById('req-time-input').placeholder = 'e.g. 2.5 hours post-shift';
    }
  });

  formFileRequest.addEventListener('submit', (e) => {
    e.preventDefault();
    const auth = store.getAuth();
    const devId = auth.devId || store.getState().activeDeveloperId;
    const type = reqTypeSelect.value;
    const subType = (type === 'Leave') ? document.getElementById('req-subtype-select').value : type;
    const startDate = document.getElementById('req-start-date').value;
    const endDate = document.getElementById('req-end-date').value || startDate;
    const hours = document.getElementById('req-time-input').value;
    const reason = document.getElementById('req-reason-input').value.trim();

    store.addRequest({
      developerId: devId,
      type,
      subType,
      startDate,
      endDate,
      hours,
      reason
    });

    showToast(`Submitted ${type} application for approval!`, 'success');
    modalFileRequest.classList.remove('active');
    formFileRequest.reset();
    renderLeavesAndRequests();
  });

  function renderAll() {
    updateForexUI(store.getUsdToPhpRate());
    renderProjectDropdowns();
    setDefaultWorkLocation();
    renderClockTerminal();
    renderAttendanceBoard();
    populatePayrollDevFilter();
    renderTimesheetsAndPayroll();
    renderSettings();
    renderLeavesAndRequests();
    renderPaydayWidgets();
  }

  // ==========================================
  // Manager & Admin Onboarding Guide (Operations Manager Tutorial Suite)
  // ==========================================
  const modalManagerGuide = document.getElementById('modal-manager-guide');
  const btnHeaderGuide = document.getElementById('btn-header-guide');
  const btnOpenGuideModalFromSettings = document.getElementById('btn-open-guide-modal-from-settings');
  const btnCloseManagerGuide = document.getElementById('btn-close-manager-guide');
  const btnCloseManagerGuideFooter = document.getElementById('btn-close-manager-guide-footer');
  const btnCopyStaffMsg = document.getElementById('btn-copy-staff-msg');
  const btnCopyStaffMsgModal = document.getElementById('btn-copy-staff-msg-modal');

  function openManagerGuideModal() {
    if (modalManagerGuide) {
      modalManagerGuide.classList.add('active');
    }
  }

  function closeManagerGuideModal() {
    if (modalManagerGuide) {
      modalManagerGuide.classList.remove('active');
    }
  }

  if (btnHeaderGuide) {
    btnHeaderGuide.addEventListener('click', openManagerGuideModal);
  }

  if (btnOpenGuideModalFromSettings) {
    btnOpenGuideModalFromSettings.addEventListener('click', openManagerGuideModal);
  }

  if (btnCloseManagerGuide) {
    btnCloseManagerGuide.addEventListener('click', closeManagerGuideModal);
  }

  if (btnCloseManagerGuideFooter) {
    btnCloseManagerGuideFooter.addEventListener('click', closeManagerGuideModal);
  }

  const sampleStaffInvitationText = `Hi team! We are now using DevTrack for daily attendance, time off, and payroll.\n\n🌐 App URL: https://diverse-ideas-attendance.vercel.app\n🔑 Your Access PIN: [Your 4-Digit PIN]\n\nDaily Steps:\n1. Open the link on your laptop or phone.\n2. Tap your profile name and enter your 4-digit PIN.\n3. Click [Time IN] at shift start, [Break] for lunch, and [Time OUT] when finishing work.\n4. To file Leaves or missed time punches, use [📁 My Stuff -> Apply -> Certificate of Attendance (COA) / Leave].`;

  function copyInvitationText(btnElement, labelElementId) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(sampleStaffInvitationText).then(() => {
        const label = document.getElementById(labelElementId);
        if (label) {
          const originalText = label.textContent;
          label.textContent = '✅ Copied Invitation to Clipboard!';
          setTimeout(() => {
            label.textContent = originalText;
          }, 3000);
        }
        showToast('Invitation message copied to clipboard!', 'success');
      }).catch(() => {
        fallbackCopyText(sampleStaffInvitationText);
      });
    } else {
      fallbackCopyText(sampleStaffInvitationText);
    }
  }

  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast('Invitation message copied to clipboard!', 'success');
    } catch (err) {
      alert('Please manually copy the text from the screen.');
    }
    document.body.removeChild(textarea);
  }

  if (btnCopyStaffMsg) {
    btnCopyStaffMsg.addEventListener('click', () => copyInvitationText(btnCopyStaffMsg, 'btn-copy-staff-msg-label'));
  }

  if (btnCopyStaffMsgModal) {
    btnCopyStaffMsgModal.addEventListener('click', () => copyInvitationText(btnCopyStaffMsgModal, 'btn-copy-staff-msg-modal-label'));
  }

  initHeaderClock();
  initSettingsSubtabs();
  checkAuth();
  renderAll();
  fetchLiveExchangeRate(false);
});

