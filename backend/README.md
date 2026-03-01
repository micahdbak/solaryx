# Backend API

## Response Models

All API responses return JSON objects structured according to the following models. All field names are in `snake_case`.

### `ErrorResponse`

- `error` (string): Description of the error. Returned for all `4xx` and `5xx` errors.

### `StatusResponse`

- `status` (boolean): `true` if successful.
- `user` (User, optional): Included on `/auth/status` if logged in.

### `User`

- `id` (uuid): The user's internal ID.
- `email` (string): The user's email address.
- `is_email_verified` (boolean): `true` if email is verified.
- `balance_sol` (number): User's current balance in SOL.
- `created_at` (timestamp)

### `LoginResponse`

- `message` (string): Success message.
- `user` (User): The logged-in user.

### `Charity`

- `id` (uuid): The charity's internal ID.
- `name` (string): Name of the charity.
- `description` (string, optional)
- `link` (string, optional): URL to the charity's website.
- `logo_url` (string, optional): URL to a logo image.
- `wallet_address` (string, optional): Solana wallet address.
- `created_at` (timestamp)

### `CharityTotal`

Aggregated pot data for a specific charity within a market.

- `market_charity_id` (uuid)
- `charity_id` (uuid)
- `total_sol` (number): Total amount of `FINALIZED` SOL.

### `Market`

- `id` (uuid): The market's internal ID.
- `title` (string)
- `description` (string, optional)
- `image_url` (string, optional)
- `status` (string): `ACTIVE` or `COMPLETE`.
- `type` (string): `JEKYLL` or `HYDE`.
- `time_length_s` (number): Duration of the market in seconds.
- `wallet_address` (string): Solana wallet address for the market pot.
- `winning_share` (uuid, optional): Set when the market completes.
- `created_at` (timestamp)
- `total_sol` (number): Total finalized SOL across all charities in this market.
- `charity_totals` (Array of CharityTotal): Breakdown of SOL per charity.

### `Share`

A recorded bet/contribution from a user.

- `id` (uuid)
- `user_id` (uuid)
- `market_id` (uuid)
- `market_charity_id` (uuid): The specific charity the user backed in this market.
- `amount_sol` (number)
- `transaction_signature` (string): Solana tx signature.
- `transaction_status` (string): `WAITING` or `FINALIZED`.
- `created_at` (timestamp)

---

## Auth

### `POST /auth/signup`

Create a new user account.

**Body:** `{ "email": string, "password": string, "username": string }`

**Response:** `LoginResponse` — sets `token` cookie.

### `POST /auth/login`

Log in and receive a session cookie.

**Body:** `{ "email": string, "password": string }`

**Response:** `LoginResponse` — sets `token` cookie.

### `POST /auth/logout`

Clear the session cookie.

**Response:** `StatusResponse`

### `GET /auth/status`

Check if the current session is valid. **Requires auth.**

**Response:** `StatusResponse` (with `user` field)

---

## Charities

### `POST /charities`

Create a charity. **Requires auth.**

**Body:** `{ "name": string, "description"?: string, "link"?: string, "logo_url"?: string, "wallet_address"?: string }`

**Response:** `Charity`

### `GET /charities`

List all charities.

**Response:** Array of `Charity`, ordered by `created_at` descending.

### `GET /charities/:id`

Get a single charity by ID.

**Response:** `Charity`

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

**Response:** `Market`

### `GET /markets`

List all markets with aggregated share data.

**Response:** Array of `Market`

### `GET /markets/:id`

Get a single market by ID with aggregated share data.

**Response:** `Market`

### `GET /markets/my-bets`

List all markets that the logged-in user has participated in. **Requires auth.**

**Response:** Array of `Market`

---

## Shares

### `POST /markets/:id/shares`

Record a share (bet) against a market charity. **Requires auth.**

**Body:**

```json
{
	"market_charity_id": "uuid",
	"transaction_signature": "string"
}
```

Backend checks the transaction via Solana helpers to determine `amount_sol` and `transaction_status` (`WAITING` or `FINALIZED`).

**Response:** `Share`

### `GET /markets/:id/shares`

List all shares for a given market, ordered by creation date (ascending).

**Response:** Array of `Share`
