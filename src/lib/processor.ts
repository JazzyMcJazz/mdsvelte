import type { Root as HRoot } from 'hast';
import type { Root } from 'mdast';

import { unified, type PluggableList, type Processor } from 'unified';
import rehypeStringify from 'rehype-stringify';
import remarkRehype from 'remark-rehype';
import remarkParse from 'remark-parse';

export class MdProcessor {
	private static processor = unified().use(remarkParse).use(remarkRehype).use(rehypeStringify);

	static addPlugins(plugins: PluggableList) {
		(this.processor as unknown as Processor<Root, Root, HRoot, undefined, undefined>) = unified()
			.use(remarkParse)
			.use(remarkRehype);

		this.processor.use(plugins);

		this.processor.use(rehypeStringify);
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
