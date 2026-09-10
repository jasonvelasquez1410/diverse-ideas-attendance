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

  clockIn(devId, projectId, taskNote, workLocation = 'onsite') {
    const dev = this.store.getDeveloperById(devId);
    if (!dev) return false;

    const now = new Date();
    dev.status = 'working';
    dev.activeSession = {
      startTime: now.toISOString(),
      breaks: [],
      currentBreakStart: null,
      projectId: projectId || 'proj-1',
      taskNote: taskNote || 'Active development sprint',
      workLocation: workLocation || (now.getDay() === 1 ? 'wfh' : 'onsite') // Monday defaults to WFH
    };

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

  clockOut(devId) {
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
      taskNote: session.taskNote
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
