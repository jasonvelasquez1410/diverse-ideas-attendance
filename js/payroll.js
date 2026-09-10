/**
 * DevTrack - Payroll & Timesheet Reporting Engine
 * Computes hours, earnings, breakdowns, and statistical summaries.
 */

class PayrollEngine {
  constructor(store) {
    this.store = store;
  }

  // Format minutes to "Xh Ym"
  formatDuration(minutes) {
    if (!minutes || isNaN(minutes)) return '0h 0m';
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hrs === 0) return `${mins}m`;
    if (mins === 0) return `${hrs}h`;
    return `${hrs}h ${mins}m`;
  }

  // Filter attendance records by preset or custom date range
  filterRecords(rangeType = 'all', devFilter = 'all', projectFilter = 'all', customStart = null, customEnd = null) {
    const records = this.store.getState().attendanceRecords;
    const now = new Date();

    return records.filter(record => {
      // Developer filter
      if (devFilter !== 'all' && record.developerId !== devFilter) return false;

      // Project filter
      if (projectFilter !== 'all' && record.projectId !== projectFilter) return false;

      const recordDate = new Date(record.date);

      if (rangeType === 'today') {
        const todayStr = now.toISOString().split('T')[0];
        return record.date === todayStr;
      }

      if (rangeType === 'week') {
        const dayOfWeek = now.getDay(); // 0 is Sun
        const distanceToMonday = (dayOfWeek + 6) % 7;
        const monday = new Date(now);
        monday.setDate(now.getDate() - distanceToMonday);
        monday.setHours(0, 0, 0, 0);
        return recordDate >= monday;
      }

      if (rangeType === 'month') {
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return recordDate >= firstDayOfMonth;
      }

      if (rangeType === 'custom' && customStart && customEnd) {
        const start = new Date(customStart);
        const end = new Date(customEnd);
        end.setHours(23, 59, 59, 999);
        return recordDate >= start && recordDate <= end;
      }

      return true; // 'all'
    });
  }

  // Generate complete payroll and analytics summary
  generateSummary(filteredRecords) {
    let totalMinutesWorked = 0;
    let totalGrossPay = 0;
    let totalBreakMinutes = 0;
    const devMap = {};
    const projectMap = {};

    filteredRecords.forEach(rec => {
      totalMinutesWorked += (rec.workedMinutes || 0);
      totalGrossPay += (rec.totalEarnings || 0);
      totalBreakMinutes += (rec.breakDurationMinutes || 0);

      // Dev stats aggregation
      if (!devMap[rec.developerId]) {
        const dev = this.store.getDeveloperById(rec.developerId) || { name: 'Unknown', role: 'Dev', currencySymbol: '$', hourlyRate: 0 };
        devMap[rec.developerId] = {
          developer: dev,
          minutesWorked: 0,
          totalEarnings: 0,
          sessionCount: 0
        };
      }
      devMap[rec.developerId].minutesWorked += (rec.workedMinutes || 0);
      devMap[rec.developerId].totalEarnings += (rec.totalEarnings || 0);
      devMap[rec.developerId].sessionCount += 1;

      // Project stats aggregation
      const projId = rec.projectId || 'unassigned';
      if (!projectMap[projId]) {
        const proj = this.store.getProjectById(projId);
        projectMap[projId] = {
          project: proj,
          minutesWorked: 0,
          totalCost: 0
        };
      }
      projectMap[projId].minutesWorked += (rec.workedMinutes || 0);
      projectMap[projId].totalCost += (rec.totalEarnings || 0);
    });

    const totalHours = (totalMinutesWorked / 60).toFixed(1);
    const avgHourlyPay = totalMinutesWorked > 0 ? (totalGrossPay / (totalMinutesWorked / 60)).toFixed(2) : '0.00';

    return {
      totalRecords: filteredRecords.length,
      totalMinutesWorked,
      totalHours,
      totalGrossPay: totalGrossPay.toFixed(2),
      totalBreakMinutes,
      avgHourlyPay,
      byDeveloper: Object.values(devMap),
      byProject: Object.values(projectMap)
    };
  }
}

// Global payroll engine instance
window.DevPayroll = new PayrollEngine(window.DevStore);
