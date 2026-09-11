# DevTrack: Developer Attendance, Time Off & Enterprise Payroll System
**Company:** Diverse Ideas GMBH  
**Repository:** [github.com/jasonvelasquez1410/diverse-ideas-attendance](https://github.com/jasonvelasquez1410/diverse-ideas-attendance)  
**Live Production URL:** [diverse-ideas-attendance.vercel.app](https://diverse-ideas-attendance.vercel.app)  
**Last Updated:** September 11, 2026

---

## 1. Project Overview & Work Schedule

DevTrack is an in-house **Time & Attendance, Daily Time Record (DTR), Time Off & Holidays, and Confidential Dual-Currency Payroll Dashboard** built specifically for the developer team at **Diverse Ideas GMBH**, combining the best workflows from **Jibble** and **Sprout HR / PayDay Solutions**.

### 🏢 Hybrid Work Schedule
- **Mondays:** 🏠 **Work From Home (WFH)** (System auto-defaults to WFH on Mondays)
- **Tuesdays – Fridays:** 🏢 **Onsite Office** (System auto-defaults to Onsite)
- **Standard Shift Hours:** 8:00 AM – 5:00 PM (Configurable in Settings)

---

## 2. DevTrack vs. Jibble: Comparative Analysis

| Feature Area | Jibble.io | DevTrack (Diverse Ideas) | Advantage |
| :--- | :--- | :--- | :--- |
| **Real-Time Dual Currency ($ USD ⇄ ₱ PHP)** | ❌ Single currency only | 🟢 **Live Auto-Forex Ticker ($1 USD = ₱58.50 PHP)** + Instant Gross & Payslip Conversion | **DevTrack** (Zero manual math for Philippine payouts) |
| **Confidential Rate Security** | ⚠️ Complex permission tiers | 🟢 **PIN-based developer isolation (`1234`–`4567`) + Admin Master Lock (`9999`)** | **DevTrack** (Confidential developer rates across all views) |
| **Certificate of Attendance (COA) Dispute** | ❌ Basic timesheet edits | 🟢 **Full Sprout HR COA missed-punch dispute workflow** | **DevTrack** (Exact reason logging & 1-click approvals) |
| **1-Page Printable Payslip Slip** | ⚠️ Multi-page PDF exports | 🟢 **Executive 1-page A4 printout with dual signatures & USD/PHP totals** | **DevTrack** (Clean 1-sheet physical / PDF printouts) |
| **Time Off & Custom Holiday Creation** | 🟢 Built-in | 🟢 **Full Leave Credits + Custom Holiday Manager & 2026 Philippine Calendar** | **Tied** |
| **Categorized Enterprise Settings** | 🟢 Sub-tab navigation | 🟢 **Modular 5-Pane Settings (Org, Schedules, People, Projects, Backups)** | **Tied** |
| **Pricing & Recurring Fees** | ❌ $3.99 – $9.99/user/mo | 🟢 **100% Free / Self-Hosted / Zero Recurring Costs** | **DevTrack** (Lifetime ownership) |

---

## 3. Implemented Modules & Features

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
1. 📝 **Certificate of Attendance (COA):** File for missed login/logout with dispute punch time for manager approval.
2. 🌴 **Leave:** Apply for Vacation Leave (VL), Sick Leave (SL), Emergency Leave (EL), or Bereavement Leave.
3. ⏰ **Overtime (OT):** Request pre-shift, post-shift, or rest day overtime hours.
4. ⏱️ **Undertime (UT):** Request early shift departure.
5. 💼 **Official Business (OB):** File for client fieldwork and offsite setups.
6. 🔄 **Schedule Adjustment:** Request shift or work location changes.

### 🌴 Module 3: Time Off & Holidays Management Center (Jibble Style)
- **Leave Credit Balances:** Real-time tracking of Vacation (VL), Sick (SL), and Emergency (EL) balances.
- **Custom Holiday Creator (`+ Add Holiday`):** Allows admins to add company holidays, local holidays, and regional non-working days.
- **Holidays & Work Calendar Grid:** Displays upcoming 2026 Philippine regular holidays and custom company events with 1-click deletion for custom holidays.
- **Applications & Approvals Table:** Complete record of all filed leave, COA, and overtime requests with instant 1-click Approve / Reject actions for Admin.

### ⚙️ Module 4: Enterprise Settings Center (Jibble Multi-Category Layout)
Categorized into 5 dedicated sub-views:
1. 🏢 **Organization Profile:** Company legal name, industry, headquarters address, tax ID, and payslip voucher prefix (`DIV`).
2. ⏰ **Work Schedules & Hybrid Rules:** Shift start/end times (`08:00` - `17:00`), designated WFH days (e.g., `Monday`), and grace period in minutes.
3. 👥 **People & Pay Rates:** Developer roster, hourly wages, 4-digit PINs, leave allocations, Run Payslip action, and Edit Profile modal.
4. 📁 **Projects & Activities:** Client project codes and tags (`DICP`, `JETZ`, `ACCT`, `MOBI`, `TOOL`) developers can clock into.
5. 💾 **Database & Backups:** JSON database backup download, JSON restore from file, and factory demo data reset.

### 🔒 Module 5: Rate Confidentiality & PIN Access Security
- **Confidential Rates:** No developer can see another developer's hourly wage or earnings. All dollar amounts are hidden on public and team views.
- **Private 4-Digit PIN Access:** Every developer enters their private PIN to unlock their personal DTR and timesheet.
- **Admin Master PIN (`9999`):** Unlocks full company-wide payroll, rate configurations, and manager approvals.
- **Header Lock Button (`🔒`):** 1-click lock before stepping away from desk.

### 📊 Module 6: Timesheets, Payday Analytics & Real-Time PHP (₱) Conversion
- **Live Real-Time USD ⇄ PHP Forex Ticker:** Auto-fetches live exchange rates (`1 USD = ₱58.50 PHP`) from public forex APIs with 1-click sync and custom manual override.
- **Dual-Currency Analytics Cards:** Displays Total Gross Payroll and Average Effective Rate in both **$ USD** and converted **₱ PHP** side-by-side (`$687.00 ≈ ₱40,189.50 PHP`).
- **Bottom Real-Time Computation & PHP Summary Card:** Dedicated computation summary calculating gross USD, converted gross PHP, hourly average in PHP, and developer-by-developer converted wage breakdowns ready for Philippine bank / GCash disbursement.
- **Attendo-Inspired Official Digital Payslip Voucher Modal:**
  - Executive company header with Diverse Ideas GMBH branding and voucher tracking ID.
  - Complete employee details, work period, and active conversion rate note.
  - Itemized project earnings in both USD and PHP.
  - Large net payable wage highlight banner (`$687.00 USD ≈ ₱40,189.50 PHP`).
  - Dual approval signature acknowledgment lines.
  - Strictly **1 single page** print voucher.
- **Enhanced CSV Export:** Generates spreadsheets containing Net Hours, USD Rate, USD Gross Pay, PHP Rate, PHP Gross Pay, and Exchange Rate columns.

---

## 4. Team Credentials & Access Codes

| Name | Role | Currency & Rate | Default PIN | Default Leave Credits |
| :--- | :--- | :--- | :---: | :---: |
| **Alex Rivera** | Lead Full-Stack Dev | $35.00 / hr | **`1234`** | 12 VL / 10 SL / 5 EL |
| **Maria Santos** | Senior Frontend Engineer | $28.00 / hr | **`2345`** | 15 VL / 10 SL / 5 EL |
| **Kenji Takahashi** | Backend Systems Engineer | $30.00 / hr | **`3456`** | 10 VL / 8 SL / 5 EL |
| **Chloe Gomez** | UI/UX & QA Specialist | $22.00 / hr | **`4567`** | 14 VL / 10 SL / 5 EL |
| **Administrator** | Management Mode | *Full Access* | **`9999`** | *Manager Privileges* |

---

## 5. File Structure

```
Diverse Ideas GMBH/
├── assets/
│   ├── logo.png          # High-resolution custom DevTrack brand logo
│   └── favicon.png       # Browser tab favicon
├── index.html            # Master SPA layout (DTR Terminal, My Stuff, Time Off, Payroll, Settings)
├── css/
│   ├── style.css         # Attendo light design system tokens, typography, dark/light themes
│   └── components.css    # Sprout PayDay cards, Settings subnav, 1-page payslip print styles
├── js/
│   ├── state.js          # Persistent store, PIN auth, org profile, schedules, holidays
│   ├── attendance.js     # Exact punch timestamp engine, breaks, live calculation
│   ├── payroll.js        # Timesheet aggregation, wage calculation, date filtering
│   ├── export.js         # CSV generator and printable payroll slips
│   └── app.js            # UI coordinator, settings subtabs, holiday modal, approval workflow
├── server.js             # Zero-dependency local network server (Wi-Fi sharing)
├── start.bat             # 1-click Windows server launcher
├── vercel.json           # Vercel deployment configuration
├── netlify.toml          # Netlify configuration
├── package.json          # Node scripts and metadata
└── project.md            # Comprehensive project documentation (This file)
```

---

## 6. How to Run Locally or Deploy After Laptop Restart

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
