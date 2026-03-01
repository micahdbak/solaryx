-- psql -d sorbet -f db.sql

-- ==========================================================
-- 1. SETUP & CLEANUP
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS payouts CASCADE;
DROP TABLE IF EXISTS deposits CASCADE;
DROP TABLE IF EXISTS bets CASCADE;
DROP TABLE IF EXISTS market_charity CASCADE;
DROP TABLE IF EXISTS markets CASCADE;
DROP TABLE IF EXISTS charities CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS shares CASCADE;

-- ==========================================================
-- 2. TABLES CREATION
-- ==========================================================

CREATE TABLE users (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email               VARCHAR(255) UNIQUE NOT NULL,
    is_email_verified   BOOLEAN DEFAULT 'f',
    password_hash       VARCHAR(255) NOT NULL,
    balance_sol         DECIMAL(20, 9) DEFAULT 0 CHECK (balance_sol >= 0),
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE profiles (
    user_id         UUID PRIMARY KEY REFERENCES users(id),
    username        VARCHAR(255) UNIQUE NOT NULL,
    avatar_url      TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE charities (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    link            TEXT,
    logo_url        TEXT,
    wallet_address  VARCHAR(44),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE markets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    image_url       TEXT,
    status          VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETE')),
    type            VARCHAR(10) DEFAULT 'JEKYLL' CHECK (type IN ('JEKYLL', 'HYDE')),
    time_length_s   DECIMAL NOT NULL CHECK (time_length_s > 0),
    winning_share   UUID,
    payout_tx       VARCHAR(88) UNIQUE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE market_charity (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    market_id   UUID REFERENCES markets(id) ON DELETE CASCADE,
    charity_id  UUID REFERENCES charities(id) ON DELETE RESTRICT,

    UNIQUE(market_id, charity_id)
);

CREATE TABLE deposits (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID REFERENCES users(id),
    amount_sol              DECIMAL(20, 9) NOT NULL CHECK (amount_sol > 0),
    transaction_signature   VARCHAR(88) UNIQUE NOT NULL,
    status                  VARCHAR(20) DEFAULT 'CONFIRMED',
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE shares (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID REFERENCES users(id),
    market_id               UUID REFERENCES markets(id),
    market_charity_id       UUID REFERENCES market_charity(id),
    amount_sol              DECIMAL(20, 9) NOT NULL CHECK (amount_sol > 0),
    seen_result             BOOLEAN DEFAULT FALSE,
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE payouts (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    market_id               UUID REFERENCES markets(id),
    charity_id              UUID REFERENCES charities(id),
    amount_sol              DECIMAL(20, 9) NOT NULL CHECK (amount_sol > 0),
    transaction_signature   VARCHAR(88) UNIQUE NOT NULL,
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE coupons (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code        VARCHAR(10) UNIQUE NOT NULL,
    amount_sol  DECIMAL(20, 9) NOT NULL CHECK (amount_sol > 0),
    max_uses    SMALLINT NOT NULL CHECK (max_uses > 0),
    num_uses    SMALLINT NOT NULL DEFAULT 0
);

-- ==========================================================
-- 2. FUNCTIONS CREATION
-- ==========================================================

CREATE OR REPLACE FUNCTION update_user_balance_on_deposit()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET balance_sol = balance_sol + NEW.amount_sol
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_deposit_insert
AFTER INSERT ON deposits
FOR EACH ROW
EXECUTE FUNCTION update_user_balance_on_deposit();

CREATE OR REPLACE FUNCTION update_user_balance_on_share()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET balance_sol = balance_sol - NEW.amount_sol
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_share_insert
AFTER INSERT ON shares
FOR EACH ROW
EXECUTE FUNCTION update_user_balance_on_share();