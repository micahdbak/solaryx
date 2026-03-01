<script>
	import { onMount, onDestroy } from "svelte";
	import {
		fetchWalletBalance,
		depositWallet,
		fetchDeposits,
		fetchConfig,
		fetchBlockhash,
		redeemCoupon
	} from "$lib/api";
	import { themeLockedStore } from "$lib/theme";
	import { formatSol } from "$lib/utils";
	import { invalidateAll } from "$app/navigation";
	import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

	let balance = $state(0);
	let deposits = $state([]);
	let loading = $state(true);

	// Mock wallet connectivity
	let walletConnected = $state(false);
	let walletAddress = $state("");
	let isConnecting = $state(false);

	let depositAmount = $state("");
	let isDepositing = $state(false);

	let couponCode = $state("");
	let isRedeeming = $state(false);

	onMount(async () => {
		$themeLockedStore = true; // Optional: keep it consistent if desired
		try {
			const [balRes, depRes] = await Promise.all([fetchWalletBalance(), fetchDeposits()]);
			balance = balRes.balance;
			deposits = depRes;
		} catch (err) {
			console.error("Failed to load wallet data", err);
		} finally {
			loading = false;
		}
	});

	onDestroy(() => {
		$themeLockedStore = false;
	});

	async function handleConnect() {
		if (!window.solana || !window.solana.isPhantom) {
			alert("Phantom wallet not found! Please install the Phantom browser extension.");
			window.open("https://phantom.app/", "_blank");
			return;
		}

		if (walletConnected) {
			try {
				await window.solana.disconnect();
				walletConnected = false;
				walletAddress = "";
			} catch (err) {
				console.error("Disconnect failed", err);
			}
			return;
		}

		isConnecting = true;
		try {
			const resp = await window.solana.connect();
			walletAddress = resp.publicKey.toString();
			walletConnected = true;
		} catch (err) {
			console.error("User rejected connection", err);
		} finally {
			isConnecting = false;
		}
	}

	async function handleDeposit() {
		if (!walletConnected || !window.solana) {
			alert("Please connect your wallet first");
			return;
		}
		if (!depositAmount || depositAmount <= 0) return;

		try {
			isDepositing = true;

			// 1. Fetch config to get the current platform wallet
			const config = await fetchConfig();
			const platformWalletPubKey = new PublicKey(config.pool_wallet_address);

			// 2. Get user's public key
			const fromPubKey = new PublicKey(walletAddress);

			// 3. Convert SOL to lamports (1 SOL = 1,000,000,000 lamports)
			const lamports = Math.round(Number(depositAmount) * 1e9);

			// 4. Create the transfer instruction
			const transaction = new Transaction().add(
				SystemProgram.transfer({
					fromPubkey: fromPubKey,
					toPubkey: platformWalletPubKey,
					lamports: lamports
				})
			);

			// 5. Fetch a recent blockhash via our backend proxy
			const { blockhash } = await fetchBlockhash();
			transaction.recentBlockhash = blockhash;
			transaction.feePayer = fromPubKey;

			// 5. Ask user to sign and send the transaction via Phantom
			const { signature } = await window.solana.signAndSendTransaction(transaction);

			// 6. Send signature to backend to verify and credit internal balance
			// The backend will handle waiting for network confirmation
			await depositWallet({ transaction_signature: signature });

			// Refresh data
			const [balRes, depRes] = await Promise.all([
				fetchWalletBalance(),
				fetchDeposits(),
				invalidateAll()
			]);
			balance = balRes.balance;
			deposits = depRes;
			depositAmount = "";

			alert("Deposit successful!");
		} catch (e) {
			console.error("Deposit failed", e);
			alert("Deposit failed: " + (e.message || "Unknown error"));
		} finally {
			isDepositing = false;
		}
	}

	async function handleRedeemCoupon() {
		if (!couponCode) return;
		try {
			isRedeeming = true;
			await redeemCoupon(couponCode);

			// Refresh data
			const [balRes, depRes] = await Promise.all([
				fetchWalletBalance(),
				fetchDeposits(),
				invalidateAll()
			]);
			balance = balRes.balance;
			deposits = depRes;

			couponCode = "";
			alert("Coupon redeemed successfully!");
		} catch (e) {
			console.error("Coupon redemption failed", e);
			alert("Redemption failed: " + (e.message || "Unknown error"));
		} finally {
			isRedeeming = false;
		}
	}

	function formatDate(dateStr) {
		const d = new Date(dateStr);
		return d.toLocaleDateString([], {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	}
</script>

<div class="max-w-[1000px] mx-auto p-4 md:p-8 w-full mt-4">
	<div class="mb-8">
		<h1 class="text-3xl font-extrabold text-[var(--text-primary)] mb-2 tracking-tight">
			Wallet Dashboard
		</h1>
		<p class="text-[var(--text-muted)]">
			Manage your connected wallet, external funds, and platform balance.
		</p>
	</div>

	{#if loading}
		<div class="flex items-center justify-center min-h-[40vh]">
			<p class="text-gray-500 font-medium animate-pulse">Loading wallet data...</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-start">
			<div class="space-y-6">
				<!-- Platform Balance Card -->
				<div
					class="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 shadow-xl relative overflow-hidden group"
				>
					<div
						class="absolute inset-0 bg-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
					></div>
					<div class="flex justify-between items-start mb-4">
						<div class="flex items-center gap-2">
							<div
								class="w-8 h-8 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center"
							>
								<svg
									class="w-4 h-4 text-[var(--color-primary)]"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="2"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									></path></svg
								>
							</div>
							<h2 class="text-lg font-bold text-[var(--text-muted)]">
								Platform Balance
							</h2>
						</div>
					</div>
					<div>
						<div
							class="text-4xl font-extrabold text-[var(--text-primary)] tracking-tight flex items-end gap-2"
						>
							{formatSol(balance)}
							<span class="text-xl text-[var(--text-muted)] font-bold mb-1">SOL</span>
						</div>
						<p class="text-xs text-gray-500 mt-2 font-medium">
							Funds available instantly for charity markets
						</p>
					</div>
				</div>

				<!-- Connect Wallet Card -->
				<div
					class="bg-[var(--bg-card)] border {walletConnected
						? 'border-[#9ece6a]/30'
						: 'border-[var(--border-card)]'} rounded-2xl p-6 shadow-xl transition-all duration-500"
				>
					<h2 class="text-lg font-bold text-[var(--text-primary)] mb-4">Solana Wallet</h2>

					{#if walletConnected}
						<div class="flex flex-col gap-4">
							<div
								class="flex items-center gap-3 p-3 bg-[var(--bg-muted)]/40 rounded-xl border border-[var(--border-card)]"
							>
								<div
									class="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center shadow-lg"
								>
									<svg
										class="w-5 h-5 text-[#e0e4f0]"
										viewBox="0 0 397 311"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										><path
											d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
											fill="currentColor"
										/><path
											d="M64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
											fill="currentColor"
										/><path
											d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
											fill="currentColor"
										/></svg
									>
								</div>
								<div class="flex-1 overflow-hidden">
									<div
										class="text-xs text-[#9ece6a] font-bold mb-0.5 uppercase tracking-wider"
									>
										Connected
									</div>
									<div
										class="text-[var(--text-muted)] font-mono text-sm truncate"
									>
										{walletAddress}
									</div>
								</div>
								<button
									onclick={handleConnect}
									class="text-xs text-[var(--text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer font-bold px-2 py-1 bg-[var(--bg-muted)] hover:bg-[var(--bg-muted)]/80 rounded-lg"
									>Disconnect</button
								>
							</div>
							<p class="text-xs text-[var(--text-muted)] leading-relaxed">
								Your external wallet is connected. You can now deposit SOL into your
								platform balance to donate in markets instantly.
							</p>
						</div>
					{:else}
						<div
							class="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[var(--border-card)] rounded-xl bg-[var(--bg-muted)]/30"
						>
							<svg
								class="w-12 h-12 text-gray-600 mb-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1.5"
								><path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
								></path></svg
							>
							<p class="text-sm text-gray-400 mb-4 text-center">
								Connect your Phantom or chosen wallet to interact with the
								blockchain.
							</p>
							<button
								onclick={handleConnect}
								disabled={isConnecting}
								class="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-[#e0e4f0] rounded-xl font-bold transition-all shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transform active:scale-95"
							>
								{isConnecting ? "Connecting..." : "Connect Wallet"}
							</button>
						</div>
					{/if}
				</div>
			</div>

			<!-- Deposit Funds Card -->
			<div
				class="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 shadow-xl flex flex-col h-full"
			>
				<h2
					class="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2"
				>
					<svg
						class="w-5 h-5 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-width="2"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M7 11l5-5m0 0l5 5m-5-5v12"
						></path></svg
					>
					Deposit Funds
				</h2>

				<div class="space-y-4 mb-6 relative group flex-1">
					<div class="flex justify-between items-center text-sm font-medium">
						<span class="text-gray-400 group-focus-within:text-[#e0e4f0] transition-colors"
							>Amount (SOL)</span
						>
					</div>
					<div class="relative">
						<span
							class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-[#e0e4f0] transition-colors"
						>
							<svg
								class="w-5 h-5"
								viewBox="0 0 397 311"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								><path
									d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
									fill="currentColor"
								/><path
									d="M64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
									fill="currentColor"
								/><path
									d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
									fill="currentColor"
								/></svg
							>
						</span>
						<input
							type="number"
							min="0"
							placeholder="0.00"
							bind:value={depositAmount}
							class="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl py-4 pl-12 pr-4 text-right text-2xl font-bold text-[var(--text-primary)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all no-spinners"
							disabled={!walletConnected || isDepositing}
						/>
					</div>

					<div class="flex gap-2 text-xs font-semibold">
						{#each [0.5, 1, 5, 10] as preset}
							<button
								class="flex-1 py-3 bg-[var(--bg-muted)]/80 hover:bg-[var(--bg-muted)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
								onclick={() => (depositAmount = preset)}
								disabled={!walletConnected || isDepositing}
							>
								+{preset}
							</button>
						{/each}
					</div>
				</div>

				<div class="mt-auto">
					{#if !walletConnected}
						<button
							onclick={handleConnect}
							class="w-full py-4 bg-gray-800 text-gray-400 font-bold rounded-xl cursor-not-allowed"
						>
							Connect Wallet to Deposit
						</button>
					{:else}
						<button
							onclick={handleDeposit}
							disabled={isDepositing || !depositAmount || depositAmount <= 0}
							class="w-full py-4 bg-[var(--color-primary)] hover:brightness-110 disabled:bg-[var(--bg-muted)] disabled:text-[var(--text-muted)] text-[#e0e4f0] font-extrabold text-lg rounded-xl shadow-[0_4px_14px_0_rgba(122,162,247,0.15)] hover:shadow-[0_6px_20px_0_rgba(122,162,247,0.25)] active:scale-[0.98] disabled:shadow-none disabled:active:scale-100 transition-all cursor-pointer tracking-wide"
						>
							{isDepositing
								? "Processing on-chain..."
								: `Deposit ${depositAmount ? `${depositAmount} SOL` : "0 SOL"}`}
						</button>
					{/if}
					<p class="text-center text-xs text-gray-500 mt-4 leading-relaxed px-4">
						Funds deposited here are securely held in the platform's Global Pool Wallet
						to enable instant, zero-gas donations in markets.
					</p>
				</div>
			</div>
		</div>

		<!-- Redeem Coupon -->
		<div
			class="mt-8 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 shadow-xl w-full"
		>
			<h2 class="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
				<svg
					class="w-5 h-5 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
					></path></svg
				>
				Redeem Coupon
			</h2>

			<div class="flex flex-col sm:flex-row gap-4 items-stretch">
				<div class="relative flex-1 group">
					<span
						class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within:text-[#e0e4f0] transition-colors"
					>
						<svg
							class="w-4 h-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
							></path></svg
						>
					</span>
					<input
						type="text"
						placeholder="ABC123"
						bind:value={couponCode}
						class="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] font-mono tracking-widest focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all uppercase"
						disabled={isRedeeming}
					/>
				</div>

				<button
					onclick={handleRedeemCoupon}
					disabled={isRedeeming || !couponCode}
					class="px-8 py-3 w-full sm:w-auto bg-[var(--color-primary)] hover:brightness-110 disabled:bg-[var(--bg-muted)] disabled:text-[var(--text-muted)] text-[#e0e4f0] font-extrabold text-sm rounded-xl shadow-[0_4px_14px_0_rgba(122,162,247,0.15)] hover:shadow-[0_6px_20px_0_rgba(122,162,247,0.25)] active:scale-[0.98] disabled:shadow-none disabled:active:scale-100 transition-all cursor-pointer tracking-wide whitespace-nowrap"
				>
					{isRedeeming ? "Redeeming..." : "Redeem Coupon"}
				</button>
			</div>
		</div>

		<!-- Deposit History -->
		<div
			class="mt-8 bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-6 shadow-xl w-full"
		>
			<h3 class="text-lg font-bold text-[var(--text-primary)] mb-4">Deposit History</h3>

			<div class="overflow-x-auto">
				<table class="w-full text-left border-collapse">
					<thead
						class="text-[var(--text-muted)] text-xs uppercase tracking-wider border-b border-[var(--border-card)]"
					>
						<tr>
							<th class="py-3 px-4 font-bold">Date</th>
							<th class="py-3 px-4 font-bold">Amount</th>
							<th class="py-3 px-4 font-bold">Transaction</th>
							<th class="py-3 px-4 font-bold text-right">Status</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-800/60 font-medium text-sm">
						{#if deposits.length === 0}
							<tr>
								<td
									colspan="4"
									class="py-8 text-center text-gray-500 text-sm italic"
								>
									No deposits found. Connect your wallet and top up to get
									started!
								</td>
							</tr>
						{:else}
							{#each deposits as dep (dep.id)}
								<tr class="hover:bg-gray-800/20 transition-colors">
									<td class="py-4 px-4 text-gray-400 whitespace-nowrap"
										>{formatDate(dep.created_at)}</td
									>
									<td
										class="py-4 px-4 font-bold text-[#e0e4f0] flex items-center gap-1.5"
									>
										<svg
											class="w-3.5 h-3.5 text-gray-500"
											viewBox="0 0 397 311"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
											><path
												d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
												fill="currentColor"
											/><path
												d="M64.6 3.8C67 1.4 70.3 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
												fill="currentColor"
											/><path
												d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
												fill="currentColor"
											/></svg
										>
										{formatSol(dep.amount_sol)}
									</td>
									<td class="py-4 px-4 text-gray-400 font-mono text-xs">
										{#if dep.transaction_signature}
											<div class="flex items-center gap-2">
												{dep.transaction_signature.substring(0, 16)}...
												<button
													class="hover:text-[#e0e4f0] transition-colors cursor-pointer"
													title="Copy signature"
													><svg
														class="w-3.5 h-3.5"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														stroke-width="2"
														><path
															stroke-linecap="round"
															stroke-linejoin="round"
															d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
														></path></svg
													></button
												>
											</div>
										{:else}
											-
										{/if}
									</td>
									<td class="py-4 px-4 text-right">
										<div
											class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#9ece6a]/10 text-[#9ece6a] text-xs font-bold uppercase tracking-wider border border-[#9ece6a]/20"
										>
											<div
												class="w-1.5 h-1.5 rounded-full bg-[#9ece6a]"
											></div>
											{dep.status || "Confirmed"}
										</div>
									</td>
								</tr>
							{/each}
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
