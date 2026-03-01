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

// Verify a deposit transaction: confirm it transferred SOL to the pool wallet.
async function checkTransaction(signature) {
	// Retry up to 5 times to handle RPC propagation delays
	let tx = null;
	for (let i = 0; i < 5; i++) {
		tx = await connection.getParsedTransaction(signature, {
			maxSupportedTransactionVersion: 0,
			commitment: "confirmed"
		});
		if (tx) break;
		await new Promise((r) => setTimeout(r, 2000));
	}

	if (!tx) throw new Error("Transaction not found on chain");
	if (tx.meta?.err) throw new Error("Transaction failed on chain");

	let transferLamports = 0;
	for (const ix of tx.transaction?.message?.instructions ?? []) {
		if (ix.program === "system" || ix.programId?.toString() === "11111111111111111111111111111111") {
			if (ix.parsed?.type === "transfer" && ix.parsed.info?.destination === GLOBAL_POOL_WALLET) {
				transferLamports += Number(ix.parsed.info.lamports);
			}
		}
	}

	if (transferLamports <= 0) throw new Error("Transaction did not transfer SOL to the pool wallet");

	return { amount: transferLamports / LAMPORTS_PER_SOL, status: "finalized" };
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

	if (!verified) throw new Error(`Transaction ${signature} dropped — not found on-chain after 5 attempts`);
	if (verified.meta?.err) throw new Error(`Transaction ${signature} failed on-chain`);

	return signature;
}

module.exports = { checkTransaction, sendToCharity, GLOBAL_POOL_WALLET, connection };
