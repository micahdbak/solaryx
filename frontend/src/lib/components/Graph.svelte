<script>
	import { formatSol } from "$lib/utils";
	import { goto } from "$app/navigation";

	let {
		shares = [],
		currentBet,
		timeframe = "All",
		selectedCause = $bindable(),
		href = ""
	} = $props();

	let chartWrapper;
	let width = $state(800);
	let height = $state(280);

	let hoveredData = $state(null);
	let isHovering = $state(false);

	// Derived chart data
	let chartData = $derived.by(() => {
		if (!currentBet || !shares) return null;

		const aId = currentBet.optionA.market_charity_id;
		const bId = currentBet.optionB.market_charity_id;

		const now = Date.now();
		let cutoff = currentBet.createdAt;

		if (timeframe === "1H") cutoff = now - 60 * 60 * 1000;
		if (timeframe === "1D") cutoff = now - 24 * 60 * 60 * 1000;
		if (timeframe === "1W") cutoff = now - 7 * 24 * 60 * 60 * 1000;
		cutoff = Math.max(cutoff, currentBet.createdAt);

		let totalA = 0;
		let totalB = 0;

		// Calculate background totals up to cutoff
		shares.forEach((s) => {
			const t = new Date(s.created_at).getTime();
			if (t <= cutoff) {
				const amount = Number(s.amount_sol) || 0;
				if (s.market_charity_id === aId) totalA += amount;
				if (s.market_charity_id === bId) totalB += amount;
			}
		});

		const sharesInRange = shares.filter((s) => new Date(s.created_at).getTime() > cutoff);

		let startTime, endTime;
		if (sharesInRange.length === 0) {
			startTime = cutoff;
			endTime = now;
		} else {
			const times = sharesInRange.map((s) => new Date(s.created_at).getTime());
			startTime = Math.min(cutoff, Math.min(...times));
			endTime = Math.max(now, Math.max(...times));
		}

		if (startTime === endTime) {
			endTime = startTime + 1000;
		}

		const points = [];
		// Initial point
		points.push({ time: startTime, a: totalA, b: totalB });

		sharesInRange
			.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
			.forEach((share) => {
				const t = new Date(share.created_at).getTime();
				const amount = Number(share.amount_sol) || 0;
				if (share.market_charity_id === aId) totalA += amount;
				if (share.market_charity_id === bId) totalB += amount;

				points.push({ time: t, a: totalA, b: totalB });
			});

		// Final point to draw everything to the right edge
		points.push({ time: endTime, a: totalA, b: totalB });

		return { points, startTime, endTime };
	});

	let paths = $derived.by(() => {
		if (!chartData || !chartData.points.length || width <= 0 || height <= 0) {
			return null;
		}

		const { points } = chartData;

		let maxY = -Infinity;
		let minY = Infinity;
		points.forEach((p) => {
			if (p.a > maxY) maxY = p.a;
			if (p.b > maxY) maxY = p.b;
			if (p.a < minY) minY = p.a;
			if (p.b < minY) minY = p.b;
		});

		if (maxY === minY) {
			maxY += 1;
			minY = Math.max(0, minY - 1);
		}

		const range = maxY - minY;
		maxY = maxY + range * 0.15; // 15% top padding
		minY = Math.max(0, minY - range * 0.15); // 15% bottom padding, but don't drop below 0

		function xToPx(index) {
			if (points.length <= 1) return 0;
			return (index / (points.length - 1)) * width;
		}

		function yToPx(v) {
			return height - ((v - minY) / (maxY - minY)) * height;
		}

		let lineA = "";
		let lineB = "";

		for (let i = 0; i < points.length; i++) {
			const p = points[i];
			const x = xToPx(i);
			const yA = yToPx(p.a);
			const yB = yToPx(p.b);

			const prefix = i === 0 ? "M " : "L ";
			lineA += `${prefix}${x.toFixed(2)} ${yA.toFixed(2)} `;
			lineB += `${prefix}${x.toFixed(2)} ${yB.toFixed(2)} `;
		}

		lineA = lineA.trim();
		lineB = lineB.trim();

		// Area to baseline (fills under each line)
		function areaToBaseline(linePath) {
			let d = linePath + " ";
			const lastX = xToPx(points.length - 1).toFixed(2);
			const firstX = xToPx(0).toFixed(2);
			const bottom = height.toFixed(2);
			d += `L ${lastX} ${bottom} `;
			d += `L ${firstX} ${bottom} Z`;
			return d;
		}

		return {
			lineA,
			lineB,
			fillA: areaToBaseline(lineA),
			fillB: areaToBaseline(lineB)
		};
	});

	function handleMouseMove(e) {
		if (!chartData || !chartWrapper || width === 0) return;
		const rect = chartWrapper.getBoundingClientRect();
		const rawX = e.clientX - rect.left;

		isHovering = true;
		const boundedX = Math.max(0, Math.min(width, rawX));

		if (chartData.points.length === 0) return;

		const indexFloat = (boundedX / width) * (chartData.points.length - 1);
		const index = Math.max(0, Math.min(chartData.points.length - 1, Math.round(indexFloat)));

		let match = chartData.points[index];

		// Precise X coordinate of actual point for tracking
		const pxX = (index / Math.max(1, chartData.points.length - 1)) * width;

		// Calculate Y coordinates for the points to set tooltip height and draw markers
		let maxY = -Infinity;
		let minY = Infinity;
		chartData.points.forEach((p) => {
			if (p.a > maxY) maxY = p.a;
			if (p.b > maxY) maxY = p.b;
			if (p.a < minY) minY = p.a;
			if (p.b < minY) minY = p.b;
		});

		if (maxY === minY) {
			maxY += 1;
			minY = Math.max(0, minY - 1);
		}

		const range = maxY - minY;
		maxY = maxY + range * 0.15;
		minY = Math.max(0, minY - range * 0.15);

		const yA = height - ((match.a - minY) / (maxY - minY)) * height;
		const yB = height - ((match.b - minY) / (maxY - minY)) * height;
		// Tooltip floats above the visually highest point (lowest Y)
		const highestY = Math.min(yA, yB);

		hoveredData = {
			time: match.time,
			a: match.a,
			b: match.b,
			pxX: isNaN(pxX) ? boundedX : pxX,
			mouseX: boundedX,
			pxY: highestY,
			yA,
			yB
		};
	}

	function handleMouseLeave() {
		isHovering = false;
		hoveredData = null;
	}

	function handleClick(e) {
		if (href) {
			goto(href);
			return;
		}

		if (!chartData || !chartWrapper || !hoveredData) return;
		const rect = chartWrapper.getBoundingClientRect();
		const y = e.clientY - rect.top;

		let maxY = -Infinity;
		let minY = Infinity;
		chartData.points.forEach((p) => {
			if (p.a > maxY) maxY = p.a;
			if (p.b > maxY) maxY = p.b;
			if (p.a < minY) minY = p.a;
			if (p.b < minY) minY = p.b;
		});

		if (maxY === minY) {
			maxY += 1;
			minY = Math.max(0, minY - 1);
		}

		const range = maxY - minY;
		maxY = maxY + range * 0.15;
		minY = Math.max(0, minY - range * 0.15);

		const yA = height - ((hoveredData.a - minY) / (maxY - minY)) * height;
		const yB = height - ((hoveredData.b - minY) / (maxY - minY)) * height;

		const distA = Math.abs(yA - y);
		const distB = Math.abs(yB - y);

		if (distA <= distB) {
			selectedCause = currentBet.optionA.name;
		} else {
			selectedCause = currentBet.optionB.name;
		}
	}

	// Determine opacities based on selectedCause
	let activeA = $derived(selectedCause === currentBet?.optionA.name);
	let activeB = $derived(selectedCause === currentBet?.optionB.name);

	let patternOpacityA = $derived(activeA ? "0.6" : "0.25");
	let patternOpacityB = $derived(activeB ? "0.6" : "0.25");
	let fillOpacityA = $derived(activeA ? "0.35" : "0.15");
	let fillOpacityB = $derived(activeB ? "0.35" : "0.15");
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="relative w-full h-[280px] mt-2 rounded-lg overflow-hidden border border-gray-800/80 var-border-card bg-[var(--bg-card)] select-none {href
		? 'cursor-pointer'
		: 'cursor-crosshair'}"
	bind:this={chartWrapper}
	bind:clientWidth={width}
	bind:clientHeight={height}
	onmousemove={handleMouseMove}
	onmouseleave={handleMouseLeave}
	onclick={handleClick}
>
	{#if paths}
		<svg
			class="absolute inset-0 w-full h-full"
			viewBox="0 0 {width} {height}"
			preserveAspectRatio="none"
		>
			<defs>
				<!-- 1px optionA, 1px gap, 1px optionB, 1px gap -->
				<pattern
					id="rgPattern"
					width="4"
					height="4"
					patternUnits="userSpaceOnUse"
					patternTransform="rotate(45)"
				>
					<rect
						x="0"
						y="0"
						width="1"
						height="4"
						fill="var(--color-primary)"
						fill-opacity={patternOpacityA}
					></rect>
					<rect
						x="2"
						y="0"
						width="1"
						height="4"
						fill="var(--color-secondary)"
						fill-opacity={patternOpacityB}
					></rect>
				</pattern>
				<clipPath id="overlapClipArea">
					<path d={paths.fillA}></path>
				</clipPath>
			</defs>

			<!-- Fills (drawn first) -->
			<path d={paths.fillA} fill="var(--color-primary)" fill-opacity={fillOpacityA}></path>
			<path d={paths.fillB} fill="var(--color-secondary)" fill-opacity={fillOpacityB}></path>

			<!-- Overlap area (patterned, avoids "mixing") -->
			<path d={paths.fillB} fill="url(#rgPattern)" clip-path="url(#overlapClipArea)"></path>

			<!-- Lines (drawn last) -->
			<path d={paths.lineA} fill="none" stroke="var(--color-primary)" stroke-width="2.2"
			></path>
			<path d={paths.lineB} fill="none" stroke="var(--color-secondary)" stroke-width="2.2"
			></path>

			<!-- Hover crosshair and markers -->
			{#if isHovering && hoveredData && hoveredData.pxX >= 0 && hoveredData.pxX <= width}
				<line
					x1={hoveredData.pxX}
					y1="0"
					x2={hoveredData.pxX}
					y2={height}
					stroke="rgba(255,255,255,0.2)"
					stroke-width="1"
					stroke-dasharray="4"
				/>
				<!-- Point markers on the lines -->
				<circle
					cx={hoveredData.pxX}
					cy={hoveredData.yA}
					r="4"
					fill="var(--color-primary)"
					stroke="var(--bg-card)"
					stroke-width="2"
				/>
				<circle
					cx={hoveredData.pxX}
					cy={hoveredData.yB}
					r="4"
					fill="var(--color-secondary)"
					stroke="var(--bg-card)"
					stroke-width="2"
				/>
			{/if}
		</svg>

		<!-- Hover Tooltip -->
		{#if isHovering && hoveredData}
			<div
				class="absolute z-10 transition-transform duration-75 pointer-events-none bg-[var(--bg-tooltip)] text-[var(--text-tooltip)] p-3 rounded-lg text-xs shadow-xl border border-gray-200"
				style="
                    left: {hoveredData.mouseX}px;
                    top: {Math.max(10, hoveredData.pxY - 40)}px;
                    transform: translateX(calc(-50% + {hoveredData.mouseX > width / 1.5
					? '-30%'
					: hoveredData.mouseX < width / 3
						? '30%'
						: '0%'}));
                "
			>
				<div class="font-semibold text-gray-500 mb-1 border-b border-gray-100 pb-1">
					{new Date(hoveredData.time).toLocaleString([], {
						dateStyle: "short",
						timeStyle: "short"
					})}
				</div>
				<div class="flex flex-col gap-1.5 mt-2 font-bold text-[13px]">
					<span class="flex items-center gap-2" style="color: var(--color-primary);">
						<span
							class="w-2 h-2 rounded-full"
							style="background-color: var(--color-primary);"
						></span>
						{currentBet.optionA.name}: {formatSol(hoveredData.a)} SOL
					</span>
					<span class="flex items-center gap-2" style="color: var(--color-secondary);">
						<span
							class="w-2 h-2 rounded-full"
							style="background-color: var(--color-secondary);"
						></span>
						{currentBet.optionB.name}: {formatSol(hoveredData.b)} SOL
					</span>
				</div>
			</div>
		{/if}
	{:else}
		<div class="flex items-center justify-center h-full text-xs text-gray-500">
			No chart data available
		</div>
	{/if}
</div>
