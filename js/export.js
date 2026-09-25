/**
 * DevTrack - Export & Reporting Utility
 * Generates CSV spreadsheets, JSON database backups, and formatted print payroll slips.
 */

class ExportUtility {
  constructor(store, payroll) {
    this.store = store;
    this.payroll = payroll;
  }

  // Export filtered records to CSV
  exportToCSV(records) {
    if (!records || records.length === 0) {
      alert('No attendance records available to export.');
      return;
    }

    const rate = this.store.getUsdToPhpRate();
    const headers = [
      'Record ID',
      'Developer Name',
      'Role',
      'Location Mode',
      'Date',
      'Start Time',
      'End Time',
      'Break (Mins)',
      'Net Hours',
      'Rate (USD)',
      'Gross Pay (USD)',
      'Rate (PHP)',
      'Gross Pay (PHP)',
      'USD to PHP Exchange Rate',
      'Project',
      'Task Notes'
    ];

    const rows = records.map(rec => {
      const dev = this.store.getDeveloperById(rec.developerId) || { name: 'Unknown', role: 'N/A' };
      const proj = this.store.getProjectById(rec.projectId) || { name: 'N/A' };
      const start = rec.startTime ? new Date(rec.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
      const end = rec.endTime ? new Date(rec.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';
      const netHours = ((rec.workedMinutes || 0) / 60).toFixed(2);
      const locText = rec.workLocation === 'wfh' ? 'WFH (Home)' : 'Onsite (Office)';
      const rateUsd = (rec.hourlyRate || 0);
      const grossUsd = (rec.totalEarnings || 0);
      const ratePhp = (rateUsd * rate).toFixed(2);
      const grossPhp = (grossUsd * rate).toFixed(2);

      return [
        `"${rec.id}"`,
        `"${dev.name.replace(/"/g, '""')}"`,
        `"${dev.role.replace(/"/g, '""')}"`,
        `"${locText}"`,
        `"${rec.date}"`,
        `"${start}"`,
        `"${end}"`,
        rec.breakDurationMinutes || 0,
        netHours,
        rateUsd.toFixed(2),
        grossUsd.toFixed(2),
        ratePhp,
        grossPhp,
        rate.toFixed(2),
        `"${proj.name.replace(/"/g, '""')}"`,
        `"${(rec.taskNote || '').replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `DevTrack_Payroll_Export_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Export full JSON state backup
  exportJSONBackup() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(this.store.exportBackupJSON());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute('download', `DevTrack_Database_Backup_${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // Trigger Print Payroll Slip (Admin Exclusive PIN 1410)
  printPayrollReport() {
    if (!this.store.isAdmin()) {
      if (window.showToast) {
        window.showToast('🔒 Access Restricted: Payslip generation is confidential and exclusive to Administrator (Master PIN 1410).', 'warning');
      }
      return;
    }
    if (window.openPayslipModal) {
      window.openPayslipModal();
    }
    setTimeout(() => {
      window.print();
    }, 150);
  }
}

// Global export instance
window.DevExport = new ExportUtility(window.DevStore, window.DevPayroll);

