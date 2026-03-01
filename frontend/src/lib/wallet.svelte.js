import { browser } from "$app/environment";

const WALLET_KEY = "connected_solana_wallet";

function createWalletStore() {
	let state = $state({
		address: null,
		isConnected: false,
		isConnecting: false,
		error: null
	});

	// Restore from localStorage if possible
	if (browser) {
		const saved = localStorage.getItem(WALLET_KEY);
		if (saved) {
			state.address = saved;
			state.isConnected = true;
		}
	}

	async function connect() {
		if (!browser || !window.solana || !window.solana.isPhantom) {
			state.error = "Phantom wallet is not installed";
			// Try to open Phantom website if they want
			window.open("https://phantom.app/", "_blank");
			return false;
		}

		try {
			state.isConnecting = true;
			state.error = null;
			const resp = await window.solana.connect();
			state.address = resp.publicKey.toString();
			state.isConnected = true;
			localStorage.setItem(WALLET_KEY, state.address);
			return true;
		} catch (err) {
			console.error("Wallet connection failed:", err);
			state.error = err.message || "Failed to connect wallet";
			return false;
		} finally {
			state.isConnecting = false;
		}
	}

	async function disconnect() {
		if (browser && window.solana) {
			await window.solana.disconnect();
		}
		state.address = null;
		state.isConnected = false;
		state.error = null;
		if (browser) {
			localStorage.removeItem(WALLET_KEY);
		}
	}

	return {
		get address() {
			return state.address;
		},
		get isConnected() {
			return state.isConnected;
		},
		get isConnecting() {
			return state.isConnecting;
		},
		get error() {
			return state.error;
		},
		connect,
		disconnect
	};
}

export const walletState = createWalletStore();
