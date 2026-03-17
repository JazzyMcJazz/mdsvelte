import type { Root, RootContent } from 'mdast';
import { MdProcessor, type MarkdownProcessor } from './processor.js';

interface ParserContext {
	inFencedCode: boolean;
	fenceChar: '`' | '~' | null;
	fenceLength: number;
	fenceIndent: number;
	inBlockquote: boolean;
	inList: boolean;
	listIndent: number;
	inHtmlBlock: boolean;
}

function createContext(): ParserContext {
	return {
		inFencedCode: false,
		fenceChar: null,
		fenceLength: 0,
		fenceIndent: 0,
		inBlockquote: false,
		inList: false,
		listIndent: 0,
		inHtmlBlock: false
	};
}

/**
 * Detects the leading indent (number of spaces) of a line.
 */
function getIndent(line: string): number {
	let count = 0;
	for (const ch of line) {
		if (ch === ' ') count++;
		else if (ch === '\t') count += 4;
		else break;
	}
	return count;
}

/**
 * Checks if a line is a fenced code opening/closing marker.
 * Returns the fence character and length, or null.
 */
function parseFence(line: string): { char: '`' | '~'; length: number; indent: number } | null {
	const trimmed = line.trimStart();
	const indent = line.length - trimmed.length;
	if (indent > 3) return null; // indented code, not a fence

	let char: '`' | '~' | null = null;
	let length = 0;

	for (const ch of trimmed) {
		if (char === null) {
			if (ch === '`' || ch === '~') {
				char = ch;
				length = 1;
			} else {
				return null;
			}
		} else if (ch === char) {
			length++;
		} else {
			// For opening fences, info string can follow backticks
			// For closing fences, only spaces allowed after
			break;
		}
	}

	if (char && length >= 3) {
		return { char, length, indent };
	}
	return null;
}

/**
 * Checks if a line is blank (empty or whitespace only).
 */
function isBlank(line: string): boolean {
	return line.trim() === '';
}

/**
 * Checks if a line starts an ATX heading (# ... ######).
 */
function isAtxHeading(line: string): boolean {
	const trimmed = line.trimStart();
	const indent = line.length - trimmed.length;
	if (indent > 3) return false;
	const match = trimmed.match(/^#{1,6}(?:\s|$)/);
	return match !== null;
}

/**
 * Checks if a line is a thematic break (---, ***, ___).
 */
function isThematicBreak(line: string): boolean {
	const trimmed = line.trimStart();
	const indent = line.length - trimmed.length;
	if (indent > 3) return false;
	return /^(?:[-*_]\s*){3,}$/.test(trimmed);
}

/**
 * Checks if a line starts a list item.
 */
function isListItem(line: string): boolean {
	const trimmed = line.trimStart();
	const indent = line.length - trimmed.length;
	if (indent > 3) return false;
	// Unordered: - , * , +  followed by space
	// Ordered: 1. , 1) etc. followed by space
	return /^(?:[-*+]|\d{1,9}[.)]) /.test(trimmed);
}

/**
 * Checks if a line starts a blockquote.
 */
function isBlockquote(line: string): boolean {
	const trimmed = line.trimStart();
	const indent = line.length - trimmed.length;
	if (indent > 3) return false;
	return trimmed.startsWith('>');
}

/**
 * Checks if a line starts an HTML block (CommonMark types 1-6 openers).
 */
function isHtmlBlockStart(line: string): boolean {
	const trimmed = line.trimStart();
	const indent = line.length - trimmed.length;
	if (indent > 3) return false;
	// Simplified: detect common HTML block patterns
	return /^<(?:pre|script|style|textarea|!--|!DOCTYPE|\/?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hgroup|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|\/?>|$))/i.test(
		trimmed
	);
}

/**
 * Find block boundaries in a set of lines, starting from a given line and context.
 * Returns an array of line indices where block boundaries occur.
 * A boundary at index i means lines [previousBoundary+1 .. i] form a complete block.
 */
function findBlockBoundaries(
	lines: string[],
	startLine: number,
	context: ParserContext
): { boundaries: number[]; context: ParserContext } {
	const boundaries: number[] = [];
	const ctx = { ...context };
	let blockStartLine = startLine;
	let lastNonBlankLine = startLine - 1;
	let blankLineCount = 0;

	for (let i = startLine; i < lines.length; i++) {
		const line = lines[i];
		const blank = isBlank(line);

		// Inside fenced code block — only look for closing fence
		if (ctx.inFencedCode) {
			if (!blank) {
				const fence = parseFence(line);
				if (
					fence &&
					fence.char === ctx.fenceChar &&
					fence.length >= ctx.fenceLength &&
					// Closing fence: only spaces after fence chars
					line
						.trimStart()
						.replace(new RegExp(`^\\${ctx.fenceChar}+`), '')
						.trim() === ''
				) {
					ctx.inFencedCode = false;
					ctx.fenceChar = null;
					ctx.fenceLength = 0;
					ctx.fenceIndent = 0;
					// The code block ends here. Mark boundary at this line.
					// But don't finalize yet — wait for confirmation from next block.
				}
			}
			if (!blank) lastNonBlankLine = i;
			continue;
		}

		// Inside HTML block — look for blank line to end it (simplified)
		if (ctx.inHtmlBlock) {
			if (blank) {
				ctx.inHtmlBlock = false;
				// Block ended at lastNonBlankLine, boundary before this blank line
			}
			if (!blank) lastNonBlankLine = i;
			continue;
		}

		// Blank line handling
		if (blank) {
			blankLineCount++;

			// A blank line can terminate several block types
			if (ctx.inBlockquote) {
				ctx.inBlockquote = false;
			}

			// For lists, a blank line doesn't necessarily end the list
			// (loose lists have blank lines between items)
			// We'll be conservative: end list on blank + next non-list-item line
			continue;
		}

		// Non-blank line after blank(s) — potential block boundary
		if (blankLineCount > 0 && lastNonBlankLine >= blockStartLine) {
			// We had content, then blank line(s), now new content.
			// Check if this starts a new block.
			const isNewBlock =
				isAtxHeading(line) ||
				isThematicBreak(line) ||
				parseFence(line) !== null ||
				isBlockquote(line) ||
				isListItem(line) ||
				isHtmlBlockStart(line) ||
				(!ctx.inList && !ctx.inBlockquote); // Plain text after blank = new paragraph

			if (isNewBlock) {
				// Mark boundary: previous block ends at lastNonBlankLine
				if (ctx.inList) {
					// Check if this continues the list (indented or list item)
					const indent = getIndent(line);
					if (!isListItem(line) && indent <= ctx.listIndent) {
						ctx.inList = false;
						ctx.listIndent = 0;
						boundaries.push(lastNonBlankLine);
						blockStartLine = i;
					}
				} else {
					boundaries.push(lastNonBlankLine);
					blockStartLine = i;
				}
			}
		}

		blankLineCount = 0;

		// Detect block type of current line
		const fence = parseFence(line);
		if (fence) {
			ctx.inFencedCode = true;
			ctx.fenceChar = fence.char;
			ctx.fenceLength = fence.length;
			ctx.fenceIndent = fence.indent;
		} else if (isBlockquote(line) && !ctx.inList) {
			ctx.inBlockquote = true;
		} else if (isListItem(line) && !ctx.inList) {
			ctx.inList = true;
			ctx.listIndent = getIndent(line);
		} else if (isHtmlBlockStart(line)) {
			ctx.inHtmlBlock = true;
		}

		lastNonBlankLine = i;
	}

	return { boundaries, context: ctx };
}

export interface ParseStats {
	/** Total number of update() calls */
	updates: number;
	/** Number of times remark parsed the tail */
	tailParses: number;
	/** Number of times remark parsed newly finalized blocks */
	cacheParses: number;
	/** Number of cached (finalized) top-level blocks */
	cachedBlocks: number;
	/** Number of lines in the active tail being re-parsed */
	tailLines: number;
	/** Total lines in the document */
	totalLines: number;
}

/**
 * Node types that require whole-document visibility to resolve correctly.
 * When these appear in newly parsed content, the cache must be invalidated
 * because earlier blocks may have been parsed without them in scope.
 */
const CROSS_REFERENCE_TYPES = new Set(['footnoteDefinition']);

export class IncrementalParser {
	private processor: MarkdownProcessor;
	private previousSource = '';
	private lines: string[] = [];
	private context: ParserContext = createContext();
	private cachedChildren: RootContent[] = [];
	private pendingStartLine = 0;
	private hasCrossReferences = false;

	constructor(processor?: MarkdownProcessor) {
		this.processor = processor ?? MdProcessor;
	}

	stats: ParseStats = {
		updates: 0,
		tailParses: 0,
		cacheParses: 0,
		cachedBlocks: 0,
		tailLines: 0,
		totalLines: 0
	};

	update(source: string): Root {
		if (!source) {
			this.reset();
			return { type: 'root', children: [] };
		}

		// Detect non-append changes (source replaced, not appended)
		if (!source.startsWith(this.previousSource)) {
			this.reset();
		}

		this.stats.updates++;
		this.previousSource = source;
		this.lines = source.split('\n');
		this.stats.totalLines = this.lines.length;

		// When cross-references (e.g., footnotes) are present, block-level
		// caching is unsafe because blocks parsed in isolation won't resolve
		// references that depend on definitions elsewhere in the document.
		// Fall back to full document parsing.
		if (this.hasCrossReferences) {
			const fullParsed = this.processor.parse(source);
			this.processor.run(fullParsed);
			this.stats.tailParses++;
			this.stats.tailLines = this.lines.length;
			this.stats.cachedBlocks = 0;
			return fullParsed;
		}

		// Find new block boundaries from where we left off
		const { boundaries, context } = findBlockBoundaries(
			this.lines,
			this.pendingStartLine,
			this.context
		);

		// Process newly found boundaries
		if (boundaries.length > 0) {
			// All boundaries except the last one are "finalized" —
			// they have at least one complete block after them.
			const finalizableBoundaries = boundaries.slice(0, -1);

			if (finalizableBoundaries.length > 0) {
				// Parse the text from pendingStartLine to the last finalizable boundary
				const endLine = finalizableBoundaries[finalizableBoundaries.length - 1];
				const text = this.lines.slice(this.pendingStartLine, endLine + 1).join('\n');

				if (text.trim()) {
					const parsed = this.processor.parse(text);
					this.cachedChildren.push(...parsed.children);
					this.stats.cacheParses++;
				}

				this.pendingStartLine = endLine + 1;
			}

			// Update stored boundaries (keep only the last one as "pending confirmation")
		}

		this.context = context;

		// Parse the active tail (from pendingStartLine to end)
		const tailText = this.lines.slice(this.pendingStartLine).join('\n');
		let tailChildren: RootContent[] = [];

		this.stats.tailLines = this.lines.length - this.pendingStartLine;
		this.stats.cachedBlocks = this.cachedChildren.length;

		if (tailText.trim()) {
			const tailParsed = this.processor.parse(tailText);
			tailChildren = tailParsed.children;
			this.stats.tailParses++;
		}

		// Stitch the full tree
		const allChildren = [...this.cachedChildren, ...tailChildren];

		// Check if the document now contains cross-reference types.
		// If so, permanently disable caching and do a full re-parse to
		// ensure all references are resolved correctly.
		if (allChildren.some((c) => CROSS_REFERENCE_TYPES.has(c.type))) {
			this.hasCrossReferences = true;
			this.cachedChildren = [];
			this.pendingStartLine = 0;
			this.context = createContext();

			const fullParsed = this.processor.parse(source);
			this.processor.run(fullParsed);
			return fullParsed;
		}

		const root: Root = {
			type: 'root',
			children: allChildren
		};

		// Run transform plugins on the full stitched tree
		this.processor.run(root);

		return root;
	}

	reset(): void {
		this.previousSource = '';
		this.lines = [];
		this.context = createContext();
		this.cachedChildren = [];
		this.pendingStartLine = 0;
		this.hasCrossReferences = false;
		this.stats = {
			updates: 0,
			tailParses: 0,
			cacheParses: 0,
			cachedBlocks: 0,
			tailLines: 0,
			totalLines: 0
		};
	}
}
