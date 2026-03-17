import MdSvelte from './MdSvelte.svelte';
import { MdProcessor } from './processor.js';

export type { MarkdownProcessor, PluginProps } from './processor.js';
export type { PluggableList } from 'unified';
export type { Options as RemarkRehypeOptions } from 'remark-rehype';

export type {
	Blockquote,
	Break,
	Code,
	Definition,
	Delete,
	Emphasis,
	FootnoteDefinition,
	FootnoteReference,
	Heading,
	Html,
	Image,
	ImageReference,
	InlineCode,
	Link,
	LinkReference,
	List,
	ListItem,
	Paragraph,
	Root,
	RootContent,
	Strong,
	Table,
	TableCell,
	TableRow,
	Text,
	ThematicBreak,
	Yaml
} from 'mdast';

export { MdProcessor, MdSvelte };
