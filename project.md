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

### 🌴 Module 3: Time Off, Philippine & Cagayan de Oro (CDO) Holidays Center
- **Full 2026 Philippine & Cagayan de Oro (CDO) Holiday Calendar:**
  - **National Regular Holidays:** New Year's Day, Maundy Thursday, Good Friday, Araw ng Kagitingan, Labor Day, Independence Day, National Heroes Day, Bonifacio Day, Christmas Day, Rizal Day.
  - **National Special Non-Working:** Chinese New Year, EDSA Anniversary, Black Saturday, Ninoy Aquino Day, All Saints' Day, All Souls' Day, Feast of the Immaculate Conception, Christmas Eve, New Year's Eve.
  - **Cagayan de Oro (CDO) Local Non-Working Holidays:**
    - `June 15`: **Cagayan de Oro Charter Day** (Official City Charter Anniversary)
    - `August 28`: **Higalaay Festival & Feast of St. Augustine** (CDO Patronal Feast Day)
    - `January 10`: **Cagayan de Oro City Fiesta**
- **Smart Quick Holiday Preset Dropdown (`+ Add Holiday`):** 1-click template selector for CDO local holidays, PH national holidays, and Diverse Ideas company events.
- **Leave Credit Balances:** Real-time tracking of Vacation (VL), Sick (SL), and Emergency (EL) balances.
- **Applications & Approvals Table:** Complete record of all filed leave, COA, and overtime requests with instant 1-click Approve / Reject actions for Admin.

### ⚙️ Module 4: Enterprise Settings Center (Jibble Multi-Category Layout)
Categorized into 6 dedicated sub-views:
1. 🏢 **Organization Profile:** Company legal name, industry, headquarters address, tax ID, and payslip voucher prefix (`DIV`).
2. ⏰ **Work Schedules & Hybrid Rules:** Shift start/end times (`08:00` - `17:00`), designated WFH days (e.g., `Monday`), and grace period in minutes.
3. 👥 **People & Pay Rates:** Developer roster, hourly wages, 4-digit PINs, leave allocations, Run Payslip action, and Edit Profile modal.
4. 📁 **Projects & Activities (Full Admin CRUD):**
   - **Create New Project (`+ New Project`):** Set project code, full name, description, and initial active status.
   - **Edit Project (`✏️ Edit`):** Update project names, codes, descriptions, and toggle active/archived status.
   - **Delete Project (`🗑️ Delete`):** Admin-only removal with confirmation prompt.
5. 💾 **Database & Backups:** JSON database backup download, JSON restore from file, and factory demo data reset.
6. 📖 **Admin Guide & Tutorials:** Embedded interactive onboarding tutorial suite for Operations Manager with step-by-step guides, live PIN cheat sheet, and 1-click invitation text copy.
7. 🚀 **Staff Onboarding Modal & Quick Share:** Pre-written WhatsApp/Slack onboarding invite templates with staff login PINs, role, and custom portal URL ready to send to team members.

### 📖 Module 7: In-App Manager Guide & Staff Onboarding Hub (Operations Manager Tutorial Suite)
- **Top Header Quick Launch (`[ 📖 Manager Guide ]`):** Direct 1-click modal access anywhere across the dashboard.
- **Settings Subtab Walkthrough:** Step-by-step instructions embedded directly inside the Settings tab (**⚙️ Settings → 📖 Admin Guide & Tutorials**).
- **Comprehensive Step-by-Step Tutorial:**
  1. *Admin Master Access & Confidential Mode:* Master PIN `9999` exclusive access.
  2. *Configure Employee Profiles, Rates & 4-Digit PINs:* Field-by-field breakdown (Name/Role, USD/PHP Hourly Rates, Private PIN, Leave Credits VL/SL/EL, Contact Email).
  3. *Distribute PINs & Onboard Staff:* 1-click formatted invitation generator for WhatsApp/Slack.
  4. *Daily Attendance Tracking:* Review live punch-ins, WFH/Onsite badges, and rendered hours.
  5. *Review & Export Payday Payroll:* Dual currency USD + PHP computation and 1-page payslip generation.
  6. *Project Tracking & Activity Codes:* Admin-only CRUD for client and internal projects.
  7. *Leave & COA Approvals:* Time Off tab 1-click approvals for VL/SL/EL and missed punches.
  8. *Database Safety & Local Backups:* 1-click JSON database download and restore.
- **Interactive Invitation Message Generator:** Formatted ready-to-send Slack/Skype message with 1-click **`[ 📋 Copy Invitation Message ]`** button.
- **PIN Access Cheat Sheet:** Quick overview of all default and customized team PINs for effortless manager reference.

### 🔒 Module 5: Rate Confidentiality & PIN Access Security
- **Confidential Rates:** No developer can see another developer's hourly wage or earnings. All dollar amounts are hidden on public and team views.
- **Private 4-Digit PIN Access:** Every developer enters their own private PIN to unlock their personal DTR and timesheet.
- **Strict Role Isolation:** Staff PINs (`1234`–`4567`) cannot access Admin/Management privileges, rate adjustments, project deletions, or approval queues.
- **Admin Master PIN (`9999`):** Exclusively unlocks company-wide payroll, rate configurations, employee profile editing, and manager approvals. Only the Administrator/Operations Manager can log in with `9999`.
- **Header Lock Button (`🔒`):** 1-click lock before stepping away from desk.

### 📊 Module 6: Timesheets, Payday Analytics & Real-Time PHP (₱) Conversion
- **Live Real-Time USD ⇄ PHP Forex Ticker:** Auto-fetches live exchange rates (`1 USD = ₱58.50 PHP`) from public forex APIs with 1-click sync and custom manual override.
- **Dual-Currency Analytics Cards:** Displays Total Gross Payroll and Average Effective Rate in both **$ USD** and converted **₱ PHP** side-by-side (`$687.00 ≈ ₱40,189.50 PHP`).
- **Bottom Real-Time Computation & PHP Summary Card:** Dedicated computation summary calculating gross USD, converted gross PHP, hourly average in PHP, and developer-by-developer converted wage breakdowns ready for Philippine bank / GCash disbursement.
- **Full Mobile, iOS & Tablet Dynamic Responsive Design:**
  - Fluid adaptive navigation bar with horizontal touch swipe on mobile devices.
  - Safe-area inset support (`env(safe-area-inset-bottom)`) for iPhone notch/home bar screens.
  - 16px minimum form control typography to prevent unwanted iOS Safari auto-zoom on input focus.
  - 1-column mobile stacked layouts for punch terminals, quick payslip bars, and conversion drawers.
  - Momentum touch scrolling (`-webkit-overflow-scrolling: touch;`) on tables, holiday cards, and settings subnavs.
- **Prominent Admin "Run Staff Payslip" Quick Action Bar:** Direct 1-click employee selector dropdown and `[ Run & Print Payslip ]` button on top of the Timesheets page so Admin can immediately generate any staff member's payslip without needing to filter first.
- **Attendo-Inspired Official Digital Payslip Voucher Modal:**
  - Executive company header with Diverse Ideas GMBH branding and voucher tracking ID.
  - Interactive Admin Staff Selector in the payslip modal header to instantly switch between employees.
  - Complete employee details, work period, and active conversion rate note.
  - Itemized project earnings in both USD and PHP.
  - Large net payable wage highlight banner (`$687.00 USD ≈ ₱40,189.50 PHP`).
  - Dual approval signature acknowledgment lines.
  - Strictly **1 single page** print voucher.
- **Enhanced CSV Export:** Generates spreadsheets containing Net Hours, USD Rate, USD Gross Pay, PHP Rate, PHP Gross Pay, and Exchange Rate columns.

---

## 4. Team Credentials & Access Codes

| Name | Role | Currency & Rate | Default PIN | Default Leave Credits | Access Level |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Alex Rivera** | Lead Full-Stack Dev | $35.00 / hr | **`1234`** | 12 VL / 10 SL / 5 EL | Personal DTR & My Stuff Only |
| **Maria Santos** | Senior Frontend Engineer | $28.00 / hr | **`2345`** | 15 VL / 10 SL / 5 EL | Personal DTR & My Stuff Only |
| **Kenji Takahashi** | Backend Systems Engineer | $30.00 / hr | **`3456`** | 10 VL / 8 SL / 5 EL | Personal DTR & My Stuff Only |
| **Chloe Gomez** | UI/UX & QA Specialist | $22.00 / hr | **`4567`** | 14 VL / 10 SL / 5 EL | Personal DTR & My Stuff Only |
| **Administrator** | Operations Manager | *Executive* | **`9999`** | *Manager Privileges* | **Full Admin Master Access** |

> 📌 **Note:** All PINs, hourly rates, and leave balances can be customized and updated by the Operations Manager at any time under **⚙️ Settings → 👥 People & Pay Rates**.

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
├── server.js             # Zero-dependency local network server (Wi-Fi sharing, port 3000)
├── start.bat             # 1-click Windows server launcher
├── vercel.json           # Vercel deployment configuration
├── netlify.toml          # Netlify configuration
├── package.json          # Node scripts and metadata
├── data.json             # Local JSON file backup/persistence
└── project.md            # Comprehensive project documentation & persistent memory
```

---

## 6. How to Resume After Laptop Restart

### A. Accessing the Live Production Web App
If working online or on mobile/tablet, simply open:
🌐 **`https://diverse-ideas-attendance.vercel.app`**
- Operations Manager unlocks with PIN **`9999`**.
- Developers unlock with their assigned PINs (**`1234`**, **`2345`**, **`3456`**, **`4567`**).

### B. Starting the Local Development Server
When restarting your laptop or working offline on local Wi-Fi:
1. Navigate to: `c:\Users\USER\Documents\Programming Folder Rep\Diverse Ideas GMBH`
2. **Option 1 (1-Click):** Double-click **`start.bat`**.
3. **Option 2 (Terminal):** Open PowerShell / Command Prompt in this folder and run:
   ```powershell
   node server.js
   ```
4. Open your browser to:
   - Local: `http://localhost:3000`
   - Office Wi-Fi (other laptops/phones): `http://<your-local-ip>:3000` (printed in terminal upon startup)

### C. Git Workflow (Saving & Deploying Updates)
All changes pushed to `main` automatically deploy to Vercel within seconds:
```powershell
git status
git add -A
git commit -m "feat: your descriptive update message"
git push origin main
```

### D. Key Context for AI Agent on Next Session
- **Repository:** `jasonvelasquez1410/diverse-ideas-attendance` on branch `main`.
- **Role Designation:** The in-app administrator role is **Operations Manager**. Do NOT use or re-introduce the name "Tef" or title recommendation cards in user-facing views or guides.
- **PIN Isolation Rule:** Master PIN `9999` belongs strictly to Administrator / Operations Manager. Developers have dedicated PINs and cannot access rate data or admin actions.
- **Holidays:** National PH + Cagayan de Oro (CDO) holidays (Charter Day June 15, Higalaay Aug 28, City Fiesta Jan 10) are built into the presets.
- **Dual Currency:** Real-time forex ticker with USD base, live PHP rate conversion, and single-page printable payslips with dual signatures.
