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

### Optional: Public Repo Link

Set this to point the header GitHub badge to the correct repository:

```bash
# .env.local
NEXT_PUBLIC_GITHUB_REPO_URL=https://github.com/gurubaladhinesh/isai-flow
```

## Railway Deployment

1. Push your code to GitHub (already done for this repo).
2. Go to [Railway](https://railway.app) and create a **New Project** → **Deploy from GitHub repo**.
3. Choose `gurubaladhinesh/isai-flow`.
4. Railway (via Nixpacks) should auto-detect commands:
   - **Install**: `npm install`
   - **Build**: `npm run build`
   - **Start**: `npm run start`

If these appear as editable fields, set them explicitly to:

```bash
npm install
npm run build
npm run start
```

### Railway Environment Variables

In the Railway service **Variables** section, add:

```bash
NEXT_PUBLIC_GITHUB_REPO_URL=https://github.com/gurubaladhinesh/isai-flow
```

No secrets are required for the Radio Browser API — it’s a public HTTPS endpoint.

Once deployed, Railway will give you a URL such as `https://<project-name>.up.railway.app`, which will serve the production build of Isai Flow.

## License

This project is currently unlicensed. If you intend to reuse or redistribute it, please add an appropriate license file first.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
