# Spotify Clone

A full-stack Spotify clone built with Next.js, featuring a dark theme, music playback, and Persian (Farsi) RTL support.

## Features

- **Music Player** – Play, pause, skip, volume control, progress bar
- **Authentication** – Sign up / Log in with NextAuth & bcrypt
- **Albums & Artists** – Dedicated pages with song listings
- **Playlists** – Create and manage custom playlists
- **Liked Songs** – Save your favorite tracks
- **Search** – Real-time search for songs, albums, and artists
- **Subscription System** – Free, Premium Monthly, and Premium Yearly plans
- **Persian (Farsi) Support** – Full RTL layout with Vazirmatn font + language switcher
- **Spotify Dark Theme** – Authentic dark green/black color scheme

## Tech Stack

| Technology  | Purpose          |
| ----------- | ---------------- |
| Next.js 16  | Framework        |
| TypeScript  | Language         |
| Tailwind v4 | Styling          |
| Prisma 7    | ORM              |
| SQLite      | Database         |
| NextAuth    | Authentication   |
| Zustand     | State management |
| bcryptjs    | Password hashing |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file (already provided):

```
DATABASE_URL="file:./prisma/dev.db"
```

### 3. Generate Prisma client & push schema

```bash
npx prisma db push
```

### 4. Seed the database

```bash
npx tsx prisma/seed.ts
```

This creates 6 artists, 7 albums, 29 songs, and a demo user.

### 5. Start the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Demo Account

- **Email:** `demo@example.com`
- **Password:** `password123`

## Project Structure

```
src/
├── app/
│   ├── album/[id]/     – Album page
│   ├── playlist/[id]/  – Playlist page
│   ├── search/         – Search page
│   ├── library/        – Library page
│   ├── subscription/   – Subscription page
│   └── api/            – API routes
├── components/
│   ├── Sidebar.tsx     – Navigation sidebar
│   ├── Player.tsx      – Music player bar
│   ├── SongCard.tsx    – Song/album/artist cards
│   ├── SongList.tsx    – Song list table
│   ├── AuthModal.tsx   – Login/signup modal
│   ├── LanguageSwitcher.tsx
│   └── Provider.tsx    – NextAuth session provider
└── lib/
    ├── prisma.ts       – Prisma client
    ├── auth.ts         – NextAuth config
    ├── store.ts        – Zustand player store
    ├── lang.tsx        – i18n & RTL context
    ├── types.ts        – TypeScript types
    └── utils.ts        – Utility functions
```

## API Endpoints

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| GET    | `/api/songs`          | List popular songs    |
| GET    | `/api/albums`         | List all albums       |
| GET    | `/api/albums/[id]`    | Album details         |
| GET    | `/api/search?q=`      | Search songs/albums   |
| GET    | `/api/playlists`      | List user playlists   |
| POST   | `/api/playlists`      | Create playlist       |
| GET    | `/api/playlists/[id]` | Playlist details      |
| POST   | `/api/playlists/[id]` | Add song to playlist  |
| GET    | `/api/liked`          | Liked songs           |
| POST   | `/api/liked`          | Toggle like song      |
| GET    | `/api/subscription`   | Get subscription      |
| POST   | `/api/subscription`   | Purchase subscription |
| POST   | `/api/auth/register`  | Register user         |

## License

MIT
