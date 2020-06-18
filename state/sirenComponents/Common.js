export class Component {
	constructor() {
		this._components = new Map();
	}

	get components() {
		return this._components;
	}

	add(component, property) {
		if (this._components.has(component)) {
			return;
		}
		this._components.set(component, property);
	}

	setProperty(value) {
		this._components.forEach((component, property) => {
			component[property] = value;
		});
	}

	setComponentProperty(component, value) {
		if (!this._components.has(component)) {
			return false;
		}

		component[this._components.get(component)] = value;
	}

	delete(component) {
		return this._components.delete(component);
	}

}
