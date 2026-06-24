# AniBrain Clone 🧠📺

AI-powered anime and manga recommendation engine — a functional clone of the original [AniBrain.ai](https://anibrain.ai), rebuilt from recovered source code, reverse-engineered API endpoints, and Wayback Machine archives.

## Why This Exists

The original AniBrain.ai (by Chidi Udeze) shut down on May 5, 2026 after 4.5 years of operation. It was a solo-built, content-based recommendation engine that focused on plot similarity over popularity — helping users discover hidden gems. It was taken down due to a combination of burnout, API licensing costs, and zero monetization.

This clone preserves the spirit and features of the original while making it sustainable (monetized from day 1, automated pipeline, modern ML).

## Architecture

```
Frontend (Next.js + Tailwind)    →  Vercel (free)
    ↓ API calls
Backend API (Node.js/Express)    →  Render (free tier)
    ↓ proxy
ML Engine (FastAPI + SBERT)      →  Render (free tier)
    ↑ loads
FAISS Index (pre-built)          →  GitHub Actions (weekly cron)
    ↑ built by
Data Pipeline (Python)           →  GitHub Actions (weekly)
    ↑ fetches from
AniList API (GraphQL)
```

## Project Structure

```
anibrain-clone/
├── frontend/          # Next.js 14+ App Router + Tailwind CSS
│   ├── src/app/       # 37+ pages matching original site map
│   └── src/components/# Header, Footer, MediaCard, FilterSidebar, etc.
├── backend/           # Node.js/Express API
│   ├── controllers/   # 8 feature controllers
│   ├── routes/        # 9 route files (17+ endpoints)
│   ├── models/        # PostgreSQL models
│   ├── middleware/     # Auth, rate limiting, error handling, ML proxy
│   └── db/            # Migration + seed scripts
├── ml-engine/         # Python FastAPI recommendation engine
│   ├── main.py        # FastAPI server with /recommend, /from-text, /health
│   ├── seed_index.py  # Build FAISS index from seed data
│   └── seed_data.json # 50+ sample anime for testing
├── data-pipeline/     # AniList ETL pipeline
│   ├── fetch_anilist.py      # Paginated data fetcher
│   ├── clean_data.py         # HTML stripping + normalization
│   ├── build_features.py     # Feature text construction
│   ├── generate_embeddings.py # SBERT encoding
│   ├── build_index.py        # FAISS index builder
│   └── run_pipeline.py       # Orchestrator
├── .github/workflows/
│   ├── data-pipeline.yml     # Weekly AniList data fetch + index rebuild
│   └── ci.yml                # Lint + build checks
├── docker-compose.yml        # Full stack local dev
└── render.yaml               # Render deployment config
```

## Quick Start (Local Dev)

```bash
# 1. Start the ML Engine
cd ml-engine
pip install -r requirements.txt
python seed_index.py   # Build FAISS index
uvicorn main:app --port 8000

# 2. Start the Backend
cd backend
npm install
cp .env.example .env   # Edit DATABASE_URL
npm run migrate
npm run seed
npm run dev

# 3. Start the Frontend
cd frontend
npm install
npm run dev
```

## Deploy to Production

### 1. Frontend → Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AKA-Twizzler/anibrain-clone&root-directory=frontend)

### 2. Backend + ML Engine → Render
- Go to [dashboard.render.com](https://dashboard.render.com)
- Click "New +" → "Blueprint"
- Connect your GitHub repo
- Render will read `render.yaml` and auto-configure both services
- Set `DATABASE_URL` to your Supabase PostgreSQL connection string

### 3. Database → Supabase (Free)
- Go to [supabase.com](https://supabase.com)
- Create a new project
- Copy the PostgreSQL connection string
- Set it as `DATABASE_URL` in Render

### 4. Data Pipeline → GitHub Actions
- Runs automatically every Monday at 06:00 UTC
- Can also be triggered manually: Actions → Data Pipeline → Run workflow

## Features

| Feature | Status |
|---------|--------|
| Anime recommendations (plot-based) | ✅ |
| Manga recommendations (plot-based) | ✅ |
| Cross-category recommendations | ✅ (12 paths) |
| Random generator (roulette UI) | ✅ |
| AniList integration | ✅ |
| MyAnimeList integration | ✅ |
| Collections (create/remix) | ✅ |
| User voting on recommendations | ✅ |
| Reviews | ✅ |
| User auth (email/password) | ✅ |
| Dark/light theme | ✅ |
| Global search | ✅ |
| Monetization (Pro tier) | 🔧 Planned |

## Tech Stack

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL, JWT
- **ML Engine**: Python, FastAPI, sentence-transformers, FAISS
- **ML Model**: all-MiniLM-L6-v2 (384-dim SBERT embeddings + cosine similarity)
- **Data Source**: AniList GraphQL API
- **CI/CD**: GitHub Actions, Vercel, Render

## License

MIT
