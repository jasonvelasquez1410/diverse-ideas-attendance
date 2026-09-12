# DevTrack: Developer Attendance, Time Off & Enterprise Payroll System
**Company:** Diverse Ideas GMBH  
**Repository:** [github.com/jasonvelasquez1410/diverse-ideas-attendance](https://github.com/jasonvelasquez1410/diverse-ideas-attendance)  
**Live Production URL:** [diverse-ideas-attendance.vercel.app](https://diverse-ideas-attendance.vercel.app)  
**Last Updated:** September 13, 2026

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
- **Shift Hours:** `09:00 AM – 05:00 PM` (17:00)
- **Mondays:** 🏠 **Work From Home (WFH)** (Terminal auto-defaults to WFH mode on Mondays)
- **Tuesdays – Fridays:** 🏢 **Onsite Office** (Terminal auto-defaults to Onsite mode)
- **Weekly Target Commitment:** 35 hours minimum / 45 hours maximum per week.
- **Saturday Policy:** Rest Day / Optional (Walay pugsanay — voluntary, no forced weekend work).

---

## 2. DevTrack vs. Jibble: Comparative Analysis

| Feature Area | Jibble.io | DevTrack (Diverse Ideas) | Advantage |
| :--- | :--- | :--- | :--- |
| **Real-Time Dual Currency ($ USD ⇄ ₱ PHP)** | ❌ Single currency only | 🟢 **Live Auto-Forex Ticker ($1 USD = ₱58.50 PHP)** + Instant Gross & Payslip Conversion | **DevTrack** (Zero manual math for Philippine payouts) |
| **No Work, No Pay Modular Toggles** | ❌ Complex work rules | 🟢 **Admin Feature Sliders** (Turn leave tracking, OT forms, undertime ON/OFF with 1 click) | **DevTrack** (Tailored for direct hourly billing) |
| **Confidential Rate Security** | ⚠️ Complex permission tiers | 🟢 **PIN-based developer isolation (`1234`–`4567`) + Admin Master Lock (`9999`)** | **DevTrack** (Confidential developer rates across all views) |
| **Self-Service PIN Management** | ❌ Requires admin reset | 🟢 **Self-Service PIN Modal** (Admin and all developers can update their 4-digit PINs) | **DevTrack** (Private and immediate) |
| **Certificate of Attendance (COA) Dispute** | ❌ Basic timesheet edits | 🟢 **Full Sprout HR COA missed-punch dispute workflow** | **DevTrack** (Exact reason logging & 1-click approvals) |
| **1-Page Printable Payslip Slip** | ⚠️ Multi-page PDF exports | 🟢 **Executive 1-page A4 printout with dual signatures & USD/PHP totals** | **DevTrack** (Clean 1-sheet physical / PDF printouts) |
| **Time Off & Custom Holiday Creation** | 🟢 Built-in | 🟢 **Full Leave Credits + Custom Holiday Manager & 2026 Philippine Calendar** | **Tied** |
| **Categorized Enterprise Settings** | 🟢 Sub-tab navigation | 🟢 **Modular 7-Pane Responsive Settings (Org, Features, Schedules, People, Projects, Data, Guide)** | **DevTrack** (Zero overflow, wrapping tabs) |
| **Pricing & Recurring Fees** | ❌ $3.99 – $9.99/user/mo | 🟢 **100% Free / Self-Hosted / Zero Recurring Costs** | **DevTrack** (Lifetime ownership) |

---

## 3. Core Modules & Implemented Features

### 🕒 Module 1: Daily Time Record (DTR) Terminal (Sprout HR Style)
- **Official Live Date & Wall Clock:** Real-time Philippine Date & Clock (`09:00:00 AM`) — *Strict clock, no counting stopwatch ticker*.
- **4-Box DTR Timelog Metric Grid:**
  1. 📥 **Time IN**: Exact punch-in timestamp (e.g. `09:00:15 AM`).
  2. ☕ **Break Time**: Scheduled lunch/rest intervals (e.g. `12:00 PM – 01:00 PM / 60m`).
  3. 📤 **Time OUT**: Exact punch-out timestamp (e.g. `05:00:10 PM`).
  4. ⏱️ **Rendered Hours**: Net hours worked today (e.g. `8.00 hrs`).
- **Big Action Buttons:** `[ 📥 Time IN (Clock In) ]`, `[ ☕ Start Break / End Break ]`, `[ 📤 Time OUT (Clock Out) ]`.
- **Context Bar:** Work Mode (`🏠 Home (WFH)` / `🏢 Office (Onsite)`), Active Project selector, and Tasks Accomplished notes.

### 📁 Module 2: PayDay "My Stuff" & Application Center
Cloned from the official Sprout PayDay Employee Dashboard with the **`[ Apply ⌵ ]`** dropdown:
1. 📝 **Certificate of Attendance (COA):** File for missed login/logout with dispute punch time for manager approval (Essential for brownout/internet disruptions).
2. 🌴 **Leave:** Apply for Vacation Leave (VL), Sick Leave (SL), Emergency Leave (EL), or Bereavement Leave *(Visible only when Leave Credits feature is enabled)*.
3. ⏰ **Overtime (OT):** Request pre-shift, post-shift, or rest day overtime hours *(Visible only when Overtime Filing is enabled)*.
4. ⏱️ **Undertime (UT):** Request early shift departure *(Visible only when Undertime Filing is enabled)*.
5. 💼 **Official Business (OB):** File for client fieldwork and offsite setups.
6. 🔄 **Schedule Adjustment:** Request shift or work location changes.
- **⚖️ Compensation Policy Badge:** Displays "No Work, No Pay • Hourly Active" policy explanation with direct link to Feature Sliders.

### 🎛️ Module 3: Admin Feature Sliders & Policy Control Center
Located at **⚙️ Settings → 🎛️ Feature Sliders & Policy** (Position #2 in Settings subnav):
- **Responsive Subnav:** Powered by `flex-wrap: wrap` to ensure all 7 subnav tabs are 100% visible on all monitor/laptop resolutions.
- **Top Quick Jump Banner:** 1-click button in the Settings header to immediately configure feature sliders.
- **7 Modular Toggle Switches:**
  1. 🌴 **Paid Leave Credits Tracking:** (Default: **OFF** for No Work, No Pay) Hides VL/SL/EL balances from DTR.
  2. ⏰ **Overtime (OT) Request Filing:** (Default: **OFF**) Hours beyond shift logged automatically by time clock.
  3. ⏱️ **Undertime (UT) Request Filing:** (Default: **OFF**) Leaving early auto-deducts billable hours.
  4. 📝 **Certificate of Attendance (COA):** (Default: **ON**) For missed punch disputes.
  5. 🔄 **Schedule Adjustment & WFH:** (Default: **ON**) For remote shift notices.
  6. 💵 **Live Forex Ticker (USD ⇄ PHP):** (Default: **ON**) Auto-conversion banner & dual-currency wages.
  7. 🇵🇭 **Holidays Calendar:** (Default: **ON**) National and CDO city calendar.

### 🌴 Module 4: Time Off, Philippine & Cagayan de Oro (CDO) Holidays Center
- **Dual Policy View:**
  - When Leave Credits are **disabled**, displays the **4-Card Hourly Policy Deck** (Compensation Model, Shift Hours 9–5 WFH Mondays, Weekly Target 35h–45h, Saturday Rest Day).
  - When Leave Credits are **enabled**, displays Vacation (12 VL), Sick (10 SL), and Emergency (5 EL) counters.
- **Full 2026 Philippine & Cagayan de Oro (CDO) Holiday Calendar:**
  - National Regular Holidays (New Year's, Maundy Thu, Good Fri, Labor Day, Independence Day, Christmas, Rizal Day).
  - Special Non-Working Holidays (Chinese New Year, EDSA, All Saints, Christmas Eve, New Year's Eve).
  - **Cagayan de Oro (CDO) Local Holidays:**
    - `June 15`: **Cagayan de Oro Charter Day**
    - `August 28`: **Higalaay Festival & Feast of St. Augustine**
    - `January 10`: **Cagayan de Oro City Fiesta**
- **Smart Quick Holiday Preset Dropdown (`+ Add Holiday`):** 1-click template selector for CDO, national, and company events.

### ⚙️ Module 5: Enterprise Settings Center (Jibble Multi-Category Layout)
Categorized into 7 dedicated sub-views:
1. 🏢 **Organization Profile:** Company legal name, industry, headquarters address, tax ID (`DE-2026-DIV99`), voucher prefix (`DIV`), and Admin Master PIN management form.
2. 🎛️ **Feature Sliders & Policy:** Live toggle switches for all operational modules.
3. ⏰ **Work Schedules & Hybrid Rules:** Shift times (`09:00` - `17:00`), WFH days (`Monday`), grace period (15 mins), targets (35h min / 45h max), and Saturday optional policy.
4. 👥 **People & Pay Rates:** Developer roster, hourly wages, 4-digit PINs, leave allocations, Run Payslip action, and Edit Profile modal.
5. 📁 **Projects & Activities (Admin CRUD):** Add, edit, and archive internal/client projects.
6. 💾 **Database & Backups:** 1-click JSON database backup download, JSON restore from file, and factory demo data reset.
7. 📖 **Admin Guide & Tutorials:** Embedded onboarding tutorial suite for Operations Manager with step-by-step guides, live PIN cheat sheet, and 1-click invitation text copy.

### 🔒 Module 6: PIN Access Security & Self-Service PIN Management
- **Confidential Rates:** Developer staff cannot view each other's hourly rates or earnings.
- **Private 4-Digit PIN Access:** Every developer enters their own private PIN to unlock their personal DTR and timesheet.
- **Universal Self-Service PIN Change (`🔑 Change PIN`):**
  - Accessible via header button and DTR Card 3.
  - Allows staff to change their own 4-digit PIN with validation and confirmation.
  - Allows Admin to update the Master PIN (`9999`).
- **Strict Role Isolation:** Staff PINs (`1234`–`4567`) cannot access Admin privileges, rate adjustments, project deletions, or approval queues.
- **Admin Master PIN (`9999`):** Exclusively unlocks company-wide payroll, rate configurations, employee profile editing, and manager approvals.
- **Header Lock Button (`🔒`):** 1-click lock before stepping away from desk.

### 📊 Module 7: Timesheets, Payday Analytics & Real-Time PHP (₱) Conversion
- **Live Forex Ticker:** Auto-fetches live exchange rates (`1 USD = ₱58.50 PHP`) with 1-click sync and custom manual override.
- **Dual-Currency Analytics:** Total Gross Payroll and Average Effective Rate in both **$ USD** and **₱ PHP**.
- **Admin "Run Staff Payslip" Bar:** Direct 1-click employee selector and `[ Run & Print Payslip ]` button.
- **1-Page Printable Payslip Slip:**
  - Executive company header with Diverse Ideas GMBH branding.
  - Itemized project earnings in USD and PHP.
  - Dual signature acknowledgment lines.
  - Strictly **1 single A4 page** print format.

---

## 4. Team Credentials & Access Codes

| Name | Role | Currency & Rate | Default PIN | Policy Status | Access Level |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Alex Rivera** | Lead Full-Stack Dev | $35.00 / hr | **`1234`** | Hourly (No Work, No Pay) | Personal DTR & My Stuff Only |
| **Maria Santos** | Senior Frontend Engineer | $28.00 / hr | **`2345`** | Hourly (No Work, No Pay) | Personal DTR & My Stuff Only |
| **Kenji Takahashi** | Backend Systems Engineer | $30.00 / hr | **`3456`** | Hourly (No Work, No Pay) | Personal DTR & My Stuff Only |
| **Chloe Gomez** | UI/UX & QA Specialist | $22.00 / hr | **`4567`** | Hourly (No Work, No Pay) | Personal DTR & My Stuff Only |
| **Administrator** | Operations Manager | *Executive* | **`9999`** | *Master Privileges* | **Full Admin Master Access** |

> 📌 **Note:** All PINs can be changed by developers themselves via the `🔑 Change PIN` button or managed by Admin in Settings.

---

## 5. Office Hardware & Brownout Protocol (CDO Office)

When evaluating emergency backup power for the 4 developers during Cagayan de Oro brownouts:

| Equipment | Cost | Feasibility for 4 Developers | Verdict / Purpose |
| :--- | :---: | :--- | :--- |
| **Promate 12V 12Ah Powerstation (200W SLA)** | ₱3,499 | ❌ **NOT SUITABLE FOR LAPTOPS.** 4 laptops draw 180W–300W (will trip 200W inverter immediately). Drains in <45m for 1 laptop. | Good **only** for powering WiFi router (5–6 hrs) & charging phones. |
| **Mini DC UPS for Routers (e.g. Marsriva / SKE)** | **₱800 – ₱1,200** | 🟢 **RECOMMENDED FOR INTERNET.** Plugs directly into fiber modem DC port. 0ms switchover (no WiFi restarts). Keeps internet alive for **6–8 hours**. | **Best value investment** to keep team online during power outages. |
| **500Wh–1000Wh LiFePO4 Power Station** | ₱18k – ₱35k | 🟢 **POWERS ALL LAPTOPS.** Multi-outlet 500W–1000W pure sine wave inverter (EcoFlow / Bluetti). Recharges 4 laptops 4–8 times. | Best all-in-one battery solution if budget allows. |
| **1kW–2kW Inverter Generator** | ₱12k – ₱20k | 🟢 **RUNS ALL DAY.** Powers 4 laptops, router, and office fans continuously on gasoline. | Best for prolonged 8–12 hour CDO power outages. |

---

## 6. How to Resume After Laptop Restart / Shutdown

### A. Accessing the Live Production Web App
Open any browser on laptop, tablet, or phone:
🌐 **`https://diverse-ideas-attendance.vercel.app`**
- Operations Manager unlocks with PIN **`9999`**.
- Developers unlock with their 4-digit PINs (**`1234`**, **`2345`**, **`3456`**, **`4567`**).

### B. Starting the Local Development Server
When restarting your laptop or working offline on local Wi-Fi:
1. Navigate to: `c:\Users\USER\Documents\Programming Folder Rep\Diverse Ideas GMBH`
2. **Option 1 (1-Click):** Double-click **`start.bat`**.
3. **Option 2 (Terminal):** Open PowerShell in this folder and run:
   ```powershell
   node server.js
   ```
4. Open your browser to:
   - Local: `http://localhost:3000`
   - Office Wi-Fi (other laptops/phones): `http://<your-local-ip>:3000` (printed in terminal upon startup)

### C. Git Workflow (Always Commit & Push Updates)
All changes pushed to `main` automatically deploy to Vercel within seconds:
```powershell
git status
git add .
git commit -m "feat: descriptive update message"
git push origin main
```

### D. Critical Context for Future AI Sessions
1. **Always Push Changes:** Every single user update MUST be staged, committed, and pushed to `origin main` ([diverse-ideas-attendance repo](https://github.com/jasonvelasquez1410/diverse-ideas-attendance.git)).
2. **Role Designation:** The executive administrator is **Operations Manager** (Master PIN `9999`). Do NOT reintroduce "Tef" in user-facing UI or guide text.
3. **No Work, No Pay Model:** Preserve the default hourly compensation model with feature sliders in Settings position #2.
4. **Rate Confidentiality:** Developers cannot see other developers' rates or company payroll totals.
5. **Vercel Deploy Sync:** Always check that newly added CSS or HTML elements wrap gracefully without hiding or truncating on standard viewports.
