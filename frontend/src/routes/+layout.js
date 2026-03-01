export const ssr = false;

export async function load({ fetch }) {
	try {
		const res = await fetch("/api/auth/status");
		if (res.ok) {
			const data = await res.json();
			return {
				user: data.status ? data.user : null
			};
		}
	} catch (e) {
		console.error("Failed to fetch auth status", e);
	}
	return {
		user: null
	};
}
