# DevTrack: Developer Attendance, Time Off & Enterprise Payroll System
**Company:** Diverse Ideas GMBH  
**Repository:** [github.com/jasonvelasquez1410/diverse-ideas-attendance](https://github.com/jasonvelasquez1410/diverse-ideas-attendance)  
**Live Production URL:** [diverse-ideas-attendance.vercel.app](https://diverse-ideas-attendance.vercel.app)  
**Last Updated:** September 20, 2026

---

## 1. Project Overview & Company Policy

DevTrack is an in-house **Time & Attendance, Daily Time Record (DTR), Time Off & Holidays, and Confidential Dual-Currency Payroll Dashboard** built specifically for the developer team at **Diverse Ideas GMBH**, combining the best workflows from **Jibble** and **Sprout HR / PayDay Solutions**.

### ⚖️ Compensation Model: "No Work, No Pay" (Hourly Rated)
- **Policy Directive:** Per management (Tefanny), all developer compensation operates strictly on a **"No Work, No Pay"** hourly basis.
- **Direct Hourly Wages:** Gross earnings are computed directly from actual logged billable hours recorded by the DTR terminal.
- **Simplified Punches (No Break / Lunch Docking):** The DTR terminal tracks **Time IN** and **Time OUT** directly. Short pauses remain fully paid without dockings.
- **Paid Leave Tracking Disabled by Default:** Because staff are compensated per hour worked, paid leave balances (VL, SL, EL) are disabled by default to eliminate confusion and unnecessary paperwork.
- **Emergency / Missed Punch Resolution:** Staff use **Certificate of Attendance (COA)** to file time adjustments for missed punches caused by brownouts or internet cuts.
- **Modular Admin Control:** Admin can re-enable paid leave credits, overtime forms, or undertime filing at any time via the **🎛️ Feature Sliders & Policy** center.

### 🏢 Hybrid Work Schedule & Targets
- **Shift Hours:** `09:00 AM – 05:00 PM` (17:00) / Flexible 8-to-9 hour span
- **Default Schedule:** 
  - 🏠 **Mondays / Designated Remote Days (e.g. Tuesday WFH):** Work From Home
  - 🏢 **Tuesdays – Fridays:** Onsite Office (Kauswagan CDO Office)
- **Weekly Target Commitment:** 35 hours minimum / 45 hours maximum per week.
- **Saturday Policy:** Rest Day / Optional (Walay pugsanay — voluntary, no forced weekend work).

---

## 2. Real Team Credentials & Access Codes

| Employee ID | Employee Name | Role | Hourly Rate | Default PIN | Policy Status | Access Level |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `dev-1` | **BAYSON, Cyreh** | Junior Software Developer | $5.00 / hr | **`7532`** | Hourly (No Work, No Pay) | Personal DTR & Attendance |
| `dev-2` | **IBANEZ, Ella** | Junior Software Developer | $5.00 / hr | **`1598`** | Hourly (No Work, No Pay) | Personal DTR & Attendance |
| `dev-3` | **NALUGON, Abner** | Senior Software Developer | $18.00 / hr | **`5478`** | Hourly (No Work, No Pay) | Personal DTR & Attendance |
| `dev-4` | **VELASQUEZ, Jason Jeff** | Senior Software Developer | $12.00 / hr | **`9654`** | Hourly (No Work, No Pay) | Personal DTR & Attendance |
| `admin-1` | **Administrator / Tefanny** | Operations Manager | *Executive* | **`9999`** | *Master Privileges* | **Full Admin Master Access** |

> 📌 **Note:** All PINs can be changed by developers themselves via the `🔑 PIN` button in the header or managed by Admin in Settings.

---

## 3. Physical Office Location & GPS Geofencing

### 📍 Office Specifications
- **Address:** `FJWH+V8J, Kauswagan, Cagayan De Oro City, Misamis Oriental` (Zamuco Apartments, Kauswagan CDO)
- **Coordinates:** Latitude: `8.502213`, Longitude: `124.643890`
- **Geofence Radius:** `750 meters` (with dynamic device accuracy tolerance `userAccuracy` buffer to prevent indoor mobile GPS drift false alarms).
- **Enforcement:** Onsite clock-in verifies device coordinates within the geofence perimeter. Remote / WFH and Saturday clock-ins do not require GPS proximity.

### 📱 Mobile Geolocation Architecture
- **Dual-Stage GPS Engine:**
  - *Stage 1:* High accuracy satellite GPS request (7s timeout).
  - *Stage 2 (Automatic Fallback):* Rapid Cellular / Wi-Fi network positioning fallback (eliminates indoor mobile timeouts).
- **Interactive Help Modal (`#modal-location-help`):**
  - Explains step-by-step how to enable browser permissions on Android (Chrome) and iPhone (Safari).
  - Direct **`[ 📍 Prompt / Enable GPS on this Phone ]`** button that triggers native browser permissions on tap.
  - Direct **`[ 🏠 Working Remote? Switch to WFH ]`** option for remote employees.
  - Detects In-App Webviews (Viber / Messenger / Slack) and instructs staff to tap `⋮` $\rightarrow$ "Open in Chrome/Safari".

---

## 4. Core Modules & Implemented Features

### 🕒 Module 1: Daily Time Record (DTR) Terminal (Sprout HR Style)
- **Official Live Date & Wall Clock:** Real-time Philippine Date & Clock (`09:00:00 AM`).
- **Streamlined 3-Box Timelog Metric Grid:**
  1. 📥 **Time IN**: Exact punch-in timestamp with `✏️ Edit` option.
  2. 📤 **Time OUT**: Exact punch-out timestamp with `✏️ Edit` option (allows reopening accidental timeouts).
  3. ⏱️ **Rendered Hours**: Net working hours computed accurately.
- **Accidental Timeout Recovery:** Users or admin can adjust `Time OUT` or remove premature timeouts; shifting back to active working status automatically resumes shift rendering.
- **Big Action Buttons:**
  - `[ 📥 Time IN (Clock In) ]` $\rightarrow$ Opens touch-friendly Mode Picker (`🏢 Onsite`, `🏠 WFH`, `🛌 Saturday Rest Day`).
  - `[ 📤 Time OUT (Clock Out) ]`.
- **Top Header & Navigation:**
  - Fully responsive on all laptop viewports (1280px–1920px).
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
- **Operations Manager / Tefanny:** Unlock with PIN **`9999`**.
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

## 6. Critical Guidelines for Future AI Sessions
1. **Always Validate & Push to Main:** Run `node -c` on JavaScript files before pushing to `origin main`.
2. **Strict Geofencing with Buffer:** Office coordinates: `8.502213, 124.643890` with 750m buffer and fallback for indoor Wi-Fi/cellular. WFH/Saturday modes bypass geofence.
3. **Hourly Compensation Model:** Short pauses are paid; shift duration is based on Time IN to Time OUT.
4. **Confidentiality:** Individual developer compensation rates and company totals remain locked behind Master PIN `9999`.
5. **Responsive Header Integrity:** Keep `.header-actions` and `#btn-logout` pinned with `flex-shrink: 0` so they never overflow past the right viewport edge.

