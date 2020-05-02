'use strict';

const defaultType = null;

class ComponentStore {
	constructor() {
		this._componentStore = new Map();
	}

	register(type, component) {
		this._componentStore.set(type, component);
	}

	registerDefault(component) {
		this._componentStore.set(defaultType, component);
	}

	component(types) {
		if (!types) return;
		types = typeof types === 'String' ? [types] : types;

		for(const typeIndex in types) {
			const type = types[typeIndex];
			if (this._componentStore.has(type)) {
				return this._componentStore.get(type);
			}
		}
		return this._componentStore.has(defaultType) ? this._componentStore.get(defaultType) : null;
	}
}

window.D2L = window.D2L || {};
window.D2L.ComponentStore = window.D2L.ComponentStore || new Map();

export function componentStoreFactory(classFunction) {
	if (window.D2L.ComponentStore.has(classFunction)) {
		return window.D2L.ComponentStore.get(classFunction);
	}
	const componentStore = new ComponentStore();
	window.D2L.ComponentStore.set(classFunction, componentStore);
	return componentStore;
}
