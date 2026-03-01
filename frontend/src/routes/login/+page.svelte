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

<div class="flex flex-col justify-start items-start">
	<h1>Log In</h1>
	<p>Email:</p>
	<input
		class="border border-gray-400 p-1 mb-2"
		type="text"
		placeholder="name@example.com"
		bind:value={email}
	/>
	<p>Password:</p>
	<input class="border border-gray-400 p-1 mb-2" type="password" bind:value={password} />
	<button class="bg-gray-200 border border-gray-400 px-4 py-1" type="button" onclick={login}
		>Log In</button
	>
	{#if error}
		<p class="text-red-500 mt-2">{error}</p>
	{/if}
</div>
