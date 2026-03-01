// Stub Solana helpers — replace with real Solana SDK calls later

function createWallet() {
	return {
		publicKey: "DUMMY_PUBLIC_KEY_" + Date.now(),
		secretKey: "DUMMY_SECRET_KEY_" + Date.now()
	};
}

function checkTransaction(signature) {
	return {
		amount: 0.5,
		status: "finalized"
	};
}

module.exports = { createWallet, checkTransaction };
