# ÉLAN — Premium AI Event Planning Platform

> **Big moments. Thoughtfully made.**

ÉLAN is a full-stack, AI-powered event planning application designed for luxury weddings, birthdays, anniversaries, and community celebrations. It combines high-touch aesthetic concept generation with context-aware budget management, living timelines, vendor matchbooks, guest rosters, and an intelligent copilot simulator.

---

## 🌟 Key Features

1. **AI Event Concierge & Intelligent Briefing**: Generates complete event concepts, realistic color palettes, decor directions, itemized budgets, and risk matrix from natural language briefs using Google Gemini 2.5/3.8.
2. **Command Center Dashboard**: Live snapshot of upcoming payment reminders, critical risk alerts, health scores, and next milestone actions.
3. **Budget Reality Engine & Payment Reminders**:
   - Recharts visual bar chart comparing **Estimated vs. Actual Spending** per category.
   - Interactive vendor payment logging (Actual Spent vs. Estimated).
   - One-click **CSV Export** for financial audits.
   - **Upcoming Vendor Payment Notifications** synced automatically to the Command Center.
4. **Living Timeline & Run-Sheet**: Gantt-style milestone tracker with owner assignment, priority badges, and drag-to-reschedule support.
5. **Aesthetic Moodboard Studio**: Visual concept direction with moodboard previews, decor directions, and custom palettes.
6. **Vendor Matchbook & Automated Enquiry**: AI-powered business email generator for venue and vendor enquiries based on guest dietary specs and event vibe.
7. **ÉLAN Intelligence Copilot (What-If Simulator)**: Natural language prompt simulator allowing hosts to model scenario trade-offs (e.g. +30 guests, -15% budget cut, zero-waste transition).

---

## 🏗️ Technical Architecture & Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS (v4) + Motion + Recharts + Lucide Icons.
- **Backend Server**: Node.js + Express (`server.ts`) with Vite Dev Server Middleware.
- **AI Service**: Google GenAI SDK (`@google/genai`) powered by `gemini-3.8-flash`.
- **Database Engine**: Modular JSON File Database (`/data/events.json`) managed via `src/db/database.ts` with auto-seeding, backup export, and CLI seed tools.

---

## 📁 Repository Structure

```
├── data/
│   └── events.json             # Persistent database file storing active event ledgers
├── src/
│   ├── assets/                 # High-resolution moodboard images
│   ├── components/             # Modular UI components (Budget, Timeline, Copilot, etc.)
│   ├── data/                   # Default sample events data
│   ├── db/
│   │   ├── database.ts         # Database abstraction service (CRUD, seed, backup, stats)
│   │   └── seed.ts             # CLI script for seeding sample event data
│   ├── services/
│   │   └── api.ts              # Client REST API fetcher
│   ├── types/
│   │   └── event.ts            # TypeScript schemas & models
│   ├── App.tsx                 # Core application controller
│   └── main.tsx                # Entry point
├── server.ts                   # Full-stack Express backend server & API endpoints
├── index.html                  # HTML entry point with meta tags & typography
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite bundle configuration
├── .env.example                # Environment variables template
└── README.md                   # Complete repository documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn or bun

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/elan-ai-event-planner.git
cd elan-ai-event-planner
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory (based on `.env.example`):
```env
GEMINI_API_KEY="your_gemini_api_key_here"
PORT=3000
```
> *Note: If `GEMINI_API_KEY` is omitted, the app will gracefully utilize instant smart fallback templates for event planning and scenario simulation.*

### 3. Database Seeding
Initialize the persistent database with sample events:
```bash
npm run seed
```

### 4. Run Development Server
Start the full-stack server (runs Express + Vite Dev Middleware):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚡ Production Build & Execution

To compile the project for production deployment:
```bash
# Build Vite frontend assets
npm run build

# Start production Express server
npm start
```

---

## 🔌 API Endpoints Reference

### System & Database
- `GET /api/health` — System status, uptime, and DB stats.
- `GET /api/db/stats` — Database record metrics.
- `GET /api/db/export` — Download full JSON backup of database.
- `POST /api/db/reset` — Reset database to baseline sample events.

### Events & Financials
- `GET /api/events` — Fetch all events.
- `GET /api/events/:id` — Fetch event details by ID.
- `POST /api/events` — Create custom event record.
- `PUT /api/events/:id` — Update existing event ledger.
- `DELETE /api/events/:id` — Remove event from database.

### AI Engine
- `POST /api/events/ai-generate` — AI concept generator from natural language brief.
- `POST /api/events/:id/copilot` — Scenario & What-If proposal engine.
- `GET /api/events/:id/integrity` — Financial & timeline health audit.
- `POST /api/events/:id/enquiry` — Automated vendor enquiry generator.

---

## 📤 Pushing to GitHub

To push this complete working application to your GitHub account:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Stage all files (backend, database layer, frontend, config)
git add .

# 3. Create your initial commit
git commit -m "feat: complete full-stack ÉLAN AI Event Planner with Express backend & database layer"

# 4. Rename main branch
git branch -M main

# 5. Add your remote repository URL
git remote add origin https://github.com/your-username/elan-ai-event-planner.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for details.
