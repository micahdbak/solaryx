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
	let passwordAgain = $state("");
	let error = $state("");

	function is_valid_password(password) {
		// a-Z, A-Z, 0-9, special chars, must be >=4 chars and <=32
		return /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{4,32}$/.test(
			password,
		);
	}

	async function signup() {
		if (password != passwordAgain) {
			error = "Passwords do not match.";
			return;
		}

		if (!is_valid_password(password)) {
			error =
				"Password can only contain a-z, A-Z, 0-9, '!@#$%^&*()_+-=', and be between 4 and 32 characters in length.";
			return;
		}

		try {
			const data = { email, password };
			const res = await fetch("/api/auth/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
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

			// Immediately fetch status manually to guarantee `data.user` updates
			// before redirect (or just force a full page refresh)
			window.location.href = "/";
		} catch (ex) {
			error = `${ex}`;
		}
	}
</script>

<div class="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
	<div class="w-full max-w-md">
		<!-- Welcome Header -->
		<div class="text-center mb-8">
			<h1
				class="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2"
			>
				Yahu Welcomes You
			</h1>
		</div>

		<!-- Signup Card -->
		<div
			class="bg-[#11141c] border border-gray-800 rounded-2xl p-8 shadow-2xl space-y-5"
		>
			<!-- Email -->
			<div class="space-y-1.5">
				<label
					for="signup-email"
					class="block text-sm font-semibold text-gray-300"
					>Email</label
				>
				<input
					id="signup-email"
					class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
					type="text"
					placeholder="name@example.com"
					bind:value={email}
				/>
			</div>

			<!-- Password -->
			<div class="space-y-1.5">
				<label
					for="signup-password"
					class="block text-sm font-semibold text-gray-300"
					>Password</label
				>
				<input
					id="signup-password"
					class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
					type="password"
					placeholder="••••••••"
					bind:value={password}
				/>
			</div>

			<!-- Confirm Password -->
			<div class="space-y-1.5">
				<label
					for="signup-password-again"
					class="block text-sm font-semibold text-gray-300"
					>Confirm Password</label
				>
				<input
					id="signup-password-again"
					class="w-full bg-black border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
					type="password"
					placeholder="••••••••"
					bind:value={passwordAgain}
				/>
			</div>

			<!-- Submit Button -->
			<button
				class="w-full py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-[0_4px_14px_0_rgba(59,130,246,0.3)] hover:shadow-[0_6px_20px_0_rgba(59,130,246,0.5)] cursor-pointer mt-2"
				type="button"
				onclick={signup}
			>
				Create Account
			</button>

			<!-- Error Message -->
			{#if error}
				<p
					class="text-red-400 text-sm text-center font-medium bg-red-950/20 border border-red-900/50 rounded-lg px-4 py-2"
				>
					{error}
				</p>
			{/if}

			<!-- Login Link -->
			<p class="text-center text-sm text-gray-400 pt-2">
				Already have an account? <a
					href="/login"
					class="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
					>Log In</a
				>
			</p>
		</div>
	</div>
</div>
