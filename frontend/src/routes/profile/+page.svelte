<script>
	import { onMount } from "svelte";
	import ProfileView from "$lib/components/ProfileView.svelte";

	let userId = $state(null);

	onMount(async () => {
		try {
			const authRes = await fetch("/api/auth/status");
			const authData = await authRes.json();

			if (!authData.status) {
				window.location.href = "/login";
				return;
			}

			userId = authData.user.id;
		} catch (e) {
			console.error("Auth check failed:", e);
			window.location.href = "/login";
		}
	});
</script>

{#if userId}
	<ProfileView {userId} />
{/if}
