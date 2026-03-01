const {
	Connection,
	Keypair,
	PublicKey,
	SystemProgram,
	Transaction,
	sendAndConfirmTransaction,
	LAMPORTS_PER_SOL
} = require("@solana/web3.js");
const bs58 = require("bs58").default;

const network = process.env.SOLANA_RPC_URL;
if (!network) throw new Error("SOLANA_RPC_URL environment variable is required");
const connection = new Connection(network, "confirmed");

const GLOBAL_POOL_WALLET = process.env.POOL_WALLET_ADDRESS;
if (!GLOBAL_POOL_WALLET) throw new Error("POOL_WALLET_ADDRESS environment variable is required");

const rawPrivateKey = process.env.POOL_WALLET_PRIVATE_KEY;
if (!rawPrivateKey) throw new Error("POOL_WALLET_PRIVATE_KEY environment variable is required");
const poolKeypair = Keypair.fromSecretKey(bs58.decode(rawPrivateKey));

/**
 * Fetch a transaction from Solana RPC and verify it was a transfer to our Global Pool Wallet.
 * @param {string} signature - The transaction signature
 * @returns {Promise<{amount: number, status: string}>}
 */
async function checkTransaction(signature) {
	try {
		// Wait for the transaction to be confirmed on the network first
		const latestBlockhash = await connection.getLatestBlockhash();
		const confirmation = await connection.confirmTransaction(
			{
				signature,
				blockhash: latestBlockhash.blockhash,
				lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
			},
			"confirmed"
		);
		if (confirmation.value.err) {
			throw new Error("Transaction failed to confirm on chain");
		}

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

async function sendToCharity(charityWalletAddress, amountSol) {
	const lamports = Math.floor(amountSol * LAMPORTS_PER_SOL);

	const balance = await connection.getBalance(poolKeypair.publicKey);
	if (balance < lamports) {
		throw new Error(`Insufficient balance: need ${lamports} lamports, have ${balance}`);
	}

	const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

	const transaction = new Transaction({
		blockhash,
		lastValidBlockHeight,
		feePayer: poolKeypair.publicKey
	}).add(
		SystemProgram.transfer({
			fromPubkey: poolKeypair.publicKey,
			toPubkey: new PublicKey(charityWalletAddress),
			lamports
		})
	);

	const signature = await sendAndConfirmTransaction(connection, transaction, [poolKeypair], {
		commitment: "confirmed",
		skipPreflight: false
	});

	// Verify the transaction actually landed on-chain
	let verified = null;
	for (let i = 0; i < 5; i++) {
		verified = await connection.getTransaction(signature, {
			commitment: "confirmed",
			maxSupportedTransactionVersion: 0
		});
		if (verified) break;
		await new Promise((r) => setTimeout(r, 2000));
	}

	if (!verified) {
		throw new Error(`Transaction ${signature} was not found on-chain after 5 attempts — likely dropped`);
	}
	if (verified.meta?.err) {
		throw new Error(`Transaction ${signature} landed but failed on-chain: ${JSON.stringify(verified.meta.err)}`);
	}

	return signature;
}

module.exports = { checkTransaction, sendToCharity, GLOBAL_POOL_WALLET, connection };
