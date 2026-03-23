# StudyCoach · SAT AI Coach

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Stack
- **React 18** + Vite
- **Zustand** — state management
- **Anthropic API** — AI Tutor + plan generation

## Structure
```
src/
├── app/          App.jsx + routes
├── components/   ui/ + layout/
├── features/     dashboard, test, focus, ai, errors, analytics, progress, onboarding, plan, profile
├── data/         constants.js + questions.js
├── hooks/        useLocalStorage.js + useProgress.js (engine)
├── store/        appStore.js (Zustand)
└── styles/       global.css
```

## Features
- 🧪 20-question SAT Diagnostic (4 modules)
- 📅 AI Daily Plan (weighted difficulty)
- 🎯 Focus Mode (8 test types, timer, adaptive difficulty)
- 🔮 Future Score Predictor (interactive slider)
- 📉 Skill Decay (skills fade without practice)
- 🏆 Rank System (Novice → Elite)
- 🗓 Activity Heatmap (GitHub-style)
- ⏱ Speed Tracking per subject
- ✦ AI Tutor (explain + mini-test)
- 🔍 Error Review + Analytics
- 🔊 Sound feedback + vibration
- 💾 Export/Import backup

## API Key
The app calls Anthropic API directly from browser.
For production, proxy through your own backend.
