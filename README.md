# DevPulse 

> **The Developer's Interview OS** — Track. Analyse. Land the Offer.

A full-stack MERN application for tracking technical interviews, analysing weaknesses with OpenAI, collaborating in live mock rooms, and sharing public prep cards.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite, Tailwind CSS v4, React Router v7, Zustand |
| Backend | Node.js, Express.js, Mongoose, Socket.io, JWT |
| AI | OpenAI GPT-4o-mini (server-side only) |
| Cache | Upstash Redis (REST API) |
| Database | MongoDB Atlas |

---

## Features

- **🔐 Auth** — JWT access (15min) + refresh tokens (7d httpOnly cookie)
- **📋 Interview Logger** — Log company, role, round, outcome, difficulty, topics, notes
- **📊 Dashboard** — Stats cards, topic heatmap (Recharts), streak calendar, radar chart
- **🤖 AI Weakness Analyser** — OpenAI GPT-4o-mini finds your top 3 weak areas + study plan (3 calls/day limit via Redis)
- **💻 Live Mock Rooms** — Real-time collaborative code editor + chat via Socket.io
- **🏆 Leaderboard** — Top companies and failed topics community-wide (Redis cached 10min)
- **🔗 Public Prep Card** — Shareable `/u/:username` profile page
- **🌓 Light/Dark Theme** — Toggle persisted to localStorage

---

## Project Structure

```
DevPulse/
├── client/          # React + Vite frontend
└── server/          # Express + Socket.io backend
```

---

## Setup & Running Locally

### 1. Clone / Enter project
```bash
cd D:\DevPulse
```

### 2. Configure environment variables

**Server** — edit `server/.env` (only file you need to touch):
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=generate_64_random_bytes
JWT_REFRESH_SECRET=generate_64_random_bytes
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Generate JWT secrets:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Client** — edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 3. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 4. Start development servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

App runs at: `http://localhost:5173`  
API runs at: `http://localhost:5000`

---

## Environment Variables Reference

### `server/.env` (single source of truth for all secrets)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Access token signing secret (64 random bytes) |
| `JWT_REFRESH_SECRET` | Refresh token signing secret (64 random bytes) |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `OPENAI_MODEL` | Model to use (default: `gpt-4o-mini`) |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |
| `PORT` | Server port (default: 5000) |
| `CLIENT_URL` | Frontend URL for CORS |
| `NODE_ENV` | `development` or `production` |

### `client/.env`

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend URL (use Railway/Render URL in production) |

---

## Deployment

### MongoDB Atlas
1. Create free M0 cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Whitelist `0.0.0.0/0` (for dynamic IPs on Railway/Render)
3. Copy connection string → paste into `server/.env`

### Upstash Redis
1. Create free Redis DB at [upstash.com](https://upstash.com)
2. Copy REST URL + Token → paste into `server/.env`

### Backend (Railway or Render)
1. Push `server/` to GitHub
2. Create new service → connect repo
3. Set all env vars from `server/.env`
4. Start command: `node server.js`

### Frontend (Vercel)
1. Push `client/` to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Set `VITE_API_URL` to your Railway/Render backend URL
4. Build command: `npm run build`, output: `dist`

---

## API Reference

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me

GET    /api/interviews              # Filterable: outcome, company, topic, date, search
POST   /api/interviews
GET    /api/interviews/:id
PUT    /api/interviews/:id
DELETE /api/interviews/:id

POST   /api/ai/analyse              # OpenAI analysis (3/day per user via Redis)
GET    /api/ai/last-analysis

POST   /api/rooms/create
GET    /api/rooms/:code
POST   /api/rooms/:code/join

GET    /api/leaderboard/companies   # Redis cached 10min
GET    /api/leaderboard/topics

GET    /api/users/:username/prepcard   # Public — no auth
```

All responses: `{ success: true, data: ... }` or `{ success: false, message: "..." }`

---

## Socket.io Events

| Event | Direction | Payload |
|---|---|---|
| `room:join` | Client → Server | `{ roomCode, userId, username }` |
| `room:state` | Server → Client | `{ code, language }` |
| `room:code-update` | Bidirectional | `{ roomCode, code }` |
| `room:language-change` | Bidirectional | `{ roomCode, language }` |
| `room:message` | Bidirectional | `{ roomCode, text }` |
| `room:participants` | Server → Client | `[{ userId, username }]` |
| `room:leave` | Client → Server | `{ roomCode }` |

## Built by

**Aditya Matta**  
B.Tech CST - MAIT, GGSIPU  
[LinkedIn](https://www.linkedin.com/in/aditya-matta1922/) · [GitHub](https://github.com/Aditya-Matta)
