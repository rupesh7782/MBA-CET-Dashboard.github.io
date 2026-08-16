# MISSION JBIMS 2027

A comprehensive MBA Entrance Preparation & Productivity Platform built for aspirants targeting Jamnalal Bajaj Institute of Management Studies (JBIMS) and top B-schools (MBA CET, CAT, XAT, NMAT, SNAP).

---

## 🚀 Features

- **Dashboard**: Real-time JBIMS target metrics, CET 2027 countdown timer, daily study hours, mock performance trends, syllabus progress, and daily quote.
- **Syllabus Tracker**: Comprehensive chapter-wise & subtopic tracking for VARC, LRDI, AR, and Quant with status filters, practice question counters, and accuracy indicators.
- **Full-Length Mock Tracker**: Track CET mock tests (200 Questions / 150 Mins), sectional scores (VARC 50, LRDI 75, AR 25, Quant 50), questions attempted, accuracy %, and estimated percentiles.
- **Sectional Tests & Speed Drills**: Log subject-specific speed drills with score, questions attempted, and accuracy tracking.
- **Study Timers**: Pomodoro and Stopwatch modes with interactive timers, session tracking, and audio chimes.
- **Notes & Cheatsheets**: Markdown-supported rich notes organizer with category tags, pinning, and full-text search.
- **Daily Reading Material**: Curated daily editorials from The Hindu, Indian Express, Mint, Aeon Essays, and Project Syndicate with built-in reading timer and comprehension notes.
- **PDF Library**: Store and view preparation PDFs, formula booklets, and previous year question papers.
- **Daily Habit Tracker**: Track daily preparation rituals (e.g. Speed Math, 2 RCs, 30 Mins Vocab) with 7-day streak counters.
- **Target Goals**: Short-term and long-term milestones with deadline countdowns and progress bars.
- **Target College Profile**: Detailed JBIMS profile, batch stats, percentile cutoffs, and salary benchmarks.
- **Vault & Backup**: Export/Import preparation data as JSON backups.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Motion, Recharts, Canvas Confetti
- **Backend / API**: Express.js (Node.js) with Google Gemini AI integration
- **State Management**: React Context with LocalStorage & IndexedDB offline-first persistence

---

## 💻 Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

### Installation

1. **Extract / Clone the project**:
   ```bash
   cd mission-jbims-2027
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (Optional)**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

### Production Build

To test or generate the production build:
```bash
npm run build
npm start
```
