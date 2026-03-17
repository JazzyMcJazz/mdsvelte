import type { Definition } from 'mdast';

export function createReferences(definitions: Definition[]) {
	const map = new Map<string, Definition>();
	for (const def of definitions) map.set(def.identifier, def);
	return {
		get: (id: string): Definition | undefined => map.get(id)
	};
}

export type References = ReturnType<typeof createReferences>;
