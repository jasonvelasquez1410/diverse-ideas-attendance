# DevTrack: Developer Attendance, Time Off & Enterprise Payroll System
**Company:** Diverse Ideas GMBH  
**Repository:** [github.com/jasonvelasquez1410/diverse-ideas-attendance](https://github.com/jasonvelasquez1410/diverse-ideas-attendance)  
**Live Production URL:** [diverse-ideas-attendance.vercel.app](https://diverse-ideas-attendance.vercel.app)  
**Last Updated:** September 21, 2026

---

## 1. Project Overview & Company Policy

DevTrack is an in-house **Time & Attendance, Daily Time Record (DTR), Time Off & Holidays, and Confidential Dual-Currency Payroll Dashboard** built specifically for the developer team at **Diverse Ideas GMBH**, combining the best workflows from **Jibble** and **Sprout HR / PayDay Solutions**.

### ⚖️ Compensation Model: "No Work, No Pay" (Hourly Rated)
- **Policy Directive:** Per management (Tefanny), all developer compensation operates strictly on a **"No Work, No Pay"** hourly basis.
- **Direct Hourly Wages:** Gross earnings are computed directly from actual logged billable hours recorded by the DTR terminal.
- **Paid Lunch & Paid Pauses:** Lunch and short breaks are fully paid without 1-hour automatic deductions. A standard 09:00 AM – 05:00 PM shift renders a full **8.00 hours** of paid time.
- **Shift Window Clamping (No Unauthorized OT):**
  - Early punches before **09:00 AM** start rendering billable hours at **09:00 AM**.
  - Late punches after **05:00 PM** stop rendering billable hours at **05:00 PM**, unless backed by an approved **Overtime (OT)** application or authorized task.
  - Undertime (late arrival after 09:00 AM or early departure before 05:00 PM) is automatically deducted based on actual punch timestamps.
- **Paid Leave Tracking Disabled by Default:** Because staff are compensated per hour worked, paid leave balances (VL, SL, EL) are disabled by default to eliminate confusion and unnecessary paperwork.
- **Emergency / Missed Punch Resolution:** Staff use **Certificate of Attendance (COA)** to file time adjustments for missed punches caused by brownouts or internet cuts.
- **Modular Admin Control:** Admin can re-enable paid leave credits, overtime forms, or undertime filing at any time via the **🎛️ Feature Sliders & Policy** center.

### 🏢 Work Schedule & Shifts
- **Shift Hours:** `09:00 AM – 05:00 PM` (17:00) / 8.00 billable hours per day (40 hrs/week regular).
- **Default Work Mode:** Default is set directly to **🏢 Office (Onsite)**. Employees can toggle to **🏠 WFH** or **🛌 Saturday Rest Day** at any time.
- **Weekly Target Commitment:** 35 hours minimum / 45 hours maximum per week.
- **Saturday Policy:** Rest Day / Optional (Walay pugsanay — voluntary, no forced weekend work; flexible rendering).

---

## 2. Real Team Credentials & Access Codes

| Employee ID | Employee Name | Role | Hourly Rate | Default PIN | Policy Status | Access Level |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `dev-1` | **BAYSON, Cyreh** | Junior Software Developer | $5.00 / hr | **`7532`** | Hourly (No Work, No Pay) | Personal DTR & Attendance |
| `dev-2` | **IBANEZ, Ella** | Junior Software Developer | $5.00 / hr | **`1598`** | Hourly (No Work, No Pay) | Personal DTR & Attendance |
| `dev-3` | **NALUGON, Abner** | Senior Software Developer | $18.00 / hr | **`5478`** | Hourly (No Work, No Pay) | Personal DTR & Attendance |
| `dev-4` | **VELASQUEZ, Jason Jeff** | Senior Software Developer | $12.00 / hr | **`9654`** | Hourly (No Work, No Pay) | Personal DTR & Attendance |
| `admin-1` | **Administrator / Tefanny** | Operations Manager | *Executive* | **`1410`** | *Master Privileges* | **Full Admin Master Access** |

> 📌 **Note:** All PINs can be changed by developers themselves via the `🔑 PIN` button in the header or managed by Admin in Settings. Rate confidentiality is strictly enforced and locked behind the master PIN `1410`.

---

## 3. Physical Office Location & GPS Geofencing (Mobile & Desktop)

### 📍 Office Specifications
- **Address:** `FJWH+V8J, Kauswagan, Cagayan De Oro City, Misamis Oriental` (Zamuco Apartments, Kauswagan CDO)
- **Coordinates:** Latitude: `8.497211`, Longitude: `124.625679` (Kauswagan CDO Office Hub)
- **Geofence Radius:** `750 meters` (with dynamic accuracy buffer `Math.min(1000, accuracy)` to accommodate indoor mobile GPS drift).
- **Enforcement Mode:** Flexible (non-blocking by default). Distance and coordinates are recorded for managerial audit trails while never preventing physical staff from clocking in.

### 📱 Mobile GPS Architecture & Recent Fixes (Sept 21, 2026)
1. **Adaptive 3-Stage Fused Positioning (`getCurrentDeviceGPS`):**
   - *Stage 1 (Indoor Cellular / Wi-Fi):* Requests fast network positioning (`enableHighAccuracy: false`, `timeout: 10000`, `maximumAge: 180000`). Resolves within 200–500ms on mobile phones indoors.
   - *Stage 2 (Parallel `watchPosition` Race):* Runs parallel `watchPosition` and `getCurrentPosition` to bypass the known Android Chromium bug where `getCurrentPosition` hangs indefinitely.
   - *Stage 3 (Fallback & Smart Cache):* Caches fresh GPS fixes for 2 minutes to eliminate repeated battery-draining satellite locks.
2. **Non-Blocking Onsite Mode & Live Diagnostics:**
   - Top banner immediately reflects `🟢 Inside Office Geofence / Verified Onsite` or `🏢 Office Onsite Mode` without hanging in loading states.
   - If indoor satellite acquisition is delayed, the system displays **"🏢 Onsite Mode (Ready to Punch)"** so employees can clock in immediately.
   - `loadState()` automatically migrates old cached localStorage settings on mobile to ensure `strictGeofence: false` and `radiusMeters >= 750`.
3. **Interactive Mobile Location Help Modal (`#modal-location-help`):**
   - **Live Diagnostics Box:** Displays Security (`HTTPS`), Browser type, Geolocation API status, Accuracy (±Xm), and live distance.
   - **"🏢 At the Office? Punch Onsite (Manual Confirm)":** One-tap override button that logs an Onsite Time IN with a `manualOnsiteConfirmed` audit tag for emergency situations or strict browser permission blocks.
   - **"🚀 Open Link Directly in Chrome App":** Direct Android Chrome intent link for users who open the link inside Messenger / Viber / Slack in-app webviews.

---

## 4. Core Modules & Implemented Features

### 🕒 Module 1: Daily Time Record (DTR) Terminal (Sprout HR Style)
- **Official Live Date & Wall Clock:** Real-time Philippine Date & Clock (`09:00:00 AM`).
- **Streamlined 3-Box Timelog Metric Grid:**
  1. 📥 **Time IN**: Exact punch-in timestamp with `✏️ Edit` option.
  2. 📤 **Time OUT**: Exact punch-out timestamp with `✏️ Edit` option (allows reopening accidental timeouts).
  3. ⏱️ **Rendered Hours**: Net working hours computed accurately.
- **Default Work Mode:** Set to **🏢 Office (Onsite)** upon startup.
- **Accidental Timeout Recovery:** Users or admin can adjust `Time OUT` or remove premature timeouts; shifting back to active working status automatically resumes shift rendering.
- **Top Header & Navigation:**
  - Fully responsive on all laptop viewports (1280px–1920px) and mobile screens.
  - Prominent red **`Logout`** button, Profile Switcher, **`PIN`**, and Theme toggle remain 100% visible on screen without requiring browser zoom-out (`Ctrl + Down`).

### 📁 Module 2: PayDay Application Center
- **Certificate of Attendance (COA):** File for missed punches caused by CDO power/internet disruptions with 1-click manager approval.
- **Schedule Adjustment & WFH:** File remote work notifications.
- **Official Business (OB):** File for client fieldwork and offsite setups.

### 🎛️ Module 3: Admin Feature Sliders & Policy Control
- Modular toggle switches: Paid Leave Credits (Default: OFF), Overtime Filing, Undertime Filing, COA Disputes, Forex Ticker, and Holiday Calendar.

### 🌴 Module 4: Philippine & Cagayan de Oro (CDO) Holidays Center
- Full 2026 Holiday Calendar including CDO City Fiesta (`Jan 10`), CDO Charter Day (`June 15`), and Higalaay Festival (`Aug 28`).

### 📊 Module 5: Timesheets & Real-Time Dual Currency ($ USD ⇄ ₱ PHP)
- Live Forex Ticker ($1 USD = ₱58.50 PHP) + instant gross pay calculation.
- 1-Page Printable Executive Payslip slip with dual signatures.

---

## 5. How to Resume After Laptop Restart / Shutdown

### 🌐 Option 1: Live Cloud Production Web App (No Local Setup Required)
Open any browser on laptop, tablet, or mobile:
👉 **`https://diverse-ideas-attendance.vercel.app`**
- **Operations Manager / Tefanny:** Unlock with PIN **`1410`**.
- **Developers:**
  - Cyreh Bayson: **`7532`**
  - Ella Ibañez: **`1598`**
  - Abner Nalugon: **`5478`**
  - Jason Jeff Velasquez: **`9654`**

### 💻 Option 2: Local Development Server (Offline / Local Wi-Fi)
When restarting your laptop:
1. Open PowerShell in `c:\Users\USER\Documents\Programming Folder Rep\Diverse Ideas GMBH`
2. Start the local server:
   ```powershell
   node server.js
   ```
3. Open in browser:
   - Laptop: `http://localhost:3000`
   - Mobile on same Wi-Fi: `http://<your-laptop-ip>:3000`

### 🚀 Option 3: Deploying New Updates
To commit and deploy code changes to Vercel production:
```powershell
node -c js/state.js; node -c js/attendance.js; node -c js/payroll.js; node -c js/export.js; node -c js/app.js
git add .
git commit -m "feat: your change summary"
git push origin main
```
*Vercel automatically builds and goes live within ~15 seconds.*

---

## 6. What's Next to Do (Roadmap for Future Sessions)

1. **📱 Real-World Mobile Monitoring:**
   - Verify punch consistency across various mobile devices (Android Chrome, iOS Safari, Samsung Internet).
2. **📄 Automated Payroll & Timesheet Exports:**
   - Add single-click multi-employee bi-weekly payroll export to CSV/Excel for accounting.
   - Include auto-calculated breakdown of daily hours, projects, and gross pay in both USD and PHP.
3. **🔔 Scheduled Shift Notifications / Reminders:**
   - Optional browser notifications for clock-in at 09:00 AM and clock-out at 05:00 PM.
4. **📶 Offline PWA / Service Worker Capabilities:**
   - Cache static assets so the app opens instantly offline and queues punches if mobile data drops temporarily.
5. **🛡️ WebAuthn / Biometric Login Option:**
   - Optional fingerprint / FaceID sensor integration for instant mobile employee unlock without typing 4-digit PIN.

---

## 7. Critical Guidelines for Future AI Sessions
1. **Always Validate & Push to Main:** Run `node -c` on JavaScript files before pushing to `origin main`.
2. **Non-Blocking Mobile Geofencing:** Keep `strictGeofence: false` and flexible radius buffers so employees indoors are never blocked.
3. **Hourly Compensation Model:** Short pauses are paid; shift duration is based on Time IN to Time OUT.
4. **Confidentiality:** Individual developer compensation rates and company totals remain locked behind Master PIN `1410`.
5. **Responsive Header Integrity:** Keep `.header-actions` and `#btn-logout` pinned with `flex-shrink: 0` so they never overflow past the right viewport edge.
