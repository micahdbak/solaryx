# Solaryx

**Mountain Madness 2026 Hackathon: "Dr. Jekyll and Mr. Hyde"**

Solaryx is a Solana-based charity donation platform with a twist: the noble narrative of donating to charities is contrasted directly with the inherently addictive and negative effects of gambling: embodying a good doctor (Dr. Jekyll) by day, and an evil murderer (Mr. Hyde) by night.

In Solaryx, users pit charitable organizations against one another in head-to-head markets. Participants purchase shares in a market to back their chosen recipient. When a market closes, a roulette wheel spins to decide which charity receives the *entire* pool of shares. A charity's probability of winning is directly proportional to the percentage of the market cap bought in their name.

## Systems Overview

To support this high-stakes charity market, Solaryx relies on a robust architecture spanning frontend, backend, database, and blockchain integrations:

```
┌───────────┐     ┌───────────┐     ┌────────────┐
│ SvelteKit │────▶│  Express  │────▶│ PostgreSQL │
│ :5173     │/api │  :3000    │     │ sorbet     │
└───────────┘     └────┬──────┘     └────────────┘
                       │
                       ▼
                 ┌──────────┐
                 │ Solana   │
                 │ RPC Node │
                 └──────────┘
```

- **Frontend (SvelteKit & Tailwind CSS)**: The client application presents the head-to-head charity markets, real-time market share visualizations, and the thrilling roulette wheel animations. It handles user authentication, profile management, wallet operations, and live market updates.
- **Backend (Express.js REST API)**: Manages core business logic including JWT-based authentication, user balances, charity configuration, market lifecycles, and cryptographically resolving market winners (the "roulette spin").
- **Database (PostgreSQL)**: Maintains the ledger of users, profiles, charities, active and completed markets (`JEKYLL` and `HYDE` types), shares (bets), deposits, coupons, and payouts in a highly relational schema.
- **Blockchain (Solana)**: Solaryx integrates with the Solana blockchain via RPC. Users deposit SOL to play, and when a market concludes, an automated on-chain transaction distributes the massive aggregated prize pool straight to the winning charity's Solana wallet address.
- **Reverse Proxy (Nginx)**: Used in production environments to route traffic correctly to the SvelteKit frontend and the Express backend API.

---

## Development Setup

### Prerequisites

- Node.js ≥ 18
- PostgreSQL ≥ 14

### 1. Install PostgreSQL

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update && sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

### 2. Create the database

```bash
createdb sorbet
psql -d sorbet -f db.sql
```

To populate with sample data:
```bash
psql -d sorbet -f seed.sql
```

### 3. Configure environment

**Backend** — copy and fill in `backend/.env`:
```bash
cp backend/.env.example backend/.env
```

Required variables:
| Variable | Description |
|----------|-------------|
| `DB_USER` | PostgreSQL user |
| `DB_HOST` | `localhost` |
| `DB_PASSWORD` | PostgreSQL password |
| `DB_PORT` | PostgreSQL port (usually `5432`) |
| `JWT_SECRET` | Secret for signing JWTs (auto-generated if unset, but not persistent) |
| `SOLANA_RPC_URL` | Solana RPC endpoint (e.g. `https://api.devnet.solana.com` for dev) |
| `POOL_WALLET_ADDRESS` | Solana wallet that receives deposits |

**Frontend**

No environment variables are required for the frontend. It fetches its configuration directly from the backend API.

### 4. Install dependencies

```bash
cd backend && npm ci
cd ../frontend && npm ci
```

### 5. Run locally

Open two terminals:

**Backend** (terminal 1):
```bash
cd backend
node server.js
```
Runs on `http://localhost:3000`.

**Frontend** (terminal 2):
```bash
cd frontend
npm run dev
```
Runs on `http://localhost:5173`. The Vite dev server proxies `/api/*` requests to the backend automatically.

### 6. Lint before committing

```bash
cd backend && npm run lint
cd ../frontend && npm run lint

---

## Solana RPC Configuration

Both `SOLANA_RPC_URL` (backend) and `VITE_SOLANA_RPC_URL` (frontend) must point to a Solana RPC endpoint.

**Development** — use devnet:
```
https://api.devnet.solana.com
```

**Production** — Solana's public mainnet endpoint (`https://api.mainnet-beta.solana.com`) has aggressive rate limits and is **not suitable for production**. Use a dedicated RPC provider:

| Provider | Free Tier | Endpoint Format |
|----------|-----------|-----------------|
| [Helius](https://helius.dev) | 50k req/day | `https://mainnet.helius-rpc.com/?api-key=<KEY>` |
| [QuickNode](https://quicknode.com) | Limited | Custom URL per account |
| [Alchemy](https://alchemy.com) | 300M CU/mo | `https://solana-mainnet.g.alchemy.com/v2/<KEY>` |

Helius is the most common choice in the Solana ecosystem. Sign up, create an API key, and set both env vars:

```env
# backend/.env
SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
```

---

## Database Schema

Defined in `db.sql`. Core tables:

| Table | Purpose |
|-------|---------|
| `users` | Accounts with email, password hash, SOL balance |
| `profiles` | Public username + avatar |
| `charities` | Registered charities with optional Solana wallet |
| `markets` | Donation markets (JEKYLL or HYDE type) |
| `market_charity` | Links markets to their two charities |
| `shares` | Individual donations/bets placed by users |
| `deposits` | On-chain SOL deposit records |

See `backend/README.md` for full API documentation.