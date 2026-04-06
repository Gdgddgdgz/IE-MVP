# DGCare - Phase 2 MVP

DGCare is a complete, real-time caregiver and family monitoring platform built to ensure the safety and tracking of loved ones.

## 🚀 Tech Stack
- **Frontend & API:** Next.js (App Router), React
- **Real-time Engine:** Socket.io & WebSockets running inside a custom Next.js Node container
- **Maps Location:** Leaflet & React-Leaflet
- **Database:** MongoDB (Mongoose Schema ready)
- **Styling:** Premium Vanilla CSS Custom Properties (Deep Pine Green Theme)

## 🌟 Core Features
1. **Divergent Dashboards:** Entirely separate UI/UX experiences for Family (Monitoring) and Caregiver (Broadcasting).
2. **Server-Side PIN Pairing:** Caregivers generate a 4-Digit session PIN that Family members type into their dashboard to securely link the live tracking Room!
3. **Live GPS Emulation:** Once authenticated, the Caregiver dashboard emits movement data to the Family's Leaflet layout.
4. **Instant SOS Alerts:** True Socket.io push dispatch alerts connected clients instantly within their PIN room.

## 💻 Getting Started Locally

### 1. Requirements
- Node.js (v18+)
- Local MongoDB installation, or replace the URI with a Cloud cluster.

### 2. Installation
Ensure you are in the project folder and install dependencies:
```bash
npm install
```

### 3. Setup Environment Variables (Optional)
If you wish to change the database, create a `.env.local` and add:
```bash
MONGODB_URI=mongodb://localhost:27017/dgcare
```

### 4. Run the Custom Server
Because this project strictly requires WebSockets alongside Next.js rendering, you must run it through the custom server script:
```bash
npm run dev
```

The platform is now fully accessible at **http://localhost:3000**!
