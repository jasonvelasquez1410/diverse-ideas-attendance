# DevTrack: Developer Attendance & Sprout PayDay System
**Company:** Diverse Ideas GMBH  
**Repository:** [github.com/jasonvelasquez1410/diverse-ideas-attendance](https://github.com/jasonvelasquez1410/diverse-ideas-attendance)  
**Live Production URL:** [diverse-ideas-attendance.vercel.app](https://diverse-ideas-attendance.vercel.app)  
**Last Updated:** September 11, 2026

---

## 1. Project Overview & Work Schedule

DevTrack is an in-house **Time & Attendance, Daily Time Record (DTR), Leaves, and Confidential Payroll Dashboard** built specifically for the developer team at **Diverse Ideas GMBH**, cloned and modeled after the **Sprout HR / PayDay Solutions** enterprise suite.

### 🏢 Hybrid Work Schedule
- **Mondays:** 🏠 **Work From Home (WFH)** (System auto-defaults to WFH on Mondays)
- **Tuesdays – Fridays:** 🏢 **Onsite Office** (System auto-defaults to Onsite)
- **Standard Shift Hours:** 8:00 AM – 5:00 PM (or 9:00 AM – 5:00 PM flexi)

---

## 2. Implemented Modules & Features

### 🕒 Module 1: Daily Time Record (DTR) Terminal (Sprout HR Style)
- **Official Live Date & Wall Clock:** Real-time Philippine Date & Clock (`Friday, September 11, 2026 • 08:00:00 AM`) — *No counting stopwatch ticker*.
- **4-Box DTR Timelog Grid:**
  1. 📥 **Time IN**: Exact punch-in timestamp (e.g. `08:30:15 AM`).
  2. ☕ **Break Time**: Scheduled lunch/rest intervals (e.g. `12:00 PM – 01:00 PM / 60m`).
  3. 📤 **Time OUT**: Exact punch-out timestamp (e.g. `05:00:10 PM`).
  4. ⏱️ **Rendered Hours**: Net hours worked today (e.g. `8.00 hrs`).
- **Big Action Buttons:** `[ 📥 Time IN (Clock In) ]`, `[ ☕ Start Break / End Break ]`, `[ 📤 Time OUT (Clock Out) ]`.
- **Project & Work Notes:** Tag time to active client/internal projects with daily work descriptions.

### 📁 Module 2: PayDay "My Stuff" & Application Center
Cloned from the official Sprout PayDay Employee Dashboard with the **`[ Apply ⌵ ]`** dropdown:
1. 📝 **Certificate of Attendance (COA):** File for missed login/logout (e.g., forgot to punch, internet/power outage) with dispute punch time for manager approval.
2. 🌴 **Leave:** Apply for Vacation Leave (VL), Sick Leave (SL), Emergency Leave (EL), or Bereavement Leave.
3. ⏰ **Overtime (OT):** Request pre-shift, post-shift, or rest day overtime hours.
4. ⏱️ **Undertime (UT):** Request early shift departure.
5. 💼 **Official Business (OB):** File for client fieldwork and offsite setups.
6. 🔄 **Schedule Adjustment:** Request shift or work location changes.
- **Leave Credit Balances:** Real-time counters for Vacation, Sick, and Emergency days.
- **PayDay Attendance Notice Banner:** Notification regarding cutoff and timesheet locking.

### 🔒 Module 3: Rate Confidentiality & PIN Access Security
- **Confidential Rates:** No developer can see another developer's hourly wage or earnings. All dollar amounts are hidden on public and team views.
- **Private 4-Digit PIN Access:** Every developer enters their private PIN to unlock their personal DTR and timesheet.
- **Admin Master PIN (`9999`):** Unlocks full company-wide payroll, rate configurations, and manager approvals.
- **Header Lock Button (`🔒`):** 1-click lock before stepping away from desk.

### ✏️ Module 4: Admin Employee Profile Management
Admins can click **`✏️ Edit Profile`** on any employee in the *Team & Rates* tab to edit:
- Full Name
- Role / Job Title
- Email Address
- Currency (`$`, `₱`, `€`, `£`) & Hourly Rate
- Private 4-Digit Access PIN
- Vacation, Sick, and Emergency Leave Credits allocation

### 👥 Module 5: Live Team Attendance Board
- Real-time team roster presence cards (🟢 Working, 🟡 On Break, ⚪ Offline).
- Displays active work mode (🏠 WFH / 🏢 Onsite) and current active project.

### 📊 Module 6: Timesheets, Payday Analytics & Real-Time PHP (₱) Conversion
- **Live Real-Time USD ⇄ PHP Forex Ticker:** Auto-fetches live exchange rates (`1 USD = ₱58.50 PHP`) from public forex APIs with 1-click sync and custom manual override so management never needs to compute manually.
- **Dual-Currency Analytics Cards:** Displays Total Gross Payroll and Average Effective Rate in both **$ USD** and converted **₱ PHP** side-by-side (`$687.00 ≈ ₱40,189.50 PHP`).
- **Dual-Currency Timesheet Table Rows:** Shows hourly rate and total earnings in both currencies (`$35.00 ≈ ₱2,047.50` / `$245.00 ≈ ₱14,332.50`).
- **Bottom Real-Time Computation & PHP Summary Card:** Dedicated computation summary drawer calculating gross USD, converted gross PHP, hourly average in PHP, and developer-by-developer converted wage breakdowns ready for Philippine bank / GCash disbursement.
- **Attendo-Inspired Official Digital Payslip Voucher Modal:**
  - Official company header with Diverse Ideas GMBH branding and voucher tracking ID.
  - Complete employee details, work period, and active conversion rate note.
  - Itemized project earnings in both USD and PHP.
  - Large net payable wage highlight banner (`$687.00 USD ≈ ₱40,189.50 PHP`).
  - Dual approval signature acknowledgment lines.
  - 1-click **Print Official Payslip Slip** supporting standard office printers and PDF exports.
- **Enhanced CSV Export:** Generates spreadsheets containing Net Hours, USD Rate, USD Gross Pay, PHP Rate, PHP Gross Pay, and Exchange Rate columns.

### 🇵🇭 Module 7: Philippine Holidays Calendar
- Integrated widget displaying 2026 Philippine Regular and Special Non-Working Holidays.

---

## 3. Team Credentials & Access Codes

| Name | Role | Currency & Rate | Default PIN | Default Leave Credits |
| :--- | :--- | :--- | :---: | :---: |
| **Alex Rivera** | Lead Full-Stack Dev | $35.00 / hr | **`1234`** | 12 VL / 10 SL / 5 EL |
| **Maria Santos** | Senior Frontend Engineer | $28.00 / hr | **`2345`** | 15 VL / 10 SL / 5 EL |
| **Kenji Takahashi** | Backend Systems Engineer | $30.00 / hr | **`3456`** | 10 VL / 8 SL / 5 EL |
| **Chloe Gomez** | UI/UX & QA Specialist | $22.00 / hr | **`4567`** | 14 VL / 10 SL / 5 EL |
| **Administrator** | Management Mode | *Full Access* | **`9999`** | *Manager Privileges* |

---

## 4. File Structure

```
Diverse Ideas GMBH/
├── index.html            # Master SPA layout (DTR Terminal, My Stuff, Leaves, Payroll, Admin)
├── css/
│   ├── style.css         # Design system tokens, glassmorphism, dark/light themes
│   └── components.css    # Sprout PayDay cards, DTR 4-box deck, My Stuff dropdown, modals
├── js/
│   ├── state.js          # Persistent store, PIN auth, requests, leave credits, holidays
│   ├── attendance.js     # Exact punch timestamp engine, breaks, live calculation
│   ├── payroll.js        # Timesheet aggregation, wage calculation, date filtering
│   ├── export.js         # CSV generator and printable payroll slips
│   └── app.js            # UI coordinator, Sprout widgets, modals, approval workflow
├── server.js             # Zero-dependency local network server (Wi-Fi sharing)
├── start.bat             # 1-click Windows server launcher
├── vercel.json           # Vercel deployment configuration
├── netlify.toml          # Netlify configuration
├── firebase.json         # Firebase configuration
├── .firebaserc           # Firebase project linkage
├── package.json          # Node scripts and metadata
└── project.md            # Comprehensive project documentation (This file)
```

---

## 5. How to Run Locally or Deploy After Laptop Restart

### A. Accessing the Live Web App (Any Device / Home / Office)
Simply open the live Vercel URL in any browser:
🌐 **`https://diverse-ideas-attendance.vercel.app`**

### B. Running Locally (Offline / Local Wi-Fi Network)
1. Open this folder: `c:\Users\USER\Documents\Programming Folder Rep\Diverse Ideas GMBH`
2. Double click **`start.bat`** (or open terminal and run `node server.js`).
3. Open `http://localhost:3000` in your browser.
4. Other laptops on the same office Wi-Fi can open `http://<your-ip>:3000`.

### C. Updating and Pushing Changes
Whenever code is updated:
```bash
git add .
git commit -m "Your update description"
git push origin main
```
*Vercel will automatically re-deploy in ~10 seconds.*
