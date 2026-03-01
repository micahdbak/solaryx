// Stub Solana helpers — replace with real Solana SDK calls later

const { Connection, Keypair } = require("@solana/web3.js");
const bs58 = require("bs58").default || require("bs58");

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

function createWallet() {
	const keypair = Keypair.generate();
	return {
		publicKey: keypair.publicKey.toBase58(),
		secretKey: bs58.encode(keypair.secretKey)
	};
}

async function checkTransaction(signature, expectedReceiver) {
	try {
		const tx = await connection.getParsedTransaction(signature, {
			maxSupportedTransactionVersion: 0,
			commitment: "confirmed"
		});

		if (!tx) {
			throw new Error("Transaction not found on-chain");
		}

		if (tx.meta && tx.meta.err !== null) {
			throw new Error("Transaction failed on-chain");
		}

		// Find transfer to the expected receiver
		let amountSol = 0;
		if (tx.transaction && tx.transaction.message && tx.transaction.message.instructions) {
			for (const instruction of tx.transaction.message.instructions) {
				const prg = instruction.program;
				if (
					prg === "system" &&
					instruction.parsed &&
					instruction.parsed.type === "transfer"
				) {
					const info = instruction.parsed.info;
					if (info.destination === expectedReceiver) {
						amountSol += info.lamports / 1e9; // Convert lamports to sol
					}
				}
			}
		}

		if (amountSol === 0) {
			throw new Error("No SOL transfer found to the expected market wallet");
		}

		return {
			amount: amountSol,
			status: "finalized"
		};
	} catch (err) {
		console.error("Solana verification error:", err);
		throw err;
	}
}

module.exports = { createWallet, checkTransaction };
