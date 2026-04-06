# DGCare 🛡️💚
> Trusted Care for the Ones Who Matter Most.

DGCare is a comprehensive web platform designed to connect families with background-checked, trusted caregivers. With a focus on safety and transparency, the platform allows families to book caregivers, track their real-time location during active sessions, and provides caregivers with a complete scheduling dashboard.

## 🌟 Overview
Built for two key user roles:
- **Families:** Find and book verified care professionals, monitor real-time caregiver locations, and trigger SOS alerts if needed.
- **Caregivers:** Manage service schedules, handle bookings, and update their live location during care sessions.

## ✨ Features

- **Role-Based Authentication:** Dedicated login and registration flows for both Families and Caregivers.
- **Dedicated Dashboards:** 
  - Family Dashboard for managing bookings and tracking.
  - Caregiver Dashboard for visualizing daily and upcoming schedules.
- **Interactive Booking System:** Families can seamlessly view and book available caregivers.
- **Schedule Management:** Caregivers can view their service times and ongoing tasks.
- **Real-Time GPS Map Integration:** Live map tracking functionality using React-Leaflet and WebSockets to update the caregiver's location dynamically for the family.
- **Emergency SOS System:** Built-in instant alert mechanism via WebSockets for critical situations.

## 🛠 Tech Stack

**Frontend:**
- **Framework:** [Next.js 14](https://nextjs.org/) & [React 18](https://react.dev/)
- **Mapping:** [Leaflet](https://leafletjs.com/) & `react-leaflet`
- **Icons:** `lucide-react`
- **Styling:** Custom CSS & inline-styled components (Responsive & Accessible)

**Backend:**
- **Server:** Custom Node.js HTTP Application Server
- **Real-time Engine:** [Socket.io](https://socket.io/) (for Live GPS tracking and SOS Alerts)
- **Database:** [MongoDB](https://www.mongodb.com/) using [Mongoose](https://mongoosejs.com/) ORM

## 📂 Project Structure

```text
├── server.js              # Custom Node.js server handling Next.js routing AND Socket.io WebSockets
├── src/
│   ├── app/               # Next.js App Router root
│   │   ├── dashboard/     # Role-based dashboards
│   │   │   ├── family/    # Family booking and tracking interfaces
│   │   │   └── caregiver/ # Caregiver scheduling and management views
│   │   ├── login/         # Authentication logic
│   │   └── register/      # User onboarding flows
│   ├── components/        # Reusable React components
│   │   ├── Map.tsx        # Leaflet Map integration for live tracking
│   │   ├── Sidebar.tsx    # App navigation sidebar
│   │   └── SkeletonLoader.tsx # Loading state visualizations
│   └── lib/               # Utility functions and Database logic
│       ├── mongodb.ts     # MongoDB connection setup
│       └── models/        # Mongoose Data Models (User, Caregiver)
```

## 🚀 Setup Instructions

Follow these steps to get the project running locally:

### 1. Clone & Install Dependencies
Ensure you have Node.js (v18+) installed.

```bash
git clone <your-repo-url>
cd IE-MVP
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory and add the following variables:
*(Example configuration)*
```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dgcare
# Other necessary API keys (if applicable)
```

### 3. Run the Development Server
Because DGCare utilizes a custom Node.js server for WebSocket support, start the app using `node server.js` directly via the npm dev script:

```bash
npm run dev
```

The application should now be running on [http://localhost:3000](http://localhost:3000).

## 📸 Screenshots

| Landing Page | Family Booking | Live Tracking (Map) |
| --- | --- | --- |
| *[Placeholder for Home Screen]* | *[Placeholder for Booking View]* | *[Placeholder for Map/GPS View]* |

## 🔮 Future Improvements

Based on the MVP structure, here are potential roadmap features:
- **Payment Gateway Integration:** Stripe/PayPal to handle caregiver payouts directly.
- **Rating & Review System:** Allowing families to rate caregivers for accountability.
- **In-App Messaging:** Secure chat channels between families and scheduled caregivers.
- **Push Notifications:** Web-push or email updates regarding booking confirmations or SOS alerts.

## ✍️ Author
- Built with ❤️ for families and caregivers.
