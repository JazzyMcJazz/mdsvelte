import type { Definition } from 'mdast';

export class References {
	private static definitions: Map<string, Definition> = new Map();

	static set(reference: Definition) {
		this.definitions.set(reference.identifier, reference);
	}

	static get(identifier: string): Definition | undefined {
		return this.definitions.get(identifier);
	}
}
