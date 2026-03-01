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
		return /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{4,32}$/.test(password);
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
					"Content-Type": "application/json"
				},
				body: JSON.stringify(data)
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

<div class="flex flex-col justify-start items-start">
	<h1>Sign Up</h1>
	<p>Email:</p>
	<input
		class="border border-gray"
		type="text"
		placeholder="name@example.com"
		bind:value={email}
	/>
	<p>Password:</p>
	<input class="border border-gray" type="password" bind:value={password} />
	<p>Password (again):</p>
	<input class="border border-gray" type="password" bind:value={passwordAgain} />
	<button class="bg-gray-500" type="button" onclick={signup}>Sign Up</button>
	<p class="text-red">{error}</p>
</div>
