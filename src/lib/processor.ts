import type { Root as HRoot } from 'hast';
import type { Root } from 'mdast';
import type { Options as RemarkRehypeOptions } from 'remark-rehype';

import { unified, type PluggableList } from 'unified';
import rehypeStringify from 'rehype-stringify';
import remarkRehype from 'remark-rehype';
import remarkParse from 'remark-parse';

interface PluginProps {
	remarkPlugins?: PluggableList | null | undefined;
	rehypePlugins?: PluggableList | null | undefined;
	remarkRehypeOptions?: RemarkRehypeOptions | null | undefined;
}

export class MdProcessor {
	private static processor = unified().use(remarkParse).use(remarkRehype).use(rehypeStringify);

	static setGlobalPlugins(options: PluginProps) {
		this.processor = unified()
			.use(remarkParse)
			.use(options.remarkPlugins || [])
			.use(remarkRehype, options.remarkRehypeOptions || {})
			.use(options.rehypePlugins || [])
			.use(rehypeStringify);
	}

	static parse(markdown: string): Root {
		return this.processor.parse(markdown) as Root;
	}

	static run(node: Root): HRoot {
		return this.processor.runSync(node);
	}

	static stringify(node: HRoot): string {
		return this.processor.stringify(node);
	}

	static process(markdown: string): string {
		return this.processor.processSync(markdown).toString();
	}
}
