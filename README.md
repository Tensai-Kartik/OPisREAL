# 🏴‍☠️ OPisReal - One Piece Character Guessing Game

> **"THE ONE PIECE IS REAL!"** — An interactive, canonical daily One Piece character guessing game built with Next.js 16 (App Router), TypeScript, Tailwind CSS, and Supabase.

---

## 🎮 Overview

**OPisReal** is a Wordle/Loldle-style deduction game for One Piece fans. Guess the secret canonical character with smart clue reveals, directional numerical indicators, multi-attribute comparisons, and dynamic theme switching.

### ✨ Features
- **🎯 Deduction Game Engine**: Real-time comparison of Gender, Race, Affiliation, Status, Devil Fruit (Type & Japanese/English model), Haki types (Conqueror's, Armament, Observation), Bounty, Age, Height, Debut Chapter & Arc, and Origin.
- **⬆️ Directional Numerical Comparisons**: Precise higher/lower indicators for Bounties (including `None` & `Unknown`), Ages, and Heights.
- **💡 Progressive Clues System**:
  - Clue 1 (after 3 guesses): Silhouette / Epithet clue.
  - Clue 2 (after 6 guesses): First spoken quote / voice line clue.
  - Clue 3 (after 9 guesses): Affiliation / Arc reveal clue.
- **🏳️ Surrender Modal**: "I Give Up" feature with pirate-themed **⚔️ Tatakae (Fight)** vs **🏳️ Surrender** confirmation.
- **🌓 Dynamic Dual-Theming**: Sleek pirate-themed Dark Mode and high-contrast Light Mode.
- **🖼️ Rich Animated Backgrounds**: High-resolution One Piece wallpapers with Supabase Storage CDN integration and local fallback.
- **🛡️ Admin Backoffice**:
  - **Canonical Character Manager**: Edit, curate facts, and manage multi-select attributes.
  - **Missing Critical Attributes Queue**: Multi-page pagination to complete canon data.
  - **Conflict Resolver**: Consensus tracking across multiple data sources.
  - **Player Feedback Inbox**: Review in-game suggestions and bug reports.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (Turbopack, App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Design Tokens
- **Database & Storage**: [Supabase](https://supabase.com/) (PostgreSQL + Storage Buckets)
- **Icons & Animations**: [Lucide React](https://lucide.dev/), [Canvas Confetti](https://github.com/catdad/canvas-confetti)

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Tensai-Kartik/OPisREAL.git
cd OPisREAL
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GAME_SECRET_KEY=your-secret-key-2026
ADMIN_PASSWORD=your-admin-password
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License & Disclaimer

This project is an unofficial fan-made game for educational and entertainment purposes. All One Piece characters, artwork, and names are the intellectual property of Eiichiro Oda, Shueisha, and Toei Animation.
