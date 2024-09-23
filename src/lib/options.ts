import type { ComponentType } from 'svelte';
import Blockquote from './renderers/Blockquote.svelte';
import Break from './renderers/Break.svelte';
import Code from './renderers/Code.svelte';
import Definition from './renderers/Definition.svelte';
import Del from './renderers/Delete.svelte';
import Em from './renderers/Emphasis.svelte';
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

type PredefinedRenderers = {
	blockquote: ComponentType<Blockquote>;
	break: ComponentType<Break>;
	code: ComponentType<Code>;
	definition: ComponentType<Definition>;
	delete: ComponentType<Del>;
	emphasis: ComponentType<Em>;
	heading: ComponentType<Heading>;
	html: ComponentType<Html>;
	image: ComponentType<Image>;
	inlineCode: ComponentType<InlineCode>;
	imageReference: ComponentType<ImageReference>;
	link: ComponentType<Link>;
	linkReference: ComponentType<LinkReference>;
	list: ComponentType<List>;
	orderedListItem: ComponentType<ListItem> | null;
	unorderedListItem: ComponentType<ListItem> | null;
	listItem: ComponentType<ListItem>;
	paragraph: ComponentType<Paragraph>;
	root: ComponentType<Root>;
	strong: ComponentType<Strong>;
	table: ComponentType<Table>;
	tableBody: ComponentType<TableBody>;
	tableCell: ComponentType<TableCell>;
	tableHead: ComponentType<TableHead>;
	tableRow: ComponentType<TableRow>;
	thematicBreak: ComponentType<Hr>;
	text: ComponentType<Text>;
};

export type Renderers = PredefinedRenderers & Record<string, ComponentType>;

export const defaultRenderers = {
	blockquote: Blockquote,
	break: Break,
	code: Code,
	definition: Definition,
	delete: Del,
	emphasis: Em,
	heading: Heading,
	html: Html,
	inlineCode: InlineCode,
	image: Image,
	imageReference: ImageReference,
	link: Link,
	linkReference: LinkReference,
	list: List,
	orderedListItem: null,
	unorderedListItem: null,
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
	text: Text
};
