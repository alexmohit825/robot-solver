# VigilOR
### Autonomous Operating Room Schedule Sentinel & Clinical Availability Relay

**VigilOR** is a clinical-grade schedule sentinel engineered for surgeons and surgical practices. It connects directly to Apple iCloud Calendar via RFC 4791 CalDAV to monitor surgical block schedules. Whenever an event is scheduled on a protected day or time window (such as Wednesday afternoons), VigilOR automatically sanitizes the event title for privacy, batches modifications with a noise-reduction debounce buffer, and dispatches automated alerts via SMS and Email to **multiple surgery schedulers** across designated hospital facilities.

---

## 🌟 Key Features

1. **Multi-Scheduler & Multi-Facility Directory:**
   - Add multiple surgical schedulers across main hospitals, ambulatory surgery centers (ASCs), and private clinics.
   - Choose communication channel preference per contact: **SMS**, **Email**, or **Both**.
   - Send verification test pings to confirm contact validity.

2. **Customizable Protection Rules:**
   - Define custom protected days (e.g. Wednesday afternoons, Friday mornings, or multi-day blocks).
   - Configure custom start/end time boundaries and 3–5 minute debounce hold buffers.
   - Route specific rules to designated schedulers or broadcast to all active contacts.

3. **Privacy & PHI Sanitization:**
   - Automatically masks personal event titles (e.g. *"Dentist"* or *"Family Dinner"*) into professional availability notices (*"Dr. Mercer Personal Block"*).

4. **Closed-Loop Two-Way Acknowledgment:**
   - Schedulers receive secure, one-click action links:
     - `[Confirm: Block Placed]` $\rightarrow$ Updates surgeon's sentinel dashboard with a green confirmation badge.
     - `[Flag Conflict: Case Pending]` $\rightarrow$ Alerts the surgeon of an existing case overlap.

5. **Live 'What-If' Simulation Sandbox:**
   - Test calendar event scenarios interactively and preview live SMS and Email cards across all schedulers in real-time.

6. **Apple iCloud CalDAV Integration (Option A):**
   - Cloud-to-cloud sync using Apple App-Specific Passwords (`appleid.apple.com`).
   - Runs independently of your physical iPhone battery or background app execution state.

---

## 🚀 Getting Started

### 1. Run the Web Application
```bash
npm install
npm run dev
```
Open your browser to: **`http://localhost:5173/`**

### 2. Build for Production
```bash
npm run build
```

---

## 📁 Architecture & File Structure

```
src/
├── types/
│   └── vigilor.ts            # Data models for Rules, Schedulers, Events & Logs
├── services/
│   └── storageService.ts     # Persistent local/cloud storage & state management
├── engine/
│   ├── caldavClient.ts       # Apple iCloud RFC 4791 CalDAV protocol adapter
│   ├── ruleEvaluator.ts      # Overlap detection, privacy transformer & day math
│   ├── dispatcher.ts         # Outbound SMS/Email payload formatter & tokens
│   └── debounceManager.ts    # Noise-reduction event buffering
├── components/
│   ├── Header.tsx            # App navigation & live iCloud status
│   ├── SentinelBanner.tsx    # Live monitoring status & emergency snooze
│   ├── DashboardView.tsx     # Sentinel metrics & active rules summary
│   ├── RuleManager.tsx       # Interactive rule builder & scheduler routing
│   ├── SchedulerDirectory.tsx# Multi-scheduler contact manager
│   ├── SimulatorPlayground.tsx# 'What-If' test sandbox & ACK simulator
│   ├── AuditLogView.tsx      # Immutable delivery receipts & filterable log
│   └── iCloudConnectionModal.tsx # Apple App-Specific Password setup
└── App.tsx                   # Main orchestrator & state container
```
