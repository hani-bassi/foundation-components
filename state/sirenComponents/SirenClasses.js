import { Component } from './Common.js';

export class SirenClasses {
	constructor() {
		this._components = new Component();
	}

	get value() {
		return this._value;
	}

	set value(value) {
		if (!this._value !== value) {
			this._components.setProperty(value);
		}
		this._value = value;

	}

	addComponent(component, property) {
		this._components.add(component, property);
		this._components.setComponentProperty(component, this.value);
	}

	deleteComponent(component) {
		this._components.delete(component);
	}

	setSirenEntity(sirenEntity) {
		this.value = sirenEntity && sirenEntity['class'];
	}
}
