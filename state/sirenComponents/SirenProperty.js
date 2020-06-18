import { Component } from './Common.js';

export class SirenProperty {
	static basicInfo({property, type}) {
		return { id: property, type };
	}

	constructor({property}) {
		this._property = property;
		this._components = new Component();
	}

	get property() {
		return this._property;
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
		this.value = sirenEntity && sirenEntity.properties && sirenEntity.properties[this._property];
	}
}
