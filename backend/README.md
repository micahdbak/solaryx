# Backend API

## Auth

### `POST /auth/signup`

Create a new user account.

**Body:** `{ "email": string, "password": string }`

**Response:** `{ "status": true, "user": { "id": uuid, "email": string } }`

### `POST /auth/login`

Log in and receive a session cookie.

**Body:** `{ "email": string, "password": string }`

**Response:** `{ "message": "User logged in successfully", "user": { "id": uuid, "email": string } }` — sets `token` cookie.

### `POST /auth/logout`

Clear the session cookie.

**Response:** `{ "message": "User logged out" }`

### `GET /auth/status`

Check if the current session is valid. **Requires auth.**

**Response:** `{ "status": true, "user": { "id", "email" } }`

---

## Charities

### `POST /charities`

Create a charity. **Requires auth.**

**Body:** `{ "name": string, "description"?: string, "link"?: string, "logo_url"?: string, "wallet_address"?: string }`

**Response:** The created charity object.

### `GET /charities`

List all charities.

**Response:** Array of charity objects, ordered by `created_at` descending.

### `GET /charities/:id`

Get a single charity by ID.

**Response:** A charity object, or `404` if not found.

---

## Markets

### `POST /markets`

Create a market with linked charities. **Requires auth.**

**Body:**

```json
{
	"title": "string",
	"description": "string (optional)",
	"image_url": "string (optional)",
	"type": "JEKYLL | HYDE",
	"charity_ids": ["uuid", "uuid"]
}
```

Backend sets `status` to `ACTIVE`, `time_length_s` to `3600`, and generates a `wallet_address`.

**Response:** The created market object.

### `GET /markets`

List all markets with aggregated share data.

**Response:** Array of market objects, each including:

- `total_sol` — total finalized SOL in the pot
- `charity_totals` — array of `{ market_charity_id, charity_id, total_sol }` per linked charity

### `GET /markets/:id`

Get a single market by ID with aggregated share data.

**Response:** A market object (same shape as above), or `404` if not found.

---

## Shares

### `POST /shares`

Record a share (bet) against a market charity.

**Body:**

```json
{
	"user_id": "uuid",
	"market_id": "uuid",
	"market_charity_id": "uuid",
	"transaction_signature": "string"
}
```

Backend checks the transaction via Solana helpers to determine `amount_sol` and `transaction_status` (`WAITING` or `FINALIZED`).

**Response:** The created share object.
