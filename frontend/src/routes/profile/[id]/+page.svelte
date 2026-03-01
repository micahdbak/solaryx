<script>
	import { page } from "$app/stores";
	import ProfileView from "$lib/components/ProfileView.svelte";
</script>

<ProfileView userId={$page.params.id} />
