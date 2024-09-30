# MdSvelte

A markdown parser that renders into Svelte components. Inspired by [svelte-markdown](https://www.npmjs.com/package/svelte-markdown), but uses [remark-parse](https://www.npmjs.com/package/remark-parse) under the hood instead of marked.

# Installation

```sh
npm i @jazzymcjazz/mdsvelte
```

# Usage

### Basic

```html
<script>
	import { MdSvelte } from '@jazzymcjazz/mdsvelte';

	const source = `
# Some Header

Some paragraph

- List item
- List item with nested list items
  1. Item
  2. Item with even deeper nested list items
    - Item 1
    - Item 2

| Table Header 1 | Table Header 2 |
|----------------|----------------|
| Some | data |`;
</script>

<MdSvelte {source} />
```

### Custom Renderer

```html
<script>
    import { MdSvelte } from '@jazzymcjazz/mdsvelte';
    import MyCustomCodeComponent from '$libMyCustomCodeComponent';

    const source = '...';
</script>

<MdSvelte
    {source}
    renderers={{
        code: MyCustomCodeComponent
    }}
/>
```

### Extensions

You can use any plugins that work with unified. Note that additional plugins are installed between `remark-rehype` and `rehype-stringify`;

```js
const processor = unified()
	.use(remarkParse)
	.use(remarkRehype)
	// Added plugins here
	.use(rehypeStringify);
```

To add plugins use `MdProcessor`. Note that MdProcessor is a singleton and will change the behavior of `MdSvelte` across all instances.

In the future it may be possible to install separate plugins on a per `MdSvelte` instance basis.

```html
<script>
	import { MdSvelte, MdProcessor } from '@jazzymcjazz/mdsvelte';
	import rehypeHighlight from 'rehype-highlight';
	import remarkGfm from 'remark-gfm';

	MdProcessor.addPlugins([remarkGfm, rehypeHighlight]);

	const source = '...';
</script>

<MdSvelte {source} />
```

# Note

This is an early release. Documentation is still incomplete and the library only has the most basic featuers.

Expect breaking changes with each release until v1.0.
