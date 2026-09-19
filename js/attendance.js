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

    this.store.saveState();
    return true;
  }

  adjustActiveStartTime(devId, newStartTimeISO) {
    const dev = this.store.getDeveloperById(devId);
    if (!dev || !dev.activeSession) return false;
    dev.activeSession.startTime = new Date(newStartTimeISO).toISOString();
    this.store.saveState();
    return true;
  }

  startBreak(devId) {
    const dev = this.store.getDeveloperById(devId);
    if (!dev || !dev.activeSession || dev.status !== 'working') return false;

    dev.status = 'break';
    dev.activeSession.currentBreakStart = new Date().toISOString();
    this.store.saveState();
    return true;
  }

  resumeWork(devId) {
    const dev = this.store.getDeveloperById(devId);
    if (!dev || !dev.activeSession || dev.status !== 'break') return false;

    const breakEnd = new Date();
    const breakStart = new Date(dev.activeSession.currentBreakStart);
    const durationMs = Math.max(0, breakEnd - breakStart);

    dev.activeSession.breaks.push({
      start: dev.activeSession.currentBreakStart,
      end: breakEnd.toISOString(),
      durationMs
    });

    dev.activeSession.currentBreakStart = null;
    dev.status = 'working';
    this.store.saveState();
    return true;
  }

  clockOut(devId, gpsData = null) {
    const dev = this.store.getDeveloperById(devId);
    if (!dev || !dev.activeSession) return null;

    const now = new Date();
    const session = dev.activeSession;

    // If currently on break, close the break first
    if (dev.status === 'break' && session.currentBreakStart) {
      const breakStart = new Date(session.currentBreakStart);
      session.breaks.push({
        start: session.currentBreakStart,
        end: now.toISOString(),
        durationMs: Math.max(0, now - breakStart)
      });
      session.currentBreakStart = null;
    }

    const sessionStart = new Date(session.startTime);
    const totalElapsedMs = Math.max(0, now - sessionStart);
    
    // Sum total break duration
    const totalBreakMs = session.breaks.reduce((acc, b) => acc + (b.durationMs || 0), 0);
    const netWorkedMs = Math.max(0, totalElapsedMs - totalBreakMs);
    const workedMinutes = Math.round(netWorkedMs / 60000);
    const breakDurationMinutes = Math.round(totalBreakMs / 60000);

    // Calculate final earnings
    const hourlyRate = parseFloat(dev.hourlyRate) || 0;
    const totalEarnings = parseFloat(((netWorkedMs / 3600000) * hourlyRate).toFixed(2));

    const record = {
      developerId: dev.id,
      date: now.toISOString().split('T')[0],
      startTime: session.startTime,
      endTime: now.toISOString(),
      breakDurationMinutes,
      workedMinutes,
      hourlyRate,
      currencySymbol: dev.currencySymbol || '$',
      totalEarnings,
      projectId: session.projectId,
      workLocation: session.workLocation || 'onsite',
      taskNote: session.taskNote,
      gps: session.gps || gpsData || null
    };

    // Save record & reset active session
    this.store.addAttendanceRecord(record);
    dev.status = 'offline';
    dev.activeSession = null;
    this.store.saveState();

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
    const sessionStart = new Date(session.startTime);
    const totalElapsedMs = Math.max(0, now - sessionStart);

    let totalBreakMs = session.breaks.reduce((acc, b) => acc + (b.durationMs || 0), 0);
    if (dev.status === 'break' && session.currentBreakStart) {
      totalBreakMs += Math.max(0, now - new Date(session.currentBreakStart));
    }

    const netWorkedMs = Math.max(0, totalElapsedMs - totalBreakMs);
    const seconds = Math.floor((netWorkedMs / 1000) % 60);
    const minutes = Math.floor((netWorkedMs / (1000 * 60)) % 60);
    const hours = Math.floor(netWorkedMs / (1000 * 60 * 60));

    const pad = (n) => String(n).padStart(2, '0');
    const formattedTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    const hourlyRate = parseFloat(dev.hourlyRate) || 0;
    const currentEarnings = (netWorkedMs / 3600000) * hourlyRate;
    const symbol = dev.currencySymbol || '$';

    return {
      formattedTime,
      totalBreakMinutes: Math.round(totalBreakMs / 60000),
      netMinutesWorked: Math.round(netWorkedMs / 60000),
      currentEarnings,
      earningsFormatted: `${symbol}${currentEarnings.toFixed(2)}`,
      status: dev.status
    };
  }

  tick() {
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
