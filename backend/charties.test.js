const request = require("supertest");
const app = require("./server"); // Import the Express app
const pool = require("./db");

describe("Charities API Endpoints", () => {
	let createdCharityId;

	// Run once after all tests have completed
	afterAll(async () => {
		// Cleanup test data to prevent database pollution
		if (createdCharityId) {
			await pool.query("DELETE FROM charities WHERE id = $1", [createdCharityId]);
		}
		await pool.end(); // Close the database connection to exit Node gracefully
	});

	test("POST /charities - should create a new charity", async () => {
		const payload = {
			name: "Test Charity " + Date.now(),
			description: "A charity created by automated tests",
			logo_url: "https://example.com/logo.png",
			solana_wallet_address: "TestWalletAddress789",
			type: "good"
		};

		const response = await request(app).post("/charities").send(payload);

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty("id");
		expect(response.body.name).toBe(payload.name);
		expect(response.body.type).toBe(payload.type);

		createdCharityId = response.body.id;
	});

	test("GET /charities - should return a list of charities", async () => {
		const response = await request(app).get("/charities");

		expect(response.status).toBe(200);
		expect(Array.isArray(response.body)).toBe(true);
		// The one we just created should be in this list
		expect(response.body.length).toBeGreaterThanOrEqual(1);
	});

	test("GET /charities/:id - should return a single charity", async () => {
		const response = await request(app).get(`/charities/${createdCharityId}`);

		expect(response.status).toBe(200);
		expect(response.body.id).toBe(createdCharityId);
		expect(response.body.name).toContain("Test Charity");
	});

	test("GET /charities/type/:type - should return charities of specific type 'good'", async () => {
		const response = await request(app).get("/charities/type/good");

		expect(response.status).toBe(200);
		expect(Array.isArray(response.body)).toBe(true);
		// Ensure every returned item has type 'good'
		expect(response.body.every((charity) => charity.type === "good")).toBe(true);
	});

	test("GET /charities/type/:type - should return 400 for invalid type", async () => {
		const response = await request(app).get("/charities/type/neutral");

		expect(response.status).toBe(400);
		expect(response.body.error).toBe("Type must be 'good' or 'evil'");
	});

	test("GET /charities/:id - should return 404 for non-existent charity", async () => {
		// Generate a random UUID that likely doesn't exist
		const randomUuid = "00000000-0000-0000-0000-000000000000";
		const response = await request(app).get(`/charities/${randomUuid}`);

		expect(response.status).toBe(404);
		expect(response.body.error).toBe("Charity not found");
	});
});
