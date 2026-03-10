# Isai Flow – Tamil Internet Radio Aggregator

![Vibe Coding](https://img.shields.io/badge/Vibe-Coding-FF69B4?style=for-the-badge&logo=rocket)
[![Build Status](https://github.com/gurubaladhinesh/isai-flow/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/gurubaladhinesh/isai-flow/actions/workflows/build.yml)
![GitHub stars](https://img.shields.io/github/stars/gurubaladhinesh/isai-flow?style=for-the-badge&color=FFD700)
![GitHub forks](https://img.shields.io/github/forks/gurubaladhinesh/isai-flow?style=for-the-badge&color=blue)
![GitHub issues](https://img.shields.io/github/issues/gurubaladhinesh/isai-flow?style=for-the-badge)
![Built with Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)


Isai Flow is a single-page **Tamil internet radio** web app built with **Next.js (App Router)**, **Tailwind CSS**, and **Lucide Icons**. It aggregates Tamil radio stations from the Radio Browser API and provides a Spotify-like listening experience.

**Live at: [https://www.isaiflow.in/](https://www.isaiflow.in/)**

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **UI**: Tailwind CSS, Lucide Icons
- **Language**: TypeScript / React
- **Data Source**: [Radio Browser API](https://www.radio-browser.info/)

## Features

- Curated **Tamil** internet radio stations (tag-based search).
- Only **HTTPS** streams are used (suitable for Vercel/Railway, avoids mixed content).
- Global audio player with:
  - Play / Pause
  - Volume control
  - Persistent `<audio>` element across navigation
- Recent stations list in the sidebar.
- Responsive station grid with up to **8 tiles per row** on large screens.
- Loading skeletons for smooth perceived performance.
- GitHub link badge: “created using vibe coding”.

## Local Development

```bash
git clone https://github.com/gurubaladhinesh/isai-flow.git
cd isai-flow

npm install
npm run dev
```

Then open `http://localhost:3000` in your browser.