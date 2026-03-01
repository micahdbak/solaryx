# Codename Sorbet

Charity donation market platform built with SvelteKit, Express, PostgreSQL, and Solana.

## Architecture

```
┌───────────┐     ┌──────────┐     ┌────────────┐
│ SvelteKit │────▶│ Express  │────▶│ PostgreSQL │
│ :5173     │/api │ :3000    │     │ sorbet     │
└───────────┘     └────┬─────┘     └────────────┘
                       │
                       ▼
                 ┌──────────┐
                 │ Solana   │
                 │ RPC Node │
                 └──────────┘
```

- **Frontend**: SvelteKit + Tailwind CSS, adapter-node for production builds
- **Backend**: Express.js REST API with JWT auth, cookie sessions
- **Database**: PostgreSQL with `pgcrypto` for UUID generation
- **Blockchain**: Solana (transaction verification via RPC)
- **Reverse proxy**: nginx (production)

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

**Frontend** — copy and fill in `frontend/.env`:
```bash
cp frontend/.env.example frontend/.env
```

| Variable | Description |
|----------|-------------|
| `VITE_SOLANA_RPC_URL` | Same Solana RPC endpoint as backend |
| `VITE_POOL_WALLET_ADDRESS` | Same pool wallet address as backend |

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

# frontend/.env
VITE_SOLANA_RPC_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_KEY
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