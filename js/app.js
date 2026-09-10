/**
 * DevTrack - Main Application Controller
 * Manages UI rendering, events, tab navigation, modals, and toasts.
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
  const headerUserSelect = document.getElementById('header-user-select');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');

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
  const terminalProjectSelect = document.getElementById('terminal-project-select');
  const terminalTaskNotes = document.getElementById('terminal-task-notes');
  const btnClockIn = document.getElementById('btn-clock-in');
  const btnBreak = document.getElementById('btn-break');
  const btnClockOut = document.getElementById('btn-clock-out');
  const todayActivityList = document.getElementById('today-activity-list');

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
  const summaryTotalSessions = document.getElementById('summary-total-sessions');
  const summaryAvgRate = document.getElementById('summary-avg-rate');
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnPrintReport = document.getElementById('btn-print-report');
  const btnOpenManualEntry = document.getElementById('btn-open-manual-entry');

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
  // 1. Theme & Clock Header
  // ==========================================
  function initHeaderClock() {
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
      headerLiveTime.textContent = now.toLocaleDateString('en-US', options);
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  // Theme Toggle
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggleBtn.innerHTML = newTheme === 'light' 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
    showToast(`Switched to ${newTheme.toUpperCase()} mode`, 'info');
  });

  // ==========================================
  // 2. Navigation Tabs
  // ==========================================
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPaneId = tab.getAttribute('data-tab');
      navTabs.forEach(t => t.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPane = document.getElementById(targetPaneId);
      if (targetPane) targetPane.classList.add('active');

      // Refresh specific views when visited
      if (targetPaneId === 'tab-attendance') renderAttendanceBoard();
      if (targetPaneId === 'tab-payroll') renderTimesheetsAndPayroll();
      if (targetPaneId === 'tab-settings') renderSettings();
    });
  });

  // ==========================================
  // 3. User Switcher Dropdown
  // ==========================================
  function renderUserSelector() {
    const state = store.getState();
    headerUserSelect.innerHTML = '';
    state.developers.forEach(dev => {
      const opt = document.createElement('option');
      opt.value = dev.id;
      opt.textContent = `${dev.name} (${dev.currencySymbol}${dev.hourlyRate}/hr)`;
      if (dev.id === state.activeDeveloperId) opt.selected = true;
      headerUserSelect.appendChild(opt);
    });
  }

  headerUserSelect.addEventListener('change', (e) => {
    store.setActiveDeveloper(e.target.value);
    const dev = store.getActiveDeveloper();
    showToast(`Switched active developer to ${dev.name}`, 'info');
    renderClockTerminal();
  });

  // ==========================================
  // 4. Clock Terminal View
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

  const terminalLocationSelect = document.getElementById('terminal-location-select');

  // Set smart default for Work Mode: Monday (1) = WFH, Tue-Fri = Onsite
  function setDefaultWorkLocation() {
    const day = new Date().getDay();
    if (terminalLocationSelect) {
      terminalLocationSelect.value = (day === 1) ? 'wfh' : 'onsite';
    }
  }

  function renderClockTerminal() {
    const activeDev = store.getActiveDeveloper();
    if (!activeDev) return;

    terminalDevAvatar.textContent = activeDev.initials;
    terminalDevAvatar.style.background = activeDev.avatarColor;
    terminalDevName.textContent = activeDev.name;
    terminalDevRole.textContent = activeDev.role;
    terminalDevRate.textContent = `${activeDev.currencySymbol}${activeDev.hourlyRate.toFixed(2)}/hr`;

    // Status & Buttons
    if (activeDev.status === 'working') {
      terminalStatusBadge.className = 'badge badge-working';
      terminalStatusBadge.innerHTML = `<span class="badge-dot"></span> Clocked In (Working)`;
      btnClockIn.disabled = true;
      btnBreak.disabled = false;
      btnBreak.textContent = '☕ Take Break';
      btnBreak.className = 'btn btn-warning btn-lg';
      btnClockOut.disabled = false;

      if (activeDev.activeSession) {
        terminalProjectSelect.value = activeDev.activeSession.projectId || 'proj-1';
        terminalTaskNotes.value = activeDev.activeSession.taskNote || '';
        if (activeDev.activeSession.workLocation) {
          terminalLocationSelect.value = activeDev.activeSession.workLocation;
        }
      }
    } else if (activeDev.status === 'break') {
      terminalStatusBadge.className = 'badge badge-break';
      terminalStatusBadge.innerHTML = `<span class="badge-dot"></span> On Break`;
      btnClockIn.disabled = true;
      btnBreak.disabled = false;
      btnBreak.textContent = '▶ Resume Work';
      btnBreak.className = 'btn btn-success btn-lg';
      btnClockOut.disabled = false;
    } else {
      terminalStatusBadge.className = 'badge badge-offline';
      terminalStatusBadge.innerHTML = `<span class="badge-dot"></span> Clocked Out`;
      btnClockIn.disabled = false;
      btnBreak.disabled = true;
      btnBreak.textContent = '☕ Take Break';
      btnBreak.className = 'btn btn-warning btn-lg';
      btnClockOut.disabled = true;
      terminalTimerDigits.textContent = '00:00:00';
      terminalEarningsVal.textContent = `${activeDev.currencySymbol}0.00`;
      setDefaultWorkLocation();
    }

    renderTodayActivityList(activeDev.id);
  }

  function renderTodayActivityList(devId) {
    const todayStr = new Date().toISOString().split('T')[0];
    const records = store.getState().attendanceRecords.filter(r => r.developerId === devId && r.date === todayStr);

    todayActivityList.innerHTML = '';
    if (records.length === 0) {
      todayActivityList.innerHTML = `<p style="color: var(--text-muted); font-size: 0.88rem; padding: 12px 0;">No completed sessions logged today yet.</p>`;
      return;
    }

    records.forEach(r => {
      const proj = store.getProjectById(r.projectId);
      const start = new Date(r.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const end = new Date(r.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const duration = payroll.formatDuration(r.workedMinutes);

      const div = document.createElement('div');
      div.className = 'glass-card glass-card-hover';
      div.style.padding = '14px 18px';
      div.style.marginBottom = '10px';
      div.style.display = 'flex';
      div.style.justifyContent = 'space-between';
      div.style.alignItems = 'center';

      div.innerHTML = `
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <strong style="font-size: 0.9rem; color: var(--text-primary);">${proj.name}</strong>
            <span class="badge badge-working" style="font-size: 0.7rem;">${duration}</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-secondary);">${r.taskNote || 'Work session'} (${start} - ${end})</div>
        </div>
        <div style="text-align: right;">
          <div style="font-family: var(--font-mono); font-weight: 700; color: var(--status-working); font-size: 1.05rem;">
            +${r.currencySymbol}${r.totalEarnings.toFixed(2)}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${r.breakDurationMinutes}m break</div>
        </div>
      `;
      todayActivityList.appendChild(div);
    });
  }

  // Punch Button Listeners
  btnClockIn.addEventListener('click', () => {
    const dev = store.getActiveDeveloper();
    const projId = terminalProjectSelect.value;
    const taskNotes = terminalTaskNotes.value.trim() || 'Development Sprint';
    const location = terminalLocationSelect.value || 'onsite';

    attendance.clockIn(dev.id, projId, taskNotes, location);
    showToast(`Clocked in (${location.toUpperCase()})! Started work on [${store.getProjectById(projId).code}]`, 'success');
    renderClockTerminal();
    renderAttendanceBoard();
  });

  btnBreak.addEventListener('click', () => {
    const dev = store.getActiveDeveloper();
    if (dev.status === 'working') {
      attendance.startBreak(dev.id);
      showToast(`Break mode activated. Timer paused.`, 'warning');
    } else if (dev.status === 'break') {
      attendance.resumeWork(dev.id);
      showToast(`Resumed work! Timer running.`, 'success');
    }
    renderClockTerminal();
    renderAttendanceBoard();
  });

  btnClockOut.addEventListener('click', () => {
    const dev = store.getActiveDeveloper();
    if (confirm(`Clock out as ${dev.name} and record today's session?`)) {
      const savedRecord = attendance.clockOut(dev.id);
      if (savedRecord) {
        showToast(`Clocked out! Logged ${payroll.formatDuration(savedRecord.workedMinutes)} (+${savedRecord.currencySymbol}${savedRecord.totalEarnings})`, 'success');
      }
      renderClockTerminal();
      renderAttendanceBoard();
      renderTimesheetsAndPayroll();
    }
  });

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

  // Real-time Timer Tick Event Listener
  window.addEventListener('devtrack:timerTick', (e) => {
    const { activeDev, liveStats } = e.detail;
    if (activeDev.status === 'working' || activeDev.status === 'break') {
      terminalTimerDigits.textContent = liveStats.formattedTime;
      terminalWorkedVal.textContent = payroll.formatDuration(liveStats.netMinutesWorked);
      terminalBreakVal.textContent = `${liveStats.totalBreakMinutes}m`;
      terminalEarningsVal.textContent = liveStats.earningsFormatted;
    }
  });

  // ==========================================
  // 5. Live Attendance Board View
  // ==========================================
  function renderAttendanceBoard() {
    const state = store.getState();
    attendanceGrid.innerHTML = '';

    let onlineCount = 0;
    let todayTotalMinutes = 0;
    let todayTotalGross = 0;
    const todayStr = new Date().toISOString().split('T')[0];

    // Add completed records today
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
            <span class="attendance-detail-label">Hourly Rate:</span>
            <span class="attendance-detail-value">${dev.currencySymbol}${dev.hourlyRate.toFixed(2)}/hr</span>
          </div>
          <div class="attendance-detail-row">
            <span class="attendance-detail-label">Current Billable:</span>
            <span class="attendance-detail-value" style="color: var(--status-working);">${liveStats.earningsFormatted}</span>
          </div>
        </div>

        <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${currentTask}</span>
        </div>
      `;

      attendanceGrid.appendChild(card);
    });

    // Update Attendance Header Stats
    statOnlineDevs.textContent = `${onlineCount} / ${state.developers.length}`;
    statTodayHours.textContent = `${(todayTotalMinutes / 60).toFixed(1)} hrs`;
    statTodayPayroll.textContent = `$${todayTotalGross.toFixed(2)}`;
  }

  // ==========================================
  // 6. Timesheet & Payroll Analytics View
  // ==========================================
  let currentFilteredRecords = [];

  function renderTimesheetsAndPayroll() {
    const rangeType = payrollDateFilter.value;
    const devFilter = payrollDevFilter.value;
    const projFilter = payrollProjectFilter.value;
    const start = customStartDate.value;
    const end = customEndDate.value;

    currentFilteredRecords = payroll.filterRecords(rangeType, devFilter, projFilter, start, end);
    const summary = payroll.generateSummary(currentFilteredRecords);

    // Update Top Summary Cards
    summaryTotalHours.textContent = `${summary.totalHours} hrs`;
    summaryTotalPayroll.textContent = `$${summary.totalGrossPay}`;
    summaryTotalSessions.textContent = summary.totalRecords;
    summaryAvgRate.textContent = `$${summary.avgHourlyPay}/hr`;

    // Render Timesheet Table Rows
    timesheetTableBody.innerHTML = '';
    if (currentFilteredRecords.length === 0) {
      timesheetTableBody.innerHTML = `
        <tr>
          <td colspan="10" style="text-align: center; color: var(--text-muted); padding: 32px;">
            No timesheet records found for the selected filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    currentFilteredRecords.forEach(rec => {
      const dev = store.getDeveloperById(rec.developerId) || { name: 'Unknown', avatarColor: '#6366f1', initials: '?' };
      const proj = store.getProjectById(rec.projectId);
      const startT = rec.startTime ? new Date(rec.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
      const endT = rec.endTime ? new Date(rec.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
      const hours = ((rec.workedMinutes || 0) / 60).toFixed(2);
      const isWfh = rec.workLocation === 'wfh';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 28px; height: 28px; border-radius: 50%; background: ${dev.avatarColor}; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: white;">
              ${dev.initials}
            </div>
            <strong>${dev.name}</strong>
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
        <td class="font-mono">${rec.currencySymbol}${(rec.hourlyRate || 0).toFixed(2)}</td>
        <td class="font-mono" style="font-weight: 700; color: var(--status-working);">
          ${rec.currencySymbol}${(rec.totalEarnings || 0).toFixed(2)}
        </td>
        <td>
          <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.75rem;" onclick="deleteTimesheetRecord('${rec.id}')">
            Delete
          </button>
        </td>
      `;
      timesheetTableBody.appendChild(tr);
    });
  }

  // Populate Developer Filter Select
  function populatePayrollDevFilter() {
    const devs = store.getState().developers;
    payrollDevFilter.innerHTML = '<option value="all">All Team Members</option>';
    devs.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = d.name;
      payrollDevFilter.appendChild(opt);
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

  // Global Delete Timesheet Record function
  window.deleteTimesheetRecord = function(recordId) {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      store.deleteAttendanceRecord(recordId);
      showToast('Attendance record deleted', 'info');
      renderTimesheetsAndPayroll();
    }
  };

  // Export Buttons
  btnExportCsv.addEventListener('click', () => {
    exporter.exportToCSV(currentFilteredRecords);
    showToast('Exported timesheet records to CSV', 'success');
  });

  btnPrintReport.addEventListener('click', () => {
    exporter.printPayrollReport();
  });

  // ==========================================
  // 7. Team & Rate Settings View
  // ==========================================
  function renderSettings() {
    const state = store.getState();

    // Render Developers Table
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
          ${dev.currencySymbol}${dev.hourlyRate.toFixed(2)} / hr
        </td>
        <td>
          <span class="badge ${dev.status === 'working' ? 'badge-working' : (dev.status === 'break' ? 'badge-break' : 'badge-offline')}">
            ${dev.status.toUpperCase()}
          </span>
        </td>
        <td>
          <button class="btn btn-secondary" style="padding: 6px 12px; font-size: 0.78rem;" onclick="editDeveloperModal('${dev.id}')">
            Edit Rate
          </button>
          <button class="btn btn-danger" style="padding: 6px 12px; font-size: 0.78rem; margin-left: 6px;" onclick="deleteDeveloperConfirm('${dev.id}')">
            Remove
          </button>
        </td>
      `;
      settingsDevTableBody.appendChild(tr);
    });

    // Render Projects Table
    settingsProjectTableBody.innerHTML = '';
    state.projects.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="badge badge-working" style="font-family: var(--font-mono);">${p.code}</span></td>
        <td style="font-weight: 600;">${p.name}</td>
        <td>Active</td>
      `;
      settingsProjectTableBody.appendChild(tr);
    });
  }

  window.editDeveloperModal = function(devId) {
    const dev = store.getDeveloperById(devId);
    if (!dev) return;

    const newRate = prompt(`Enter new hourly rate for ${dev.name} (${dev.currencySymbol}):`, dev.hourlyRate);
    if (newRate !== null) {
      const rateNum = parseFloat(newRate);
      if (!isNaN(rateNum) && rateNum >= 0) {
        store.updateDeveloper(devId, { hourlyRate: rateNum });
        showToast(`Updated hourly rate for ${dev.name} to ${dev.currencySymbol}${rateNum.toFixed(2)}/hr`, 'success');
        renderSettings();
        renderUserSelector();
        renderClockTerminal();
      } else {
        alert('Invalid hourly rate entered.');
      }
    }
  };

  window.deleteDeveloperConfirm = function(devId) {
    const dev = store.getDeveloperById(devId);
    if (confirm(`Are you sure you want to remove ${dev.name} from the team?`)) {
      store.deleteDeveloper(devId);
      showToast(`${dev.name} removed from team roster`, 'info');
      renderSettings();
      renderUserSelector();
      renderClockTerminal();
    }
  };

  // Database Backup, Import, Reset
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
    if (confirm('Reset all developers and attendance records back to initial default demo data?')) {
      store.resetToDefault();
      showToast('Database reset to defaults', 'info');
      renderAll();
    }
  });

  // ==========================================
  // 8. Modals Handling (Add Dev, Manual Entry, Add Project)
  // ==========================================
  const modalAddDev = document.getElementById('modal-add-dev');
  const formAddDev = document.getElementById('form-add-dev');
  const btnCloseAddDev = document.getElementById('btn-close-add-dev');
  const btnCancelAddDev = document.getElementById('btn-cancel-add-dev');

  btnOpenAddDev.addEventListener('click', () => {
    modalAddDev.classList.add('active');
  });
  [btnCloseAddDev, btnCancelAddDev].forEach(b => b.addEventListener('click', () => {
    modalAddDev.classList.remove('active');
  }));

  formAddDev.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('dev-name-input').value.trim();
    const role = document.getElementById('dev-role-input').value.trim();
    const hourlyRate = parseFloat(document.getElementById('dev-rate-input').value) || 25;
    const currencySymbol = document.getElementById('dev-currency-input').value;
    const email = document.getElementById('dev-email-input').value.trim();

    store.addDeveloper({ name, role, hourlyRate, currencySymbol, email });
    showToast(`Added new team member: ${name}`, 'success');
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
    // Populate selects
    manualDevSelect.innerHTML = '';
    store.getState().developers.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = `${d.name} (${d.currencySymbol}${d.hourlyRate}/hr)`;
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

  [btnCloseManualEntry, btnCancelManualEntry].forEach(b => b.addEventListener('click', () => {
    modalManualEntry.classList.remove('active');
  }));

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
    showToast(`Added manual timesheet record for ${dev.name} (${location.toUpperCase()})`, 'success');
    modalManualEntry.classList.remove('active');
    formManualEntry.reset();
    renderTimesheetsAndPayroll();
  });

  // Add Project Modal
  const modalAddProject = document.getElementById('modal-add-project');
  const formAddProject = document.getElementById('form-add-project');
  const btnCloseAddProject = document.getElementById('btn-close-add-project');
  const btnCancelAddProject = document.getElementById('btn-cancel-add-project');

  btnOpenAddProject.addEventListener('click', () => {
    modalAddProject.classList.add('active');
  });
  [btnCloseAddProject, btnCancelAddProject].forEach(b => b.addEventListener('click', () => {
    modalAddProject.classList.remove('active');
  }));

  formAddProject.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('proj-name-input').value.trim();
    const code = document.getElementById('proj-code-input').value.trim().toUpperCase();

    if (name) {
      store.addProject(name, code);
      showToast(`Added project: ${name}`, 'success');
      modalAddProject.classList.remove('active');
      formAddProject.reset();
      renderAll();
    }
  });

  // ==========================================
  // 9. Toast Notification Engine
  // ==========================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
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
  // Master Render Coordinator
  // ==========================================
  function renderAll() {
    renderUserSelector();
    renderProjectDropdowns();
    populatePayrollDevFilter();
    renderClockTerminal();
    renderAttendanceBoard();
    renderTimesheetsAndPayroll();
    renderSettings();
  }

  // Initialization
  initHeaderClock();
  renderAll();
});
