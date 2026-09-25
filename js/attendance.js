/**
 * DevTrack - Attendance Engine
 * Controls real-time clock-in/out state machine, break tracking, and live earnings calculation.
 */

class AttendanceEngine {
  constructor(store) {
    this.store = store;
    this.timerInterval = null;
    this.initTicker();
  }

  initTicker() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);
  }

  clockIn(devId, projectId, taskNote, workLocation = 'onsite', gpsData = null, customStartTime = null) {
    const dev = this.store.getDeveloperById(devId);
    if (!dev) return false;

    const startISO = customStartTime ? new Date(customStartTime).toISOString() : new Date().toISOString();
    dev.status = 'working';
    dev.activeSession = {
      startTime: startISO,
      breaks: [],
      currentBreakStart: null,
      projectId: projectId || 'proj-1',
      taskNote: taskNote || 'Active development sprint',
      workLocation: workLocation || (new Date(startISO).getDay() === 1 ? 'wfh' : 'onsite'), // Monday defaults to WFH
      gps: gpsData || null
    };

    this.store.saveState(true);
    this.store.postStateToServer(this.store.getState());
    return true;
  }

  adjustActiveStartTime(devId, newStartTimeISO) {
    const dev = this.store.getDeveloperById(devId);
    if (!dev || !dev.activeSession) return false;
    dev.activeSession.startTime = new Date(newStartTimeISO).toISOString();
    this.store.saveState(true);
    this.store.postStateToServer(this.store.getState());
    return true;
  }

  startBreak(devId) {
    const dev = this.store.getDeveloperById(devId);
    if (!dev || !dev.activeSession || dev.status !== 'working') return false;

    dev.status = 'break';
    dev.activeSession.currentBreakStart = new Date().toISOString();
    this.store.saveState(true);
    this.store.postStateToServer(this.store.getState());
    return true;
  }

  resumeWork(devId) {
    const dev = this.store.getDeveloperById(devId);
    if (!dev || !dev.activeSession || dev.status !== 'break') return false;

    const breakEnd = new Date();
    const breakStart = new Date(dev.activeSession.currentBreakStart);
    const durationMs = Math.max(0, breakEnd - breakStart);

    if (!Array.isArray(dev.activeSession.breaks)) dev.activeSession.breaks = [];
    dev.activeSession.breaks.push({
      start: dev.activeSession.currentBreakStart,
      end: breakEnd.toISOString(),
      durationMs
    });

    dev.activeSession.currentBreakStart = null;
    dev.status = 'working';
    this.store.saveState(true);
    this.store.postStateToServer(this.store.getState());
    return true;
  }

  clockOut(devId, gpsData = null, customEndTime = null) {
    const dev = this.store.getDeveloperById(devId);
    if (!dev || !dev.activeSession) return null;

    const session = dev.activeSession;
    const sessionStart = new Date(session.startTime);
    const end = customEndTime ? new Date(customEndTime) : new Date();
    
    // Date of record is the shift start date (so if clocked in at 9am today, it logs for today)
    const recordDate = session.startTime ? session.startTime.split('T')[0] : end.toISOString().split('T')[0];

    if (!Array.isArray(session.breaks)) session.breaks = [];

    // If currently on break, close the break first
    if (dev.status === 'break' && session.currentBreakStart) {
      const breakStart = new Date(session.currentBreakStart);
      const breakEnd = breakStart > end ? breakStart : end;
      session.breaks.push({
        start: session.currentBreakStart,
        end: breakEnd.toISOString(),
        durationMs: Math.max(0, breakEnd - breakStart)
      });
      session.currentBreakStart = null;
    }

    // Calculate total break duration (only manual logged breaks, lunch is paid)
    const totalBreakMs = session.breaks.reduce((acc, b) => acc + ((b && b.durationMs) || 0), 0);
    const breakDurationMinutes = Math.round(totalBreakMs / 60000);

    // Compute rendered time with shift clamping (9:00 AM - 5:00 PM) & paid lunch
    const rendered = this.store.calculateShiftRenderedTime({
      startTime: session.startTime,
      endTime: end.toISOString(),
      breakDurationMinutes,
      developerId: dev.id,
      date: recordDate,
      workLocation: session.workLocation || 'onsite'
    });

    const hourlyRate = parseFloat(dev.hourlyRate) || 0;

    const record = {
      developerId: dev.id,
      date: recordDate,
      startTime: session.startTime,
      endTime: end.toISOString(),
      breakDurationMinutes: rendered.breakMinutes,
      workedMinutes: rendered.workedMinutes,
      hourlyRate,
      currencySymbol: dev.currencySymbol || '$',
      totalEarnings: rendered.totalEarnings,
      projectId: session.projectId || 'proj-1',
      workLocation: session.workLocation || 'onsite',
      taskNote: session.taskNote || 'Work session',
      gps: session.gps || gpsData || null,
      autoTimedOut: !!customEndTime
    };

    // Save record & reset active session
    this.store.addAttendanceRecord(record);
    dev.status = 'offline';
    dev.activeSession = null;
    this.store.saveState(true);
    this.store.postStateToServer(this.store.getState());

    return record;
  }

  updateSessionContext(devId, projectId, taskNote, workLocation) {
    const dev = this.store.getDeveloperById(devId);
    if (dev && dev.activeSession) {
      if (projectId) dev.activeSession.projectId = projectId;
      if (taskNote !== undefined) dev.activeSession.taskNote = taskNote;
      if (workLocation) dev.activeSession.workLocation = workLocation;
      this.store.saveState();
    }
  }

  reopenShift(devId, recordId = null) {
    const dev = this.store.getDeveloperById(devId);
    if (!dev) return false;

    const records = this.store.getState().attendanceRecords || [];
    let record = null;

    if (recordId) {
      record = records.find(r => r.id === recordId);
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      const todayRecords = records.filter(r => r.developerId === devId && r.date === todayStr);
      record = todayRecords[todayRecords.length - 1];
    }

    if (!record) return false;

    // Restore active session with previous Start Time
    dev.status = 'working';
    dev.activeSession = {
      startTime: record.startTime,
      breaks: record.breakDurationMinutes > 0 ? [{
        start: record.startTime,
        end: new Date(new Date(record.startTime).getTime() + (record.breakDurationMinutes * 60000)).toISOString(),
        durationMs: record.breakDurationMinutes * 60000
      }] : [],
      currentBreakStart: null,
      projectId: record.projectId || 'proj-1',
      taskNote: record.taskNote || 'Resumed active session',
      workLocation: record.workLocation || 'onsite',
      gps: record.gps || null
    };

    // Remove the finalized attendance record so shift is ongoing
    this.store.deleteAttendanceRecord(record.id);
    this.store.saveState();
    return true;
  }

  // Automatic Shift Timeout Evaluation Engine
  // Automatically times out employees who forgot to punch out (15 mins after shift end -> stamped as 17:00)
  checkAutoTimeouts() {
    const state = this.store.getState();
    const schedules = this.store.getWorkSchedules ? this.store.getWorkSchedules() : (state.workSchedules || {});
    if (schedules.autoTimeoutEnabled === false) return [];

    const shiftEndStr = schedules.shiftEnd || '17:00';
    const graceMins = parseInt(schedules.gracePeriodMins != null ? schedules.gracePeriodMins : 15) || 15;
    const [endH, endM] = shiftEndStr.split(':').map(Number);
    
    // Cutoff minutes from midnight (e.g. 17:00 + 15m grace = 17:15 -> 1035 mins)
    const cutoffMinutes = (endH * 60 + endM) + graceMins;
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = String(now.getMonth() + 1).padStart(2, '0');
    const nowDay = String(now.getDate()).padStart(2, '0');
    const todayDateStr = `${nowYear}-${nowMonth}-${nowDay}`;
    const currentMinutesToday = now.getHours() * 60 + now.getMinutes();

    const timedOutDevs = [];
    const developers = state.developers || [];

    developers.forEach(dev => {
      if ((dev.status === 'working' || dev.status === 'break') && dev.activeSession && dev.activeSession.startTime) {
        const sessionStart = new Date(dev.activeSession.startTime);
        if (isNaN(sessionStart.getTime())) return;

        const sessionDate = new Date(dev.activeSession.startTime);
        const sYear = sessionDate.getFullYear();
        const sMonth = String(sessionDate.getMonth() + 1).padStart(2, '0');
        const sDay = String(sessionDate.getDate()).padStart(2, '0');
        const sessionStartDateStr = `${sYear}-${sMonth}-${sDay}`;

        const isPastDay = sessionStartDateStr < todayDateStr;
        const isShiftDay = sessionStartDateStr === todayDateStr;
        const hasPassedShiftCutoff = isShiftDay && (currentMinutesToday >= cutoffMinutes);

        if (isPastDay || hasPassedShiftCutoff) {
          // Construct target official punch out time (5:00 PM on that shift's date)
          const targetEndDate = new Date(sYear, parseInt(sMonth) - 1, parseInt(sDay), endH, endM, 0, 0);
          
          let finalEndISO = targetEndDate.toISOString();
          if (targetEndDate <= sessionStart) {
            const fallbackEnd = new Date(sessionStart.getTime() + (8 * 3600000));
            finalEndISO = fallbackEnd.toISOString();
          }

          const savedRecord = this.clockOut(dev.id, null, finalEndISO);
          if (savedRecord) {
            savedRecord.taskNote = (savedRecord.taskNote ? savedRecord.taskNote + ' ' : '') + '(Auto-timed out at 5:00 PM)';
            this.store.saveState();
            timedOutDevs.push({ dev, record: savedRecord });
          }
        }
      }
    });

    if (timedOutDevs.length > 0) {
      window.dispatchEvent(new CustomEvent('devtrack:autoTimedOut', {
        detail: { timedOutDevs }
      }));
    }

    return timedOutDevs;
  }

  // Calculate live current active stats for a developer
  calculateLiveStats(dev) {
    if (!dev || !dev.activeSession) {
      return {
        formattedTime: '00:00:00',
        totalBreakMinutes: 0,
        netMinutesWorked: 0,
        currentEarnings: 0,
        earningsFormatted: '$0.00',
        status: dev ? dev.status : 'offline'
      };
    }

    const now = new Date();
    const session = dev.activeSession;
    const breaks = (session && Array.isArray(session.breaks)) ? session.breaks : [];
    let totalBreakMs = breaks.reduce((acc, b) => acc + ((b && b.durationMs) || 0), 0);
    if (dev.status === 'break' && session.currentBreakStart) {
      totalBreakMs += Math.max(0, now - new Date(session.currentBreakStart));
    }

    const recDate = session.startTime ? session.startTime.split('T')[0] : now.toISOString().split('T')[0];
    const rendered = this.store.calculateShiftRenderedTime({
      startTime: session.startTime,
      endTime: now.toISOString(),
      breakDurationMinutes: Math.round(totalBreakMs / 60000),
      developerId: dev.id,
      date: recDate,
      workLocation: session.workLocation || 'onsite'
    });

    const netWorkedMs = rendered.netWorkedMs;
    const seconds = Math.floor((netWorkedMs / 1000) % 60);
    const minutes = Math.floor((netWorkedMs / (1000 * 60)) % 60);
    const hours = Math.floor(netWorkedMs / (1000 * 60 * 60));

    const pad = (n) => String(n).padStart(2, '0');
    const formattedTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    const currentEarnings = rendered.totalEarnings;
    const symbol = dev.currencySymbol || '$';

    return {
      formattedTime,
      totalBreakMinutes: rendered.breakMinutes,
      netMinutesWorked: rendered.workedMinutes,
      currentEarnings,
      earningsFormatted: `${symbol}${currentEarnings.toFixed(2)}`,
      status: dev.status
    };
  }

  tick() {
    // Run auto-timeout check to protect against forgotten punch-outs
    this.checkAutoTimeouts();

    // Dispatch custom event with live stats for active developer and team
    const activeDev = this.store.getActiveDeveloper();
    if (activeDev) {
      const liveStats = this.calculateLiveStats(activeDev);
      window.dispatchEvent(new CustomEvent('devtrack:timerTick', {
        detail: {
          activeDev,
          liveStats
        }
      }));
    }
  }
}

// Global attendance engine instance
window.DevAttendance = new AttendanceEngine(window.DevStore);
