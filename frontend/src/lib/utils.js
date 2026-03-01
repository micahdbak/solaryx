export function formatSol(amount) {
	const num = Number(amount);
	if (isNaN(num)) return "0";
	return new Intl.NumberFormat("en-US", { maximumFractionDigits: 9 }).format(num);
}
