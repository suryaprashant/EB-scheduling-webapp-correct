# DepotCharge - Electric Bus Scheduling & Allocation WebApp

A modern, responsive React and Node.js web application implementing automated Electric Bus (EB) charging allocation, arrival scheduling, and 240 kW DC fast charge battery State of Charge (SOC) estimation.

Ported with 100% mathematical and logical fidelity from the Excel VBA depot charging model.

---

## ⚡ Core Features

- **Automated Charger Allocation Engine**:
  - Validates Electric Bus Number, Arrival Time (`HH:mm`), and Arrival Battery SOC%.
  - Handles scheduled matching, early arrivals ($<1\text{ hr}$ wait condition), on-schedule connections, and missed session fallback re-allocation across 20 high-power fast chargers.
- **Battery SOC Doughnut Charts**:
  - Visualizes **Arrival SOC%** and **Expected Departure SOC%** using high-precision circular doughnut graphs.
  - Calculated using the exact VBA formula:
    $$\text{SOC}_{\text{dep}} = \text{Round}\left(\text{SOC}_{\text{arr}} + 0.95 \times \frac{T_{\text{chg}}}{60} \times \frac{240}{360} \times 100,\ 2\right)$$
    *(240 kW DC fast charger power, 360 kWh battery capacity, 95% charging efficiency).*
- **Real-Time 20-Charger Status Panel**:
  - Live grid evaluating Chargers 01–20 as **Idle** (green) or **Occupied/Allocated** at the bus arrival time.
- **Depot Schedule Management**:
  - Interactive schedule viewer for all 101 fleet buses.
  - Filter by Active, Complete, or Overlaps/Issues.
  - Add new manual sessions or commit newly allocated sessions into the active schedule.

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+ or 20+ / 22+
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Run React Web Application (Vite Dev Server)
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. (Optional) Run Node.js / Express Backend Server
```bash
npm run server
```
Runs the Express API on [http://localhost:3000](http://localhost:3000) with REST endpoints:
- `POST /api/allocate`
- `GET /api/sessions`

---

## 📦 Pushing to GitHub (`EB-scheduling-webApp-correct`)

To push this web application to your GitHub repository `EB-scheduling-webApp-correct`:

```bash
git init
git add .
git commit -m "Initial commit: React & Node.js EB scheduling webapp"
git branch -M main
git remote add origin https://github.com/suryaprashant/EB-scheduling-webApp-correct.git
git push -u origin main
```
