# AniBrain.ai Clone — Source References

This document catalogs all sources used during the investigation and reconstruction of AniBrain.ai. Collected June 2026.

---

## 🧬 Recovered Source Code

### Core ML Model (MIT License)
- **Repo**: https://github.com/AniBrainAI/AniBrain-Anime_LDA_Topic_Similarity_Model
- **Contents**: LDA Mallet model, FastAPI wrapper, Dockerfile, Jupyter notebook
- **Used for**: Understanding original ML architecture (we upgraded to SBERT)
- **Creator's org**: https://github.com/AniBrainAI

### API Consumers (Reverse-Engineered Endpoints)
- **Teemii** (Node.js manga reader): https://github.com/dokkaner/teemii
  - Agent file: `server/src/agents/agent.anibrainai.js`
  - Revealed: `/api/-/recommender/autosuggest`, `/api/-/recommender/recs/manga`, algorithm weights
- **AnymeX** (Dart/Flutter tracker): https://github.com/RyanYuuki/AnymeX
  - Agent file: `lib/ai/animeo.dart`
  - Revealed: `/api/-/recommender/recs/external-list/super-media-similar`, `/api/-/list/{provider}/fetch-list`, `/api/-/super-media/external-list/create-similar`, pagination (30/page), filter params

### Other Projects Referencing AniBrain
- **astream-extension**: https://github.com/kuronekony4n/astream-extension
  - Site config for recommender page URLs
- **manga-story**: https://github.com/developerrahulofficial/manga-story
  - Listed AniBrainAI as a data source (no direct API usage)
- **darkreader**: https://github.com/darkreader/darkreader
  - Had special CSS fix for `anibrain.ai`

---

## 🌐 Wayback Machine Archives

### Site Pages (Best Snapshots)
| Page | URL | Date |
|------|-----|------|
| Homepage | https://anibrain.ai/ | 2023-01-25 |
| About | https://anibrain.ai/about | 2024-12-01 |
| Roadmap/Changelog | https://anibrain.ai/roadmap | 2025-04-08 |
| Login | https://anibrain.ai/login | 2023-02-03 |
| Signup | https://anibrain.ai/signup | 2025-01-15 |
| Forgot Password | https://anibrain.ai/forgot-password | 2024-08-14 |
| Random (roulette UI) | https://anibrain.ai/recommender/random | 2022-12-02 |
| One Piece profile | https://anibrain.ai/recommender/anime/21 | 2023-09-30 |
| Cross-category example | https://anibrain.ai/cross-category/recommendations/manga-to-anime/112570 | 2024 |
| Collection create | https://anibrain.ai/collection/create | 2025-04-09 |
| About Chronicles | https://anibrain.ai/about/chronicles | 2024-11-08 |
| About Collections | https://anibrain.ai/about/collection | 2024-11-08 |
| Privacy Policy | https://anibrain.ai/privacy-policy | 2024-12-01 |
| Terms of Service | https://anibrain.ai/terms-of-service | 2024-11-08 |

### Infrastructure Files
| File | URL |
|------|-----|
| robots.txt | https://web.archive.org/web/20230411084141/https://www.anibrain.ai/robots.txt |
| sitemap.xml | https://web.archive.org/web/20241201230902/https://anibrain.ai/sitemap.xml |
| sitemap-core.xml | https://web.archive.org/web/20241201230956/https://anibrain.ai/sitemap-core.xml |

### API Response Samples (CDX Captures)
| Endpoint | Status | Date |
|----------|--------|------|
| `/api/-/info/anime?mediaId=Anime/12477` | 200 | 2024-09-13 |
| `/api/-/info/manga?mediaId=Manga/110926` | 200 | 2023-06-03 |
| `/api/-/misc/get-tags?adult=false&mediaType=ANIME` | 200 | 2024-02-13 |
| `/api/-/misc/get-tags?adult=false&mediaType=MANGA` | 200 | 2024-02-13 |
| `/api/-/misc/get-tags?adult=false&mediaType=NOVEL` | 200 | 2024-02-13 |
| `/api/-/misc/get-tags?adult=false&mediaType=ONE_SHOT` | 200 | 2024-02-13 |
| `/api/-/list/anilist/fetch-list?profileId=eragon` | 200 | 2024-02-17 |
| `/api/-/collection/public/read-collection-media?collectionId=Collection/1982` | 200 | 2026-02-09 |
| `/api/-/randomizer/recs/anime` | 200 | 2024 |
| `/api/-/randomizer/recs/count/anime` | 200 | 2024 |
| `/api/-/randomizer/recs/manga` | 200 | 2024 |
| `/api/-/personalization/recs/mixed-random-initial` | 200 | 2025 |

---

## 📝 Creator's Content

### Reddit Posts by Creator (FunctionAgitated4932 / Chidi)
| Subreddit | Date | Content |
|-----------|------|---------|
| r/anime | 2021-12-15 | Launch: "I created an AI-based anime recommendation site!" |
| r/anime | 2022-03-14 | V2: "I updated my AI-based anime recommender to include manga, LNs!" |
| r/manga | 2022-03-14 | Mirror: "I created an AI-based manga recommender site" |

### Blog Posts
| Blog | URL | Content |
|------|-----|---------|
| Hashnode (dev blog) | https://blog.anibrain.ai/ | 3 posts (Jun 2023): ML migration, data pipeline, AniList consolidation |
| Guest post | https://drunkenanimeblog.com/2022/04/15/ | Description of UI, similarity scores, anti-popularity approach |
| Medium | https://anibrain.medium.com/ | 1 post about design reviews (not tech) |
| Personal blog | https://www.chidi.me/ | "Endeavor" blog, ML posts |

### Social/Professional
| Platform | Handle/Link | Details |
|----------|-------------|---------|
| LinkedIn | /in/chidiu98 | Chidiebele "Chidi" Udeze, SWE III @ Reddit, prev Microsoft |
| GitHub | /chidi-udeze | Mostly forks, hcwe repo (unrelated) |
| GitHub (org) | /AniBrainAI | LDA model + react-render-if-visible fork |
| Indie Hackers | @ChidiHacks | "aspiring profitable solopreneur" |
| Twitter | @ChidiUdeze_ | Referenced on Indie Hackers (account not confirmed active) |

### Shutdown
| Source | URL | Content |
|--------|-----|---------|
| Farewell page | https://closing.anibrain.ai/ | "Thank You for 4 Amazing Years" — no reasons given |
| Mirror | https://anibrain-closure.pages.dev/ | Same content, Cloudflare Pages |
| EverythingMoe | https://everythingmoe.com/changelog/1778005509 | Confirms shutdown date: May 5, 2026 |

---

## 📊 Traffic & Infrastructure

### Traffic Data
| Month | Visits | Source |
|-------|--------|--------|
| March 2026 | ~1,492,000 | Semrush |
| April 2026 | ~754,000 | Semrush |
| May 2026 | ~105,000 | Semrush |

### Infrastructure Clues
| Clue | Evidence Source |
|------|----------------|
| Node.js/Express backend | `x-powered-by: Express` header in Wayback captures |
| Next.js frontend | `_next/static/chunks/` paths in HTML source |
| Cloudflare CDN | `server: cloudflare`, `cf-ray` headers |
| DigitalOcean Spaces | Image URLs: `anibrain-images.sfo3.cdn.digitaloceanspaces.com` |
| DigitalOcean Droplet | Blog post Ch.2: "migrating ML to Digital Ocean" |
| NitroPay ads | HTML: `<script id="nitro-pay-ad-setup-init-one">` |
| Sentry monitoring | Blog post mentions error tracking |
| Cronitor monitoring | Blog post mentions pipeline monitoring |

---

## 📋 Technical Reference

### Algorithm Weights (from Teemii agent code)
| Dimension | Weight |
|-----------|--------|
| Genre | 0.3 |
| Setting | 0.15 |
| Synopsis | 0.4 |
| Theme | 0.2 |

### ID Format
`{MediaType}/{anilistId}` — e.g., `Anime/21`, `Manga/110926`

### Response Envelope
```json
{
  "data": {},
  "code": 200,
  "metadata": { "cache": true }
}
```

### Data Sources
| Source | API Type | Status at Shutdown |
|--------|----------|-------------------|
| AniList | GraphQL (https://graphql.anilist.co) | Primary (consolidated) |
| MyAnimeList | REST (Jikan API) | Deprecated (kept breaking) |
| Kitsu | JSON:API | Deprecated (reliability issues) |

---

## 🗺️ Site Map (Reconstructed)

### Core Pages
- `/` — Homepage
- `/about` — About
- `/roadmap` — Changelog
- `/search` — Global search
- `/login` — Login
- `/signup` — Sign up
- `/forgot-password` — Password reset
- `/privacy-policy` — Privacy
- `/terms-of-service` — Terms
- `/rss` — RSS feeds

### Recommender
- `/recommender/anime` — Anime search
- `/recommender/anime/[id]` — Anime profile + recs
- `/recommender/manga` — Manga search
- `/recommender/manga/[id]` — Manga profile + recs
- `/recommender/light-novel` — LN search
- `/recommender/light-novel/[id]` — LN profile + recs
- `/recommender/one-shot` — One shot search
- `/recommender/one-shot/[id]` — One shot profile + recs

### Random
- `/random/{anime,manga,light-novel,one-shot}` — Roulette UI
- `/random/{type}/list` — List view

### Integrations
- `/integrations/anilist` and sub-pages per type
- `/integrations/myanimelist` and sub-pages per type

### Cross-Category (12 paths)
- `/{source}-to-{target}/[id]` for all combinations of anime/manga/ln/one-shot

### Collections
- `/collection/create`
- `/collection/[id]`
- `/collection/[id]/remix`

### User
- `/profile/[username]` — About/Created/Saved tabs

### Other
- `/motion` — Social feed (beta)
- `/forms/feedback`
- `/forms/lets-collaborate` (removed v2.0.7)

### Subdomains
- `chronicles.anibrain.ai` → redirected to `animedna.anibrain.ai`
- `animedna.anibrain.ai` — AnimeDNA social platform (waitlist)

---

## 💾 Version History (from Roadmap)

| Version | Date | Key Changes |
|---------|------|-------------|
| 1.0 | Jul 2021 | Initial anime recommender |
| 1.2 | Dec 2021 | User accounts, Next.js migration |
| 1.3 | Apr 2022 | Manga/LN/one-shot, random generator |
| 2.0.0 | Nov 2023 | AniList/MAL integration |
| 2.1.0 | Feb 2024 | Cross-category recommendations |
| 2.2.0 | Apr 2024 | Ads (NitroPay) "to pay the bills" |
| 2.3.0 | May 2024 | Collections |
| 2.4.0 | Jul 2024 | Profile redesign, custom avatars |
| 2.4.5 | Aug 2024 | "Motion" social feed (last version) |
| ~May 2026 | — | Site shut down |

---

## 🔍 Shutdown Analysis Sources

| Finding | Source |
|---------|--------|
| Shutdown date: May 5, 2026 | EverythingMoe changelog |
| Traffic collapse: 754K→105K | Semrush |
| API commercial terms (>$150/mo requires license) | AniList Terms of Use |
| MAL API kept breaking | Blog Ch.3 |
| Consolidation to AniList-only | Blog Ch.3 |
| "reclaim my time" quote | Blog Ch.3 |
| Creator at Reddit (Jul 2024+) | LinkedIn |
| Creator building MathBoard | LinkedIn |
| Zero revenue / "aspiring profitable" | Indie Hackers |
| Ads added "to pay the bills" | Roadmap v2.2.0 |
| User offered to donate for costs | Reddit comment |
| No DMCA/legal issues found | Google Copyright Transparency (no data) |
| Domain not for sale | WHOIS status |
| No competitive takeover | Sprout project still active independently |
