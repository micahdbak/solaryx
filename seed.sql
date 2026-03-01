-- ==========================================================
-- SEED DATA
-- ==========================================================

BEGIN;

-- 1. Test user (username: TESTUSER, email: TEST@gmail.com, pw: TEST123)
INSERT INTO users (id, email, password_hash)
VALUES ('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', 'TEST@gmail.com', '$2b$10$NiBvK4QMECJ7oehb6L0xSebHnvbaoxvWeQH35NMbLuFs6bhaSEfXC')
ON CONFLICT DO NOTHING;

INSERT INTO profiles (user_id, username, avatar_url)
VALUES ('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', 'TESTUSER', 'https://api.dicebear.com/7.x/identicon/svg?seed=CryptoWhale')
ON CONFLICT DO NOTHING;

-- ==========================================================
-- 2. CHARITIES
-- ==========================================================

INSERT INTO charities (id, name, description, link, logo_url, wallet_address) VALUES
-- Environment
('c0000000-0000-0000-0000-000000000001', 'Ocean Conservancy', 'Protecting the ocean from today''s greatest global challenges through science-based advocacy and conservation.', 'https://oceanconservancy.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=ocean', NULL),
('c0000000-0000-0000-0000-000000000002', 'Rainforest Alliance', 'Working to conserve biodiversity and ensure sustainable livelihoods in tropical forests worldwide.', 'https://rainforest-alliance.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=rainforest', NULL),
('c0000000-0000-0000-0000-000000000003', 'Sierra Club Foundation', 'Promoting clean energy, protecting wild places, and advancing climate solutions.', 'https://sierraclub.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=sierra', NULL),
('c0000000-0000-0000-0000-000000000004', 'World Wildlife Fund', 'Working in nearly 100 countries to conserve nature and reduce the most pressing threats to biodiversity.', 'https://worldwildlife.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=wwf', NULL),

-- Technology & Science
('c0000000-0000-0000-0000-000000000005', 'Electronic Frontier Foundation', 'Defending digital privacy, free speech, and innovation through impact litigation and policy advocacy.', 'https://eff.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=eff', NULL),
('c0000000-0000-0000-0000-000000000006', 'AI Safety Institute', 'Researching and promoting the safe development of artificial intelligence systems.', NULL, 'https://api.dicebear.com/7.x/shapes/svg?seed=aisafety', NULL),
('c0000000-0000-0000-0000-000000000007', 'Khan Academy', 'Providing free, world-class education for anyone, anywhere through online courses and resources.', 'https://khanacademy.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=khan', NULL),
('c0000000-0000-0000-0000-000000000008', 'Wikimedia Foundation', 'Providing the essential infrastructure for free knowledge through Wikipedia and related projects.', 'https://wikimediafoundation.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=wiki', NULL),

-- Humanitarian
('c0000000-0000-0000-0000-000000000009', 'Doctors Without Borders', 'Providing medical humanitarian relief in conflict zones and areas affected by epidemics and disasters.', 'https://msf.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=msf', NULL),
('c0000000-0000-0000-0000-000000000010', 'UNICEF', 'Working in 190 countries to protect children''s rights, meet their basic needs, and expand their opportunities.', 'https://unicef.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=unicef', NULL),
('c0000000-0000-0000-0000-000000000011', 'Direct Relief', 'Providing essential medical resources to communities in need, guided by evidence and driven by efficiency.', 'https://directrelief.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=directrelief', NULL),
('c0000000-0000-0000-0000-000000000012', 'GiveDirectly', 'Sending money directly to people living in extreme poverty with no strings attached.', 'https://givedirectly.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=givedirectly', NULL),

-- Animal Welfare
('c0000000-0000-0000-0000-000000000013', 'The Humane Society', 'Fighting for the protection of all animals through advocacy, education, and hands-on programs.', 'https://humanesociety.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=humane', NULL),
('c0000000-0000-0000-0000-000000000014', 'Wildlife Conservation Society', 'Saving wildlife and wild places through science, conservation action, and education.', 'https://wcs.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=wcs', NULL),

-- Space & Exploration
('c0000000-0000-0000-0000-000000000015', 'Planetary Society', 'Empowering citizens to advance space science and exploration through advocacy and education.', 'https://planetary.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=planetary', NULL),
('c0000000-0000-0000-0000-000000000016', 'Mars Society', 'Advocating for human exploration and settlement of the planet Mars.', 'https://marssociety.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=mars', NULL),

-- Crypto & Finance
('c0000000-0000-0000-0000-000000000017', 'Coin Center', 'Leading non-profit research and advocacy focused on the public policy issues facing cryptocurrency.', 'https://coincenter.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=coincenter', NULL),
('c0000000-0000-0000-0000-000000000018', 'Financial Regulation Coalition', 'Advocating for stronger consumer protections and oversight in digital financial markets.', NULL, 'https://api.dicebear.com/7.x/shapes/svg?seed=finreg', NULL),

-- Food & Agriculture
('c0000000-0000-0000-0000-000000000019', 'Good Food Institute', 'Accelerating alternative protein innovation to make the global food system sustainable.', 'https://gfi.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=gfi', NULL),
('c0000000-0000-0000-0000-000000000020', 'National Cattlemen''s Beef Association', 'Representing and advocating for America''s cattle producers and the beef industry.', 'https://ncba.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=ncba', NULL),

-- Energy
('c0000000-0000-0000-0000-000000000021', 'Clean Air Task Force', 'Pushing for technology and policy changes essential to achieve a zero-emissions economy.', 'https://catf.us', 'https://api.dicebear.com/7.x/shapes/svg?seed=catf', NULL),
('c0000000-0000-0000-0000-000000000022', 'Nuclear Energy Institute', 'Promoting the beneficial uses of nuclear energy and technology in clean power generation.', 'https://nei.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=nuclear', NULL),

-- Education
('c0000000-0000-0000-0000-000000000023', 'Code.org', 'Expanding access to computer science education in schools and increasing participation by underrepresented groups.', 'https://code.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=codeorg', NULL),
('c0000000-0000-0000-0000-000000000024', 'Teach For America', 'Enlisting and developing leaders to strengthen the movement for educational equity and excellence.', 'https://teachforamerica.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=tfa', NULL),

-- Mental Health
('c0000000-0000-0000-0000-000000000025', 'NAMI', 'Providing advocacy, education, support, and public awareness for individuals affected by mental illness.', 'https://nami.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=nami', NULL),
('c0000000-0000-0000-0000-000000000026', 'Crisis Text Line', 'Providing free 24/7 mental health support via text message for people in crisis.', 'https://crisistextline.org', 'https://api.dicebear.com/7.x/shapes/svg?seed=crisis', NULL)

ON CONFLICT DO NOTHING;

-- ==========================================================
-- 3. MARKETS
-- ==========================================================

INSERT INTO markets (id, title, description, status, type, time_length_s) VALUES

-- ── JEKYLL MARKETS (morally consistent pairs) ────────────────────

('a0000000-0000-0000-0000-000000000001',
 'Ocean Conservation: Ocean Conservancy vs WWF',
 'Two titans of marine conservation. Which approach to protecting our oceans deserves more support?',
 'ACTIVE', 'JEKYLL', 604800),

('a0000000-0000-0000-0000-000000000002',
 'Rainforest vs Reef: Where Should Conservation Focus?',
 'Rainforest Alliance protecting tropical forests vs Ocean Conservancy protecting marine ecosystems.',
 'ACTIVE', 'JEKYLL', 1209600),

('a0000000-0000-0000-0000-000000000003',
 'Free Knowledge: Khan Academy vs Wikimedia',
 'Two organizations making education and knowledge freely accessible worldwide.',
 'ACTIVE', 'JEKYLL', 864000),

('a0000000-0000-0000-0000-000000000004',
 'Children''s Health: UNICEF vs Direct Relief',
 'Two humanitarian powerhouses delivering medical aid globally. Which model is more effective?',
 'ACTIVE', 'JEKYLL', 2592000),

('a0000000-0000-0000-0000-000000000005',
 'Wildlife Protection: Humane Society vs WCS',
 'Domestic animal welfare versus global wildlife conservation. Where does your dollar go further?',
 'ACTIVE', 'JEKYLL', 1209600),

('a0000000-0000-0000-0000-000000000006',
 'Digital Privacy vs Free Knowledge',
 'EFF defending digital rights vs Wikimedia providing open access to information.',
 'ACTIVE', 'JEKYLL', 604800),

('a0000000-0000-0000-0000-000000000007',
 'Climate Action: Sierra Club vs Clean Air Task Force',
 'Grassroots environmental activism vs technology-first clean energy policy.',
 'ACTIVE', 'JEKYLL', 1814400),

('a0000000-0000-0000-0000-000000000008',
 'CS Education: Code.org vs Khan Academy',
 'Specialized computer science education vs broad free learning platform.',
 'ACTIVE', 'JEKYLL', 604800),

('a0000000-0000-0000-0000-000000000009',
 'Mental Health Support: NAMI vs Crisis Text Line',
 'Long-term mental health advocacy vs immediate crisis intervention.',
 'ACTIVE', 'JEKYLL', 1209600),

('a0000000-0000-0000-0000-000000000010',
 'Humanitarian Aid: Doctors Without Borders vs Direct Relief',
 'Frontline medical teams vs medical supply logistics. Both save lives — which approach first?',
 'ACTIVE', 'JEKYLL', 2592000),

('a0000000-0000-0000-0000-000000000011',
 'Education Equity: Teach For America vs Code.org',
 'Classroom teachers in underserved communities vs expanding CS access nationwide.',
 'ACTIVE', 'JEKYLL', 1209600),

('a0000000-0000-0000-0000-000000000012',
 'Space Exploration: Planetary Society vs Mars Society',
 'Broad space science advocacy vs focused Mars colonization efforts.',
 'ACTIVE', 'JEKYLL', 2592000),

-- ── HYDE MARKETS (controversial / morally ambiguous pairs) ───────

('a0000000-0000-0000-0000-000000000013',
 'AI Progress vs AI Safety',
 'Should we accelerate AI capabilities or pump the brakes? Khan Academy''s AI tutoring ambitions vs the AI Safety Institute''s call for caution.',
 'ACTIVE', 'HYDE', 604800),

('a0000000-0000-0000-0000-000000000014',
 'Crypto Freedom vs Financial Regulation',
 'Should digital assets roam free or be tightly regulated? Coin Center vs Financial Regulation Coalition.',
 'ACTIVE', 'HYDE', 1814400),

('a0000000-0000-0000-0000-000000000015',
 'Lab Meat vs Real Beef',
 'The future of food: Good Food Institute pushing alternative proteins vs the Cattlemen''s Association defending traditional ranching.',
 'ACTIVE', 'HYDE', 1209600),

('a0000000-0000-0000-0000-000000000016',
 'Nuclear Power vs Renewables Only',
 'Nuclear Energy Institute advocating for nuclear as clean energy vs Clean Air Task Force pushing a broader zero-emissions mix.',
 'ACTIVE', 'HYDE', 2592000),

('a0000000-0000-0000-0000-000000000017',
 'Mars Colony vs Fix Earth First',
 'Mars Society wants humanity among the stars. Sierra Club says fix the planet we already have.',
 'ACTIVE', 'HYDE', 2592000),

('a0000000-0000-0000-0000-000000000018',
 'Cash Transfers vs Institutional Aid',
 'GiveDirectly says just send money to the poor. UNICEF says structured programs work better.',
 'ACTIVE', 'HYDE', 1209600),

('a0000000-0000-0000-0000-000000000019',
 'Digital Privacy vs Child Safety Online',
 'EFF fights for encryption and privacy. NAMI argues better platform oversight protects vulnerable youth.',
 'ACTIVE', 'HYDE', 604800),

('a0000000-0000-0000-0000-000000000020',
 'Wildlife Habitat vs Human Development',
 'WCS wants pristine wilderness. Teach For America says underserved communities need resources more.',
 'ACTIVE', 'HYDE', 1814400),

('a0000000-0000-0000-0000-000000000021',
 'Animal Rights vs Medical Research',
 'The Humane Society opposes animal testing. Doctors Without Borders relies on research that sometimes requires it.',
 'ACTIVE', 'HYDE', 1209600),

('a0000000-0000-0000-0000-000000000022',
 'Open Source AI vs Controlled AI',
 'Wikimedia champions open access to everything. AI Safety Institute says some knowledge should have guardrails.',
 'ACTIVE', 'HYDE', 604800),

('a0000000-0000-0000-0000-000000000023',
 'Automation vs Employment',
 'Code.org trains the next generation of coders building automation. Crisis Text Line employs human counselors whose jobs AI threatens.',
 'ACTIVE', 'HYDE', 1814400),

('a0000000-0000-0000-0000-000000000024',
 'Deforestation for Food vs Biodiversity',
 'National Cattlemen''s need land for cattle. Rainforest Alliance fights to keep those forests standing.',
 'ACTIVE', 'HYDE', 2592000)

ON CONFLICT DO NOTHING;

-- ==========================================================
-- 4. LINK MARKETS TO CHARITIES
-- ==========================================================

INSERT INTO market_charity (id, market_id, charity_id) VALUES
-- JEKYLL 1: Ocean Conservancy vs WWF
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001'),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004'),
-- JEKYLL 2: Rainforest Alliance vs Ocean Conservancy
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002'),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001'),
-- JEKYLL 3: Khan Academy vs Wikimedia
('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000007'),
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000008'),
-- JEKYLL 4: UNICEF vs Direct Relief
('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000010'),
('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000011'),
-- JEKYLL 5: Humane Society vs WCS
('b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000013'),
('b0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000014'),
-- JEKYLL 6: EFF vs Wikimedia
('b0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000005'),
('b0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000008'),
-- JEKYLL 7: Sierra Club vs Clean Air Task Force
('b0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000003'),
('b0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000021'),
-- JEKYLL 8: Code.org vs Khan Academy
('b0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000023'),
('b0000000-0000-0000-0000-000000000016', 'a0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000007'),
-- JEKYLL 9: NAMI vs Crisis Text Line
('b0000000-0000-0000-0000-000000000017', 'a0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000025'),
('b0000000-0000-0000-0000-000000000018', 'a0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000026'),
-- JEKYLL 10: MSF vs Direct Relief
('b0000000-0000-0000-0000-000000000019', 'a0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000009'),
('b0000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000011'),
-- JEKYLL 11: TFA vs Code.org
('b0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000024'),
('b0000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000023'),
-- JEKYLL 12: Planetary Society vs Mars Society
('b0000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000015'),
('b0000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000016'),

-- HYDE 13: Khan Academy (AI tutoring) vs AI Safety Institute
('b0000000-0000-0000-0000-000000000025', 'a0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000007'),
('b0000000-0000-0000-0000-000000000026', 'a0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000006'),
-- HYDE 14: Coin Center vs Financial Regulation Coalition
('b0000000-0000-0000-0000-000000000027', 'a0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000017'),
('b0000000-0000-0000-0000-000000000028', 'a0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000018'),
-- HYDE 15: Good Food Institute vs Cattlemen's
('b0000000-0000-0000-0000-000000000029', 'a0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000019'),
('b0000000-0000-0000-0000-000000000030', 'a0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000020'),
-- HYDE 16: Nuclear Energy Institute vs Clean Air Task Force
('b0000000-0000-0000-0000-000000000031', 'a0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000022'),
('b0000000-0000-0000-0000-000000000032', 'a0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000021'),
-- HYDE 17: Mars Society vs Sierra Club
('b0000000-0000-0000-0000-000000000033', 'a0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000016'),
('b0000000-0000-0000-0000-000000000034', 'a0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000003'),
-- HYDE 18: GiveDirectly vs UNICEF
('b0000000-0000-0000-0000-000000000035', 'a0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000012'),
('b0000000-0000-0000-0000-000000000036', 'a0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000010'),
-- HYDE 19: EFF vs NAMI
('b0000000-0000-0000-0000-000000000037', 'a0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000005'),
('b0000000-0000-0000-0000-000000000038', 'a0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000025'),
-- HYDE 20: WCS vs TFA
('b0000000-0000-0000-0000-000000000039', 'a0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000014'),
('b0000000-0000-0000-0000-000000000040', 'a0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000024'),
-- HYDE 21: Humane Society vs MSF
('b0000000-0000-0000-0000-000000000041', 'a0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000013'),
('b0000000-0000-0000-0000-000000000042', 'a0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000009'),
-- HYDE 22: Wikimedia vs AI Safety Institute
('b0000000-0000-0000-0000-000000000043', 'a0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000008'),
('b0000000-0000-0000-0000-000000000044', 'a0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000006'),
-- HYDE 23: Code.org vs Crisis Text Line
('b0000000-0000-0000-0000-000000000045', 'a0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000023'),
('b0000000-0000-0000-0000-000000000046', 'a0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000026'),
-- HYDE 24: Cattlemen's vs Rainforest Alliance
('b0000000-0000-0000-0000-000000000047', 'a0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000020'),
('b0000000-0000-0000-0000-000000000048', 'a0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000002')

ON CONFLICT DO NOTHING;

-- ==========================================================
-- 5. SAMPLE SHARES FOR TEST USER
-- ==========================================================

INSERT INTO shares (user_id, market_id, market_charity_id, amount_sol, transaction_signature, transaction_status, created_at) VALUES
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 2.50, 'tx_seed_001', 'FINALIZED', NOW() - INTERVAL '2 HOURS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 1.75, 'tx_seed_002', 'FINALIZED', NOW() - INTERVAL '3 HOURS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000005', 5.00, 'tx_seed_003', 'FINALIZED', NOW() - INTERVAL '1 DAY'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000007', 0.50, 'tx_seed_004', 'FINALIZED', NOW() - INTERVAL '2 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', 'a0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000025', 3.00, 'tx_seed_005', 'FINALIZED', NOW() - INTERVAL '3 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', 'a0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000027', 10.00, 'tx_seed_006', 'FINALIZED', NOW() - INTERVAL '5 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', 'a0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000030', 1.25, 'tx_seed_007', 'FINALIZED', NOW() - INTERVAL '7 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', 'a0000000-0000-0000-0000-000000000017', 'b0000000-0000-0000-0000-000000000033', 4.20, 'tx_seed_008', 'FINALIZED', NOW() - INTERVAL '10 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', 'a0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000017', 0.75, 'tx_seed_009', 'FINALIZED', NOW() - INTERVAL '12 DAYS'),
('b37a40d9-63f0-4b04-81e8-b759e0fa3d6d', 'a0000000-0000-0000-0000-000000000022', 'b0000000-0000-0000-0000-000000000043', 8.00, 'tx_seed_010', 'FINALIZED', NOW() - INTERVAL '14 DAYS')
ON CONFLICT DO NOTHING;

COMMIT;
