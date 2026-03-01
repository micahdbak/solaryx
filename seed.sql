-- ==========================================================
-- SEED DATA FOR TESTING PROFILE UI
-- ==========================================================


INSERT INTO profiles (user_id, username, avatar_url) 
VALUES ('9f907225-1e4e-4261-b0e2-607bb3e5131d', 'CryptoWhale', 'https://api.dicebear.com/7.x/identicon/svg?seed=CryptoWhale')
ON CONFLICT DO NOTHING;

-- 2. Create Charities
INSERT INTO charities (id, name, description, logo_url, wallet_address) VALUES 
('22222222-2222-2222-2222-222222222222', 'Save The Oceans', 'Cleaning up the pacific garbage patch', 'https://api.dicebear.com/7.x/shapes/svg?seed=ocean', 'SolanaWalletOceans123'),
('33333333-3333-3333-3333-333333333333', 'Build More Factories', 'Creating jobs via unregulated emissions', 'https://api.dicebear.com/7.x/shapes/svg?seed=factory', 'SolanaWalletFactory456')
ON CONFLICT DO NOTHING;

-- 3. Create Markets
INSERT INTO markets (id, title, description, image_url, status, type, time_length_s) VALUES 
('44444444-4444-4444-4444-444444444444', 'Will the Ocean Cleanup hit 50M pounds by 2026?', 'A market deciding the fate of the sea', 'https://api.dicebear.com/7.x/shapes/svg?seed=market1', 'ACTIVE', 'JEKYLL', 864000),
('55555555-5555-5555-5555-555555555555', 'Will AI take over customer service completely?', 'Man vs Machine', 'https://api.dicebear.com/7.x/shapes/svg?seed=market2', 'COMPLETE', 'HYDE', 10000000)
ON CONFLICT DO NOTHING;

-- 4. Link Markets to Charities
INSERT INTO market_charity (id, market_id, charity_id) VALUES 
('66666666-6666-6666-6666-666666666661', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222'),
('66666666-6666-6666-6666-666666666662', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333'),
('66666666-6666-6666-6666-666666666663', '55555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;

-- 5. Insert 10 distinct shares (transactions) for the test user
-- 5 Active ('WAITING'), 5 Closed ('FINALIZED')
INSERT INTO shares (user_id, market_id, market_charity_id, amount_sol, transaction_signature, transaction_status, created_at) VALUES 
-- Active Shares
('9f907225-1e4e-4261-b0e2-607bb3e5131d', '44444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666661', 5.50, 'tx_sig_mock_001', 'WAITING', NOW() - INTERVAL '1 DAY'),
('9f907225-1e4e-4261-b0e2-607bb3e5131d', '44444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666662', 12.00, 'tx_sig_mock_002', 'WAITING', NOW() - INTERVAL '2 DAYS'),
('9f907225-1e4e-4261-b0e2-607bb3e5131d', '44444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666661', 0.75, 'tx_sig_mock_003', 'WAITING', NOW() - INTERVAL '3 DAYS'),
('9f907225-1e4e-4261-b0e2-607bb3e5131d', '44444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666662', 4.20, 'tx_sig_mock_004', 'WAITING', NOW() - INTERVAL '4 DAYS'),
('9f907225-1e4e-4261-b0e2-607bb3e5131d', '44444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666661', 1.00, 'tx_sig_mock_005', 'WAITING', NOW() - INTERVAL '5 DAYS'),
-- Finalized Shares
('9f907225-1e4e-4261-b0e2-607bb3e5131d', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666663', 8.90, 'tx_sig_mock_006', 'FINALIZED', NOW() - INTERVAL '10 DAYS'),
('9f907225-1e4e-4261-b0e2-607bb3e5131d', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666663', 2.50, 'tx_sig_mock_007', 'FINALIZED', NOW() - INTERVAL '11 DAYS'),
('9f907225-1e4e-4261-b0e2-607bb3e5131d', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666663', 15.00, 'tx_sig_mock_008', 'FINALIZED', NOW() - INTERVAL '12 DAYS'),
('9f907225-1e4e-4261-b0e2-607bb3e5131d', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666663', 3.33, 'tx_sig_mock_009', 'FINALIZED', NOW() - INTERVAL '15 DAYS'),
('9f907225-1e4e-4261-b0e2-607bb3e5131d', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666663', 0.50, 'tx_sig_mock_010', 'FINALIZED', NOW() - INTERVAL '20 DAYS')
ON CONFLICT DO NOTHING;
