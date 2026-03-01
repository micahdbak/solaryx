const { Connection, LAMPORTS_PER_SOL } = require("@solana/web3.js");

const network = process.env.SOLANA_RPC_URL;
if (!network) {
	throw new Error("SOLANA_RPC_URL environment variable is required");
}
const connection = new Connection(network, "confirmed");

const GLOBAL_POOL_WALLET = process.env.POOL_WALLET_ADDRESS;
if (!GLOBAL_POOL_WALLET) {
	throw new Error("POOL_WALLET_ADDRESS environment variable is required");
}

/**
 * Fetch a transaction from Solana RPC and verify it was a transfer to our Global Pool Wallet.
 * @param {string} signature - The transaction signature
 * @returns {Promise<{amount: number, status: string}>}
 */
async function checkTransaction(signature) {
	try {
		// Implement retry logic up to 5 times in case of RPC race conditions
		let tx = null;
		let retries = 5;
		while (retries > 0) {
			tx = await connection.getParsedTransaction(signature, {
				maxSupportedTransactionVersion: 0,
				commitment: "confirmed"
			});
			if (tx) break;
			await new Promise((r) => setTimeout(r, 1000));
			retries--;
		}

		if (!tx) {
			throw new Error("Transaction not found on chain (it may not be confirmed yet)");
		}

		if (tx.meta?.err) {
			throw new Error("Transaction failed on chain");
		}

		let transferAmountLamports = 0;

		const instructions = tx.transaction?.message?.instructions || [];

		for (const ix of instructions) {
			// Check for system program (usually "11111111111111111111111111111111" or "system")
			if (
				ix.programId?.toString() === "11111111111111111111111111111111" ||
				ix.program === "system"
			) {
				if (ix.parsed?.type === "transfer" && ix.parsed?.info) {
					const info = ix.parsed.info;
					if (info.destination === GLOBAL_POOL_WALLET) {
						transferAmountLamports += Number(info.lamports);
					}
				}
			}
		}

		if (transferAmountLamports <= 0) {
			console.error(
				"Failed to find transfer instruction to Global Pool. Transaction data:",
				JSON.stringify(tx.transaction.message.instructions, null, 2)
			);
			throw new Error("Transaction did not deposit new funds to the global pool wallet");
		}

		return {
			amount: transferAmountLamports / LAMPORTS_PER_SOL,
			status: "finalized"
		};
	} catch (err) {
		console.error("Solana verification error:", err);
		throw err;
	}
}

module.exports = { checkTransaction, GLOBAL_POOL_WALLET };
