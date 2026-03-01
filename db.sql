-- ==========================================================
-- 1. SETUP & CLEANUP
-- ==========================================================

-- Enable UUID extension (standard for modern Postgres apps)
-- psql -d sorbet -f db.sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop tables in dependency order (Child -> Parent) to avoid foreign key errors
DROP TABLE IF EXISTS payouts CASCADE;
DROP TABLE IF EXISTS bets CASCADE;
DROP TABLE IF EXISTS market_outcomes CASCADE;
DROP TABLE IF EXISTS markets CASCADE;
DROP TABLE IF EXISTS charities CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ==========================================================
-- 2. TABLES CREATION
-- ==========================================================

-- ----------------------------------------------------------
-- Table: USERS
-- Description: Standard user accounts.
-- ----------------------------------------------------------
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(50),
    
    -- Solana Wallet (Optional, strictly for user convenience/history)
    solana_wallet_address VARCHAR(44), 
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------
-- Table: CHARITIES
-- Description: The entities receiving donations.
-- logic: 'type' distinguishes Good vs Evil markets.
-- ----------------------------------------------------------
CREATE TABLE charities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url TEXT,
    
    -- Where the pot gets sent if they win
    solana_wallet_address VARCHAR(44) NOT NULL, 
    
    -- "Good" vs "Evil" Logic
    type VARCHAR(10) DEFAULT 'good' CHECK (type IN ('good', 'evil')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------
-- Table: MARKETS
-- Description: The "Game" event (e.g., "Save Whales vs Oil Drillers").
-- ----------------------------------------------------------
CREATE TABLE markets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    
    -- Timer Logic
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE NOT NULL, 
    
    -- Status Workflow:
    -- ACTIVE: Open for betting.
    -- LOCKED: Timer ended, waiting for Solana block confirmation.
    -- RESOLVED: Winner determined (wheel spun).
    -- PAID: Funds transferred to charity.
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'LOCKED', 'RESOLVED', 'PAID')),
    
    -- Cached total for quick UI display (Sum of all outcomes)
    total_pool_amount DECIMAL(20, 9) DEFAULT 0, -- 9 decimals for Solana (Lamports)
    
    -- PROVABLY FAIR ROULETTE LOGIC
    -- server_seed_hash: Publicly shown BEFORE the spin (commitment).
    -- server_seed: Revealed AFTER the spin (verification).
    -- resolution_block_hash: The Solana block hash used as the final random entropy.
    server_seed_hash VARCHAR(255),
    server_seed VARCHAR(255), 
    resolution_block_hash VARCHAR(88),
    
    -- The Winner (Populated after spin)
    winning_outcome_id UUID, 
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------
-- Table: MARKET_OUTCOMES
-- Description: The Junction Table. Connects a Charity to a Market.
-- ----------------------------------------------------------
CREATE TABLE market_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    market_id UUID REFERENCES markets(id) ON DELETE CASCADE,
    charity_id UUID REFERENCES charities(id) ON DELETE RESTRICT,
    
    -- The specific pool for this side of the bet
    current_pool DECIMAL(20, 9) DEFAULT 0,
    
    -- Constraint: A charity cannot be in the same market twice
    UNIQUE(market_id, charity_id)
);

-- ----------------------------------------------------------
-- Table: BETS
-- Description: Individual donations via Solana.
-- ----------------------------------------------------------
CREATE TABLE bets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Relationships
    user_id UUID REFERENCES users(id),
    market_id UUID REFERENCES markets(id),
    outcome_id UUID REFERENCES market_outcomes(id),
    
    -- Financials
    amount_sol DECIMAL(20, 9) NOT NULL CHECK (amount_sol > 0),
    
    -- Solana On-Chain Data
    -- We enforce unique transaction signatures to prevent double-spending
    transaction_signature VARCHAR(88) UNIQUE NOT NULL,
    block_time TIMESTAMP WITH TIME ZONE,
    
    -- Status: PENDING (detected), CONFIRMED (finalized), FAILED
    status VARCHAR(20) DEFAULT 'PENDING',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ----------------------------------------------------------
-- Table: PAYOUTS
-- Description: Record of the final transfer to the winning charity.
-- ----------------------------------------------------------
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    market_id UUID REFERENCES markets(id),
    charity_id UUID REFERENCES charities(id),
    
    -- Total pot transferred
    total_amount_sol DECIMAL(20, 9) NOT NULL,
    
    -- The transaction ID of the payout sent TO the charity
    transaction_signature VARCHAR(88),
    
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================================
-- 3. INDEXES (For Performance)
-- ==========================================================

-- Speed up finding active markets
CREATE INDEX idx_markets_status ON markets(status);
CREATE INDEX idx_markets_end_time ON markets(end_time);

-- Speed up looking up bets by user or market
CREATE INDEX idx_bets_user ON bets(user_id);
CREATE INDEX idx_bets_market ON bets(market_id);

-- Speed up checking if a transaction already exists
CREATE INDEX idx_bets_tx_sig ON bets(transaction_signature);

-- ==========================================================
-- 4. SEED DATA (Optional - Just for testing)
-- ==========================================================

-- Insert 2 Charities
INSERT INTO charities (name, description, solana_wallet_address, type) VALUES 
('St. Jude Hospital', 'Healing children.', 'SolanaWalletAddress_Good_123', 'good'),
('Dr. Evil Laser Corp', 'Building giant lasers.', 'SolanaWalletAddress_Evil_666', 'evil');

-- Insert a Market
INSERT INTO markets (title, end_time, total_pool_amount) VALUES 
('Cure vs Chaos', NOW() + INTERVAL '24 HOURS', 0);

-- Link them (Assuming you grab the UUIDs generated above in a real app)
-- Note: In a raw SQL script without variables, linking dynamic UUIDs is hard, 
-- so this section is just for illustration of the logic.