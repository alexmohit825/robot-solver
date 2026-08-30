# Robot Solver v2.0
## Intraoperative Robotic Spine Error Resolver (ExcelsiusGPS® & Mazor X™ Stealth Edition)

**Robot Solver** is a high-speed, intraoperative error management system and diagnostic decision engine for spinal robotics, engineered specifically for **Globus ExcelsiusGPS®** and **Medtronic Mazor X™ Stealth Edition**.

---

## Core Capabilities
- **Dual-Platform Live Switcher:** Instant toggle between Globus ExcelsiusGPS (Active IR LEDs, DRB/Surveillance arrays, Planar 2D/3D Matching) and Medtronic Mazor X (StealthStation S8 Serial Link, 3D Optical Camera, Bone Mount Bridge, O-arm 2 Volumetric Registration).
- **Physical & Navigational Symptom Engine:** Step-by-step branching differential algorithm diagnosing *why* the robot is "way off" (DRB toggle, surveillance shift, facet skiving, intersegmental motion, bridge flex).
- **Real-Time Software Error Code Decoder:** Instant de-obfuscation of console alert banners (`E-3104`, `ST-104`, `E-4020`, `REG-305`, `E-5012`, `ARM-401`, `E-2101`, `OPT-202`, etc.) with root causes and 3-step rapid fixes.
- **Line-of-Sight & Spatial Tracking Envelope:** Interactive camera distance sweet spot visualizer ($1.8\text{m} - 2.4\text{m}$), $45^\circ$ angle guides, OR obstruction vectors, and pre-instrumentation verification checklists.
- **Mobile Safari PWA:** Live scannable QR code in header for zero-lag intraoperative iPhone/iPad reference.

---

## Local Development & Build
```bash
# Run local dev server
npm run dev

# Build production bundle
npm run build
```
