<script>
	import { onMount } from "svelte";

	let message = $state("Logging out...");

	onMount(async () => {
		try {
			await fetch("/api/auth/logout", {
				method: "POST"
			});
			// Force full load to clear layout state
			window.location.href = "/";
		} catch {
			message = "Failed to log out. Try again.";
		}
	});
</script>

<div class="p-4">
	<p>{message}</p>
</div>
