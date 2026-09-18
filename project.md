# DevTrack: Developer Attendance, Time Off & Enterprise Payroll System
**Company:** Diverse Ideas GMBH  
**Repository:** [github.com/jasonvelasquez1410/diverse-ideas-attendance](https://github.com/jasonvelasquez1410/diverse-ideas-attendance)  
**Live Production URL:** [diverse-ideas-attendance.vercel.app](https://diverse-ideas-attendance.vercel.app)  
**Last Updated:** September 19, 2026

---

## 1. Project Overview & Company Policy

DevTrack is an in-house **Time & Attendance, Daily Time Record (DTR), Time Off & Holidays, and Confidential Dual-Currency Payroll Dashboard** built specifically for the developer team at **Diverse Ideas GMBH**, combining the best workflows from **Jibble** and **Sprout HR / PayDay Solutions**.

### ⚖️ Compensation Model: "No Work, No Pay" (Hourly Rated)
- **Policy Directive:** Per management (Tefanny), all developer compensation operates strictly on a **"No Work, No Pay"** hourly basis.
- **Direct Hourly Wages:** Gross earnings are computed directly from actual logged billable hours recorded by the DTR terminal.
- **Paid Leave Tracking Disabled by Default:** Because staff are compensated per hour worked, paid leave balances (VL, SL, EL) are disabled by default to eliminate confusion and unnecessary paperwork.
- **Emergency / Missed Punch Resolution:** Staff use **Certificate of Attendance (COA)** to file time adjustments for missed punches caused by brownouts or internet cuts.
- **Modular Admin Control:** Admin can re-enable paid leave credits, overtime forms, or undertime filing at any time via the **🎛️ Feature Sliders & Policy** center.

### 🏢 Hybrid Work Schedule & Targets
- **Shift Hours:** `09:00 AM – 05:00 PM` (17:00) / Flexible 9-hour span
- **Default Schedule:** 
  - 🏠 **Mondays / Designated Remote Days (e.g. Tuesday WFH):** Work From Home
  - 🏢 **Tuesdays – Fridays:** Onsite Office (Kauswagan CDO Office)
- **Weekly Target Commitment:** 35 hours minimum / 45 hours maximum per week.
- **Saturday Policy:** Rest Day / Optional (Walay pugsanay — voluntary, no forced weekend work).
- **Meal & Rest Breaks Policy:**
  - ☕ **Short Pauses (5–15 mins coffee, water, stretching, restroom):** **PAID** working time. Staff stay clocked in without docking their pay.
  - 🍱 **Lunch (1 Hour):** **UNPAID** meal break. Tracked via **`🍱 Start Lunch`** $\rightarrow$ **`▶ End Lunch (Resume)`** to pause the shift timer during lunch.

---

## 2. Real Team Credentials & Access Codes

| Employee Name | Role | Hourly Rate | Default PIN | Policy Status | Access Level |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **BAYSON, Cyreh** | Junior Software Developer | $5.00 / hr | **`7532`** | Hourly (No Work, No Pay) | Personal DTR & Attendance |
| **IBANEZ, Ella** | Junior Software Developer | $5.00 / hr | **`1598`** | Hourly (No Work, No Pay) | Personal DTR & Attendance |
| **NALUGON, Abner** | Senior Software Developer | $18.00 / hr | **`5478`** | Hourly (No Work, No Pay) | Personal DTR & Attendance |
| **VELASQUEZ, Jason Jeff** | Senior Software Developer | $12.00 / hr | **`9654`** | Hourly (No Work, No Pay) | Personal DTR & Attendance |
| **Administrator / Tefanny** | Operations Manager | *Executive* | **`9999`** | *Master Privileges* | **Full Admin Master Access** |

> 📌 **Note:** All PINs can be changed by developers themselves via the `🔑 Change PIN` button or managed by Admin in Settings.

---

## 3. Physical Office Location & GPS Geofencing

### 📍 Office Specifications
- **Address:** `FJWH+V8J, Kauswagan, Cagayan De Oro City, Misamis Oriental` (Zamuco Apartments, Kauswagan CDO)
- **Coordinates:** Latitude: `8.502213`, Longitude: `124.643890`
- **Geofence Radius:** `250 meters`
- **Enforcement:** **Strict GPS Geofence**. Onsite clock-in strictly verifies device coordinates within 250m so management has 100% accurate physical verification.

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
- **4-Box DTR Timelog Metric Grid:**
  1. 📥 **Time IN**: Exact punch-in timestamp (e.g. `09:00:15 AM`).
  2. 🍱 **Lunch Time (1 hr)**: Meal interval tracker (e.g. `12:00 PM – 01:00 PM / 60m`).
  3. 📤 **Time OUT**: Exact punch-out timestamp (e.g. `05:00:10 PM`).
  4. ⏱️ **Rendered Hours**: Net working hours (e.g. `8.00 hrs`).
- **Big Action Buttons:**
  - `[ 📥 Time IN (Clock In) ]` $\rightarrow$ Opens touch-friendly Mode Picker (`🏢 Onsite`, `🏠 WFH`, `🛌 Saturday Rest Day`).
  - `[ 🍱 Start Lunch ]` $\rightarrow$ Flips to green `[ ▶ End Lunch (Resume) ]` when eating.
  - `[ 📤 Time OUT (Clock Out) ]`.
- **Admin Direct Staff Selector:** Dropdown on Card 1 allowing Admin/Tefanny to switch and inspect any employee's attendance logs instantly.
- **Top Header:** Responsive layout with red **`Logout`** button adjacent to the profile badge on all screen sizes.

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

### A. Accessing the Live Production Web App
Open any browser on laptop, tablet, or phone:
🌐 **`https://diverse-ideas-attendance.vercel.app`**
- Operations Manager / Tefanny unlocks with PIN **`9999`**.
- Developers unlock with their 4-digit PINs (**`7532`**, **`1598`**, **`5478`**, **`9654`**).

### B. Starting the Local Development Server
When restarting your laptop or working offline on local Wi-Fi:
1. Open PowerShell in `c:\Users\USER\Documents\Programming Folder Rep\Diverse Ideas GMBH`
2. Run:
   ```powershell
   node server.js
   ```
3. Open `http://localhost:3000` (or `http://<local-ip>:3000` on phone/laptop on same Wi-Fi).

### C. Git Deployment Workflow
Every change pushed to `main` automatically deploys to Vercel within 15 seconds:
```powershell
node -c js/state.js js/attendance.js js/payroll.js js/export.js js/app.js
git add .
git commit -m "feat: description of changes"
git push origin main
```

---

## 6. Critical Guidelines for Future AI Sessions
1. **Always Push Changes to Main:** Every update MUST be validated with `node -c`, committed, and pushed to `origin main`.
2. **Strict Geofencing:** Do not bypass GPS on Onsite clock-in; ensure dual-stage GPS with network fallback is used and employees have the WFH option for remote shifts.
3. **Hourly Compensation & Lunch Only:** Short coffee pauses remain paid. Only 1-hour lunch is deducted.
4. **Confidentiality:** Developer rates and company totals remain locked behind Master PIN `9999`.
5. **No Layout Overflow:** Keep header and buttons compact and responsive across mobile, tablet, and laptop screens.
