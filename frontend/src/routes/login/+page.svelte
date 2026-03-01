<script>
	import { onMount } from "svelte";

	let { data } = $props();

	onMount(() => {
		// If user naturally lands on this page while logged in, redirect home.
		if (data?.user) {
			window.location.href = "/";
		}
	});

	let email = $state("");
	let password = $state("");
	let error = $state("");

	async function login() {
		try {
			const body = { email, password };
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(body)
			});

			if (!res.ok) {
				let msg;
				try {
					msg = (await res.json()).error;
				} catch {
					msg = "Internal server error";
				}

				throw new Error(msg);
			}

			// Force full load to update global layout state
			window.location.href = "/";
		} catch (ex) {
			error = `${ex.message || ex}`;
		}
	}
</script>

<div class="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
	<div class="w-full max-w-md">
		<!-- Login Card -->
		<div
			class="bg-[var(--bg-card)] border border-[var(--border-card)] rounded-2xl p-8 shadow-2xl space-y-5"
		>
			<h1 class="text-2xl font-bold text-[var(--text-primary)] text-center mb-2">Log In</h1>

			<!-- Email -->
			<div class="space-y-1.5">
				<label
					for="login-email"
					class="block text-sm font-semibold text-[var(--text-muted)]">Email</label
				>
				<input
					id="login-email"
					class="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
					type="text"
					placeholder="name@example.com"
					bind:value={email}
				/>
			</div>

			<!-- Password -->
			<div class="space-y-1.5">
				<label
					for="login-password"
					class="block text-sm font-semibold text-[var(--text-muted)]">Password</label
				>
				<input
					id="login-password"
					class="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors"
					type="password"
					placeholder="••••••••"
					bind:value={password}
				/>
			</div>

			<!-- Submit Button -->
			<button
				class="w-full py-3 rounded-lg font-bold text-[#e0e4f0] bg-[var(--color-primary)] hover:brightness-110 transition-all duration-200 shadow-[0_4px_14px_0_rgba(122,162,247,0.2)] hover:shadow-[0_6px_20px_0_rgba(122,162,247,0.3)] cursor-pointer mt-2"
				type="button"
				onclick={login}
			>
				Log In
			</button>

			<!-- Error Message -->
			{#if error}
				<p
					class="text-[var(--color-primary)] text-sm text-center font-medium bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 rounded-lg px-4 py-2"
				>
					{error}
				</p>
			{/if}

			<!-- Signup Link -->
			<p class="text-center text-sm text-[var(--text-muted)] pt-2">
				Don't have an account? <a
					href="/signup"
					class="text-[var(--color-primary)] hover:brightness-125 font-semibold transition-colors"
					>Sign Up</a
				>
			</p>
		</div>
	</div>
</div>
