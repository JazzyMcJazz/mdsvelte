import type { Component, Snippet } from 'svelte';
import Blockquote from './renderers/Blockquote.svelte';
import Break from './renderers/Break.svelte';
import Code from './renderers/Code.svelte';
import Definition from './renderers/Definition.svelte';
import Del from './renderers/Delete.svelte';
import Em from './renderers/Emphasis.svelte';
import FootnoteDefinition from './renderers/FootnoteDefinition.svelte';
import FootnoteReference from './renderers/FootnoteReference.svelte';
import Heading from './renderers/Heading.svelte';
import Hr from './renderers/Hr.svelte';
import Html from './renderers/Html.svelte';
import Image from './renderers/Image.svelte';
import ImageReference from './renderers/ImageReference.svelte';
import InlineCode from './renderers/InlineCode.svelte';
import Link from './renderers/Link.svelte';
import LinkReference from './renderers/LinkReference.svelte';
import List from './renderers/List.svelte';
import ListItem from './renderers/ListItem.svelte';
import Paragraph from './renderers/Paragraph.svelte';
import Root from './renderers/Root.svelte';
import Strong from './renderers/Strong.svelte';
import Table from './renderers/Table.svelte';
import TableBody from './renderers/TableBody.svelte';
import TableCell from './renderers/TableCell.svelte';
import TableHead from './renderers/TableHead.svelte';
import TableRow from './renderers/TableRow.svelte';
import Text from './renderers/Text.svelte';
import Yaml from './renderers/Yaml.svelte';

type PredefinedRenderers = {
	blockquote: typeof Blockquote;
	break: typeof Break;
	code: typeof Code;
	definition: typeof Definition;
	delete: typeof Del;
	emphasis: typeof Em;
	footnoteDefinition: typeof FootnoteDefinition;
	footnoteReference: typeof FootnoteReference;
	heading: typeof Heading;
	html: typeof Html;
	image: typeof Image;
	inlineCode: typeof InlineCode;
	imageReference: typeof ImageReference;
	link: typeof Link;
	linkReference: typeof LinkReference;
	list: typeof List;
	orderedListItem: typeof ListItem;
	unorderedListItem: typeof ListItem;
	listItem: typeof ListItem;
	paragraph: typeof Paragraph;
	root: typeof Root;
	strong: typeof Strong;
	table: typeof Table;
	tableBody: typeof TableBody;
	tableCell: typeof TableCell;
	tableHead: typeof TableHead;
	tableRow: typeof TableRow;
	thematicBreak: typeof Hr;
	text: typeof Text;
	yaml: typeof Yaml;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ComponentProps = { node: any; children?: Snippet; [key: string]: any };

export type Renderers = {
	[K in keyof PredefinedRenderers | string]: Component<ComponentProps, object, string>;
};

export const defaultRenderers: Renderers = {
	blockquote: Blockquote,
	break: Break,
	code: Code,
	definition: Definition,
	delete: Del,
	emphasis: Em,
	footnoteDefinition: FootnoteDefinition,
	footnoteReference: FootnoteReference,
	heading: Heading,
	html: Html,
	inlineCode: InlineCode,
	image: Image,
	imageReference: ImageReference,
	link: Link,
	linkReference: LinkReference,
	list: List,
	orderedListItem: ListItem,
	unorderedListItem: ListItem,
	listItem: ListItem,
	paragraph: Paragraph,
	root: Root,
	strong: Strong,
	table: Table,
	tableBody: TableBody,
	tableCell: TableCell,
	tableHead: TableHead,
	tableRow: TableRow,
	thematicBreak: Hr,
	text: Text,
	yaml: Yaml,
	bob: Yaml
};
