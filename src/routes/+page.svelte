<script lang="ts">
	import { MdProcessor, MdSvelte } from '$lib/index.js';
	import { IncrementalParser, type ParseStats } from '$lib/incremental.js';
	import type { Root } from 'mdast';
	import remarkGfm from 'remark-gfm';
	import remarkMath from 'remark-math';
	import MathBlock from './MathBlock.svelte';
	import MathInline from './MathInline.svelte';

	const sampleMarkdown = `# Incremental Markdown Parsing Demo

This demonstrates **streaming markdown** rendering, similar to how LLM outputs are displayed in real-time.

## Features

The incremental parser caches finalized blocks and only re-parses the *active tail*, achieving **O(n)** complexity instead of O(n²).

### Code Example

\`\`\`typescript
import { MdSvelte } from '@jazzymcjazz/mdsvelte';

let source = $state('');

async function streamFromLLM() {
  for await (const token of llmStream) {
    source += token;
  }
}
\`\`\`

### How It Works

1. **Block boundary detection** via a context-aware state machine
2. **Finalized blocks** are cached as MDAST subtrees — never re-parsed
3. Only the **active tail** is parsed with remark on each update
4. **Transform plugins** run on the full stitched tree

> The throttle batches rapid token arrivals so the parser runs at most ~33 times per second, while the UI stays smooth.

---

### A Table

| Feature | Status | Notes |
|---------|--------|-------|
| Block caching | Done | Finalized blocks cached |
| Throttling | Done | Configurable via \`throttleMs\` |
| Fence detection | Done | Handles \`\`\` and ~~~ |
| List detection | Done | Ordered and unordered |
| Blockquote detection | Done | With lazy continuation |

### Math Support (with plugins)

Inline math like $E = mc^2$ and display math:



### Final Thoughts

The incremental parser is **fully backward compatible**. Without \`throttleMs\`, it behaves identically to the original parser. With streaming, it avoids redundant work by caching completed blocks.

That's all for this demo!`;

	MdProcessor.setGlobalPlugins({
		remarkPlugins: [remarkGfm, remarkMath]
	});

	const mathRenderers = {
		math: MathBlock,
		inlineMath: MathInline
	};

	// Standalone parser instance for stats collection (demo-only)
	const statsParser = new IncrementalParser();

	let source = $state('');
	let isStreaming = $state(false);
	let isPaused = $state(false);
	let speed = $state(20);
	let tokenSize = $state(3);
	let throttleMs = $state(30);
	let charCount = $state(0);
	let blockCount = $state(0);
	let stats = $state<ParseStats>({
		updates: 0,
		tailParses: 0,
		cacheParses: 0,
		cachedBlocks: 0,
		tailLines: 0,
		totalLines: 0
	});
	let streamController: { stop: () => void; pause: () => void; resume: () => void } | null = null;

	function onparse(node: Root) {
		blockCount = node.children.length;
		// Mirror MdSvelte's internal parse to collect stats for the demo
		statsParser.update(source);
		stats = { ...statsParser.stats };
	}

	function startStream() {
		source = '';
		charCount = 0;
		blockCount = 0;
		isStreaming = true;
		isPaused = false;

		let index = 0;
		let stopped = false;
		let paused = false;

		function tick() {
			if (stopped) return;
			if (paused) {
				requestAnimationFrame(tick);
				return;
			}

			const chunk = sampleMarkdown.slice(index, index + tokenSize);
			if (chunk) {
				source += chunk;
				index += tokenSize;
				charCount = index;
				setTimeout(tick, speed);
			} else {
				isStreaming = false;
				charCount = sampleMarkdown.length;
			}
		}

		streamController = {
			stop: () => {
				stopped = true;
				isStreaming = false;
				isPaused = false;
			},
			pause: () => {
				paused = true;
				isPaused = true;
			},
			resume: () => {
				paused = false;
				isPaused = false;
			}
		};

		tick();
	}

	function stopStream() {
		streamController?.stop();
		streamController = null;
	}

	function togglePause() {
		if (isPaused) {
			streamController?.resume();
		} else {
			streamController?.pause();
		}
	}

	function loadInstant() {
		stopStream();
		source = sampleMarkdown;
		charCount = sampleMarkdown.length;
		blockCount = 0;
	}

	function resetDemo() {
		stopStream();
		source = '';
		charCount = 0;
		blockCount = 0;
		statsParser.reset();
		stats = { ...statsParser.stats };
	}

	let progress = $derived(
		sampleMarkdown.length > 0 ? Math.round((charCount / sampleMarkdown.length) * 100) : 0
	);

	let savedLines = $derived(stats.totalLines > 0 ? stats.totalLines - stats.tailLines : 0);
</script>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css"
		crossorigin="anonymous"
	/>
</svelte:head>

<div class="demo">
	<header>
		<h1>Streaming Markdown Demo</h1>
		<p class="subtitle">Incremental parsing with block-level caching</p>
	</header>

	<div class="controls">
		<div class="control-row">
			<button onclick={startStream} disabled={isStreaming}>Stream</button>
			<button onclick={togglePause} disabled={!isStreaming}>
				{isPaused ? 'Resume' : 'Pause'}
			</button>
			<button onclick={stopStream} disabled={!isStreaming}>Stop</button>
			<button onclick={loadInstant} disabled={isStreaming}>Load Instant</button>
			<button onclick={resetDemo}>Reset</button>
		</div>

		<div class="sliders">
			<label>
				Speed: {speed}ms/token
				<input type="range" min="1" max="100" bind:value={speed} />
			</label>
			<label>
				Token size: {tokenSize} chars
				<input type="range" min="1" max="20" bind:value={tokenSize} />
			</label>
			<label>
				Throttle: {throttleMs}ms
				<input type="range" min="0" max="200" bind:value={throttleMs} />
			</label>
		</div>

		<div class="stats">
			<div class="stat">
				<span class="stat-value">{charCount}<span class="stat-unit">/{sampleMarkdown.length}</span></span>
				<span class="stat-label">chars</span>
			</div>
			<div class="stat">
				<span class="stat-value">{stats.updates}</span>
				<span class="stat-label">updates</span>
			</div>
			<div class="stat">
				<span class="stat-value">{stats.tailParses}</span>
				<span class="stat-label">tail parses</span>
			</div>
			<div class="stat">
				<span class="stat-value">{stats.cachedBlocks}</span>
				<span class="stat-label">cached blocks</span>
			</div>
			<div class="stat">
				<span class="stat-value">{stats.tailLines}<span class="stat-unit">/{stats.totalLines}</span></span>
				<span class="stat-label">tail/total lines</span>
			</div>
			<div class="stat">
				<span class="stat-value">{blockCount}</span>
				<span class="stat-label">ast blocks</span>
			</div>
			<div class="stat">
				<span class="stat-value">{progress}%</span>
				<span class="stat-label">progress</span>
			</div>
		</div>

		{#if stats.totalLines > 0}
			<div class="savings">
				Remark parses {stats.tailLines} of {stats.totalLines} lines ({savedLines} lines cached, skipped)
			</div>
		{/if}

		<div class="progress-bar">
			<div class="progress-fill" style="width: {progress}%"></div>
		</div>
	</div>

	<div class="output">
		{#if source}
			<MdSvelte {source} {onparse} {throttleMs} renderers={mathRenderers} />
		{:else}
			<p class="placeholder">Press "Stream" to begin the demo...</p>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		background-color: #0d1117;
		color: #e6edf3;
		font-family:
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
	}

	.demo {
		max-width: 860px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	header {
		margin-bottom: 1.5rem;
		border-bottom: 1px solid #30363d;
		padding-bottom: 1rem;
	}

	header h1 {
		margin: 0 0 0.25rem;
		font-size: 1.5rem;
		color: #f0f6fc;
	}

	.subtitle {
		margin: 0;
		color: #8b949e;
		font-size: 0.9rem;
	}

	.controls {
		background: #161b22;
		border: 1px solid #30363d;
		border-radius: 8px;
		padding: 1rem;
		margin-bottom: 1.5rem;
	}

	.control-row {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}

	button {
		padding: 0.4rem 1rem;
		border-radius: 6px;
		border: 1px solid #30363d;
		background: #21262d;
		color: #e6edf3;
		cursor: pointer;
		font-size: 0.85rem;
		transition: background 0.15s;
	}

	button:hover:not(:disabled) {
		background: #30363d;
	}

	button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.sliders {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.8rem;
		color: #8b949e;
	}

	input[type='range'] {
		width: 140px;
		accent-color: #58a6ff;
	}

	.stats {
		display: flex;
		gap: 1.25rem;
		flex-wrap: wrap;
		margin-bottom: 0.75rem;
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.stat-value {
		font-size: 1.1rem;
		font-weight: 600;
		color: #58a6ff;
		font-variant-numeric: tabular-nums;
	}

	.stat-unit {
		font-size: 0.8rem;
		font-weight: 400;
		color: #8b949e;
	}

	.stat-label {
		font-size: 0.65rem;
		color: #8b949e;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.savings {
		font-size: 0.8rem;
		color: #3fb950;
		margin-bottom: 0.75rem;
	}

	.progress-bar {
		height: 3px;
		background: #21262d;
		border-radius: 2px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: #58a6ff;
		transition: width 0.1s linear;
	}

	.output {
		background: #161b22;
		border: 1px solid #30363d;
		border-radius: 8px;
		padding: 1.5rem;
		min-height: 200px;
	}

	.output :global(h1) {
		font-size: 1.75rem;
		border-bottom: 1px solid #30363d;
		padding-bottom: 0.3rem;
		margin-top: 0;
	}

	.output :global(h2) {
		font-size: 1.35rem;
		border-bottom: 1px solid #30363d;
		padding-bottom: 0.25rem;
	}

	.output :global(h3) {
		font-size: 1.1rem;
	}

	.output :global(code) {
		background: #0d1117;
		padding: 0.15em 0.4em;
		border-radius: 4px;
		font-size: 0.85em;
		font-family: 'SF Mono', 'Fira Code', monospace;
	}

	.output :global(pre) {
		background: #0d1117;
		border: 1px solid #30363d;
		border-radius: 6px;
		padding: 1rem;
		overflow-x: auto;
	}

	.output :global(pre code) {
		background: none;
		padding: 0;
	}

	.output :global(blockquote) {
		border-left: 3px solid #30363d;
		margin-left: 0;
		padding-left: 1rem;
		color: #8b949e;
	}

	.output :global(table) {
		width: 100%;
		border-collapse: collapse;
	}

	.output :global(th),
	.output :global(td) {
		border: 1px solid #30363d;
		padding: 0.5rem 0.75rem;
		text-align: left;
	}

	.output :global(th) {
		background: #0d1117;
	}

	.output :global(hr) {
		border: none;
		border-top: 1px solid #30363d;
		margin: 1.5rem 0;
	}

	.output :global(a) {
		color: #58a6ff;
	}

	.output :global(li) {
		margin-bottom: 0.25rem;
	}

	.placeholder {
		color: #8b949e;
		font-style: italic;
		text-align: center;
		padding: 3rem 0;
	}
</style>
