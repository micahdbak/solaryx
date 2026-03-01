-- ==========================================================
-- SEED DATA FOR TESTING PROFILE UI
-- ==========================================================

BEGIN;

-- 1. username: TESTUSER, email: TEST@gmail.com, pw: TEST123
INSERT INTO users (id, email, password_hash) 
VALUES ('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', 'TEST@gmail.com', '$2b$10$NiBvK4QMECJ7oehb6L0xSebHnvbaoxvWeQH35NMbLuFs6bhaSEfXC')
ON CONFLICT DO NOTHING;

INSERT INTO profiles (user_id, username, avatar_url) 
VALUES ('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', 'TESTUSER', 'https://api.dicebear.com/7.x/identicon/svg?seed=CryptoWhale')
ON CONFLICT DO NOTHING;

-- 2. Create Charities
INSERT INTO charities (id, name, description, logo_url, wallet_address) VALUES 
('22222222-2222-2222-2222-222222222221', 'Save The Oceans', 'Cleaning up the pacific garbage patch', 'https://api.dicebear.com/7.x/shapes/svg?seed=ocean', 'SolanaWalletOceans123'),
('22222222-2222-2222-2222-222222222222', 'Build More Factories', 'Creating jobs via unregulated emissions', 'https://api.dicebear.com/7.x/shapes/svg?seed=factory', 'SolanaWalletFactory456'),
('22222222-2222-2222-2222-222222222223', 'Mars Colonization Fund', 'Funding the first human settlement on Mars', 'https://api.dicebear.com/7.x/shapes/svg?seed=mars', 'SolanaWalletMars789'),
('22222222-2222-2222-2222-222222222224', 'Earth First Initiative', 'Protecting Earth from aggressive space exploration', 'https://api.dicebear.com/7.x/shapes/svg?seed=earth', 'SolanaWalletEarth012'),
('22222222-2222-2222-2222-222222222225', 'Open AI Research Labs', 'Developing AGI for the benefit of all humanity', 'https://api.dicebear.com/7.x/shapes/svg?seed=ai', 'SolanaWalletAI345'),
('22222222-2222-2222-2222-222222222226', 'Humanity Shield', 'Protecting human jobs from automation', 'https://api.dicebear.com/7.x/shapes/svg?seed=shield', 'SolanaWalletShield678'),
('22222222-2222-2222-2222-222222222227', 'Quantum Computing Trust', 'Accelerating the development of quantum supremacy', 'https://api.dicebear.com/7.x/shapes/svg?seed=quantum', 'SolanaWalletQuantum901'),
('22222222-2222-2222-2222-222222222228', 'Crypto Regulation Coalition', 'Lobbying for strict oversight of digital assets', 'https://api.dicebear.com/7.x/shapes/svg?seed=bank', 'SolanaWalletBank234')
ON CONFLICT DO NOTHING;

-- 3. Create Markets
INSERT INTO markets (id, title, description, image_url, status, type, time_length_s) VALUES 
('44444444-4444-4444-4444-444444444441', 'Will the Ocean Cleanup hit 50M pounds by 2026?', 'A market deciding the fate of the sea', 'https://api.dicebear.com/7.x/shapes/svg?seed=market1', 'ACTIVE', 'JEKYLL', 864000),
('44444444-4444-4444-4444-444444444442', 'Will SpaceX put a human on Mars before 2030?', 'The race to the red planet', 'https://api.dicebear.com/7.x/shapes/svg?seed=market3', 'ACTIVE', 'JEKYLL', 31536000),
('44444444-4444-4444-4444-444444444443', 'Will AI take over customer service completely?', 'Man vs Machine in the workplace', 'https://api.dicebear.com/7.x/shapes/svg?seed=market2', 'COMPLETE', 'HYDE', 10000000),
('44444444-4444-4444-4444-444444444444', 'Will Quantum Computers break RSA encryption this decade?', 'The future of cybersecurity', 'https://api.dicebear.com/7.x/shapes/svg?seed=market4', 'ACTIVE', 'HYDE', 15000000),
('44444444-4444-4444-4444-444444444445', 'Will the US ban decentralized financial protocols?', 'The regulatory battle over Defi', 'https://api.dicebear.com/7.x/shapes/svg?seed=market5', 'ACTIVE', 'HYDE', 5000000),
('44444444-4444-4444-4444-444444444446', 'Will Global Carbon Emissions drop by 10% next year?', 'Tracking international climate goals', 'https://api.dicebear.com/7.x/shapes/svg?seed=market6', 'ACTIVE', 'JEKYLL', 20000000)
ON CONFLICT DO NOTHING;

-- 4. Link Markets to Charities
INSERT INTO market_charity (id, market_id, charity_id) VALUES 
-- Market 1: Ocean Cleanup
('66666666-6666-6666-6666-666666666661', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222221'), -- Save Oceans
('66666666-6666-6666-6666-666666666662', '44444444-4444-4444-4444-444444444441', '22222222-2222-2222-2222-222222222222'), -- Factories
-- Market 2: Mars
('66666666-6666-6666-6666-666666666663', '44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222223'), -- Mars Fund
('66666666-6666-6666-6666-666666666664', '44444444-4444-4444-4444-444444444442', '22222222-2222-2222-2222-222222222224'), -- Earth First
-- Market 3: AI Customer Service
('66666666-6666-6666-6666-666666666665', '44444444-4444-4444-4444-444444444443', '22222222-2222-2222-2222-222222222225'), -- AI Labs
('66666666-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444443', '22222222-2222-2222-2222-222222222226'), -- Humanity Shield
-- Market 4: Quantum Computing
('66666666-6666-6666-6666-666666666667', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222227'), -- Quantum Trust
('66666666-6666-6666-6666-666666666668', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222228'), -- Regulation Group
-- Market 5: Defi Ban
('66666666-6666-6666-6666-666666666669', '44444444-4444-4444-4444-444444444445', '22222222-2222-2222-2222-222222222228'), -- Regulation Group
('66666666-6666-6666-6666-666666666670', '44444444-4444-4444-4444-444444444445', '22222222-2222-2222-2222-222222222225'), -- AI Labs (Cross-pollination)
-- Market 6: Carbon Emissions
('66666666-6666-6666-6666-666666666671', '44444444-4444-4444-4444-444444444446', '22222222-2222-2222-2222-222222222221'), -- Save Oceans
('66666666-6666-6666-6666-666666666672', '44444444-4444-4444-4444-444444444446', '22222222-2222-2222-2222-222222222222')  -- Factories
ON CONFLICT DO NOTHING;

-- 5. Insert 20 distinct shares (transactions) for the test user
INSERT INTO shares (user_id, market_id, market_charity_id, amount_sol, transaction_signature, transaction_status, created_at) VALUES 
-- Active Shares (WAITING)
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444441', '66666666-6666-6666-6666-666666666661', 2.50, 'tx_sig_mock_001', 'WAITING', NOW() - INTERVAL '2 HOURS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444441', '66666666-6666-6666-6666-666666666662', 12.00, 'tx_sig_mock_002', 'WAITING', NOW() - INTERVAL '5 HOURS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444442', '66666666-6666-6666-6666-666666666663', 0.75, 'tx_sig_mock_003', 'WAITING', NOW() - INTERVAL '1 DAY'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444442', '66666666-6666-6666-6666-666666666664', 4.20, 'tx_sig_mock_004', 'WAITING', NOW() - INTERVAL '2 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444443', '66666666-6666-6666-6666-666666666665', 1.00, 'tx_sig_mock_005', 'WAITING', NOW() - INTERVAL '3 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444443', '66666666-6666-6666-6666-666666666666', 3.30, 'tx_sig_mock_006', 'WAITING', NOW() - INTERVAL '4 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666667', 0.50, 'tx_sig_mock_007', 'WAITING', NOW() - INTERVAL '5 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666668', 6.00, 'tx_sig_mock_008', 'WAITING', NOW() - INTERVAL '6 DAYS'),
-- Finalized Shares (FINALIZED)
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444445', '66666666-6666-6666-6666-666666666669', 8.90, 'tx_sig_mock_009', 'FINALIZED', NOW() - INTERVAL '7 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444445', '66666666-6666-6666-6666-666666666670', 2.50, 'tx_sig_mock_010', 'FINALIZED', NOW() - INTERVAL '8 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444446', '66666666-6666-6666-6666-666666666671', 15.00, 'tx_sig_mock_011', 'FINALIZED', NOW() - INTERVAL '10 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444446', '66666666-6666-6666-6666-666666666672', 1.25, 'tx_sig_mock_012', 'FINALIZED', NOW() - INTERVAL '12 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444441', '66666666-6666-6666-6666-666666666661', 7.77, 'tx_sig_mock_013', 'FINALIZED', NOW() - INTERVAL '14 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444442', '66666666-6666-6666-6666-666666666663', 3.33, 'tx_sig_mock_014', 'FINALIZED', NOW() - INTERVAL '15 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444443', '66666666-6666-6666-6666-666666666665', 0.50, 'tx_sig_mock_015', 'FINALIZED', NOW() - INTERVAL '18 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666667', 4.00, 'tx_sig_mock_016', 'FINALIZED', NOW() - INTERVAL '21 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444445', '66666666-6666-6666-6666-666666666669', 10.50, 'tx_sig_mock_017', 'FINALIZED', NOW() - INTERVAL '25 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444446', '66666666-6666-6666-6666-666666666671', 2.10, 'tx_sig_mock_018', 'FINALIZED', NOW() - INTERVAL '28 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444441', '66666666-6666-6666-6666-666666666662', 5.00, 'tx_sig_mock_019', 'FINALIZED', NOW() - INTERVAL '35 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', '44444444-4444-4444-4444-444444444442', '66666666-6666-6666-6666-666666666664', 1.00, 'tx_sig_mock_020', 'FINALIZED', NOW() - INTERVAL '40 DAYS')
ON CONFLICT DO NOTHING;

COMMIT;
