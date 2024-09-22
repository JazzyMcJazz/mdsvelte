import type { ComponentType } from 'svelte';
import Blockquote from './renderers/Blockquote.svelte';
import Break from './renderers/Break.svelte';
import Code from './renderers/Code.svelte';
import Del from './renderers/Delete.svelte';
import Em from './renderers/Emphasis.svelte';
import FootnoteDefinitions from './renderers/FootnoteDefinitions.svelte';
import FootnoteReference from './renderers/FootnoteReference.svelte';
import Heading from './renderers/Heading.svelte';
import Hr from './renderers/Hr.svelte';
import Html from './renderers/Html.svelte';
import InlineCode from './renderers/InlineCode.svelte';
import InlineMath from './renderers/InlineMath.svelte';
import Link from './renderers/Link.svelte';
import List from './renderers/List.svelte';
import ListItem from './renderers/ListItem.svelte';
import Math from './renderers/Math.svelte';
import Paragraph from './renderers/Paragraph.svelte';
import Strong from './renderers/Strong.svelte';
import Table from './renderers/Table.svelte';
import TableBody from './renderers/TableBody.svelte';
import TableCell from './renderers/TableCell.svelte';
import TableHead from './renderers/TableHead.svelte';
import TableRow from './renderers/TableRow.svelte';
import Image from './renderers/Image.svelte';
import Text from './renderers/Text.svelte';

export type Renderers = {
	blockquote: ComponentType<Blockquote>;
	break: ComponentType<Break>;
	code: ComponentType<Code>;
	delete: ComponentType<Del>;
	emphasis: ComponentType<Em>;
	footnoteDefinition: ComponentType<FootnoteDefinitions>;
	footnoteReference: ComponentType<FootnoteReference>;
	heading: ComponentType<Heading>;
	html: ComponentType<Html>;
	inlineCode: ComponentType<InlineCode>;
	inlineMath: ComponentType<InlineMath>;
	image: ComponentType<Image>;
	link: ComponentType<Link>;
	list: ComponentType<List>;
	orderedListItem: ComponentType<ListItem> | null;
	unorderedListItem: ComponentType<ListItem> | null;
	listItem: ComponentType<ListItem>;
	math: ComponentType<Math>;
	paragraph: ComponentType<Paragraph>;
	strong: ComponentType<Strong>;
	table: ComponentType<Table>;
	tableBody: ComponentType<TableBody>;
	tableCell: ComponentType<TableCell>;
	tableHead: ComponentType<TableHead>;
	tableRow: ComponentType<TableRow>;
	thematicBreak: ComponentType<Hr>;
	text: ComponentType<Text>;

	// token types without renderers
	root: null;
	definition: null;
	imageReference: null;
	linkReference: null;
	yaml: null;
};

export const defaultRenderers: Renderers = {
	blockquote: Blockquote,
	break: Break,
	code: Code,
	delete: Del,
	emphasis: Em,
	footnoteDefinition: FootnoteDefinitions,
	footnoteReference: FootnoteReference,
	heading: Heading,
	html: Html,
	inlineCode: InlineCode,
	inlineMath: InlineMath,
	image: Image,
	link: Link,
	list: List,
	orderedListItem: null,
	unorderedListItem: null,
	listItem: ListItem,
	math: Math,
	paragraph: Paragraph,
	strong: Strong,
	table: Table,
	tableBody: TableBody,
	tableCell: TableCell,
	tableHead: TableHead,
	tableRow: TableRow,
	thematicBreak: Hr,
	text: Text,

	//
	root: null,
	definition: null,
	imageReference: null,
	linkReference: null,
	yaml: null
};

export const defaultOptions = {
	baseUrl: null,
	breaks: false,
	gfm: true,
	headerIds: true,
	headerPrefix: '',
	highlight: null,
	langPrefix: 'language-',
	mangle: true,
	pedantic: false,
	renderer: null,
	sanitize: false,
	sanitizer: null,
	silent: false,
	smartLists: false,
	smartypants: false,
	tokenizer: null,
	xhtml: false
};
