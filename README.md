# check

> **A discipline checker. Online but for the right reason.**  
> Live Telemetry Dashboard: [ms1a.tech](https://ms1a.tech)

---

### Why this exists

Anyone can put buzzwords on a resume or claim hundreds of hours of self-study.  
In engineering, verification beats claims.

**check** is an automated telemetry pipeline built to turn daily discipline into verifiable data. Every single minute spent tackling Computer Science (Harvard CS50x), Mathematics (MIT OCW & OMB+), and any future courses or programs is measured in real time and committed directly to an external PostgreSQL database.

No manual timers. No self-reported logs. Only active, focused tabs trigger heartbeats.

---

### The Architecture

```
[ Active Browser Session ]
          │  (Allowlisted domains: CS50, MIT OCW, OMB+)
          ▼
[ Chrome Service Worker ]
          │  (Minute heartbeat via chrome.alarms)
          ▼
[ Flask Ingestion API ]
          │  (Header authentication, domain & title classification)
          ▼
[ Heroku PostgreSQL ]
          │  (Time-series persistence with category tagging)
          ▼
[ Live Dashboard (ms1a.tech) ]
             (Async polling every 30s via frontend.js)
```

1. **Telemetry Capture:** A custom background extension polls active tabs every minute via `chrome.alarms`. If and only if the URL or tab title matches an approved learning environment, a heartbeat payload is generated.
2. **Verification & Ingestion:** The Flask backend (`/api/save`) verifies request authenticity via an API token header. Payloads are classified (CS50 vs. Mathematics) and sanitized.
3. **Persistence:** Verified focus minutes are stored in a managed PostgreSQL instance with Unix timestamps, remaining resilient across browser sessions and reboots.
4. **Real-Time Visualization:** `frontend.js` polls `/api/get` every 30 seconds, dynamically reflecting live status and focus totals without full-page reloads.

---

### Roadmap: 3 Years. 3 Steps.

- **Step 01: Foundations & Systems (2026)** — Harvard CS50x (C, memory management, data structures, algorithms, Python, SQL) + Intensive Mathematics (Calculus, Linear Algebra via MIT OCW & OMB+).
- **Step 02: Academic & Workload Rigor (2026–2027)** — Computer Science coursework at TU Darmstadt, focusing on high-volume algorithmic problem sets and disciplined project execution.
- **Step 03: Specialization (2027–2028)** — Advanced Systems Programming, Cyber Security, and Infrastructure Engineering.
