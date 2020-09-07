import { fetch, stateFactory } from '../../state/store.js';
import { Component } from './Common.js';
import { shouldAttachToken } from '../token.js';

export class SirenLink {
	constructor({id, token}) {
		this._rel = id;
		this._components = new Component();
		this._token = token;
	}

	get rel() {
		return this._rel;
	}

	get link() {
		return this._link;
	}

	get childState() {
		return this._childState;
	}

	set link(link) {
		if (!this._link !== link) {
			this._components.setProperty(link && link.href);
		}
		this._link = link;

	}

	addComponent(component, property){
		this._components.add(component, property);
		this._components.setComponentProperty(component, this.link && this.link.href);
	}

	deleteComponent(component) {
		this._components.delete(component);
		this.childState.dispose
	}

	setSirenEntity(sirenEntity, linkCollectionMap) {
		this.link = sirenEntity && sirenEntity.hasLinkByRel(this.rel) && sirenEntity.getLinkByRel(this.rel);
		if (!this.link) return;

		if (linkCollectionMap && linkCollectionMap instanceof Map) {
			this.link.rel.forEach(rel => {
				if (linkCollectionMap.has(rel) && this !== linkCollectionMap.get(rel)) {
					this._merge(linkCollectionMap.get(rel));
				}
				linkCollectionMap.set(rel, this);
			});
		}

		if (this._token) {
			this._childState = stateFactory(this.link.href, shouldAttachToken(this._token, this.link));
			fetch(this._childState);
		}
	}

	_merge(sirenLink) {
		if (!sirenLink || !linkCollectionMap instanceof SirenLink) {
			return;
		}

		sirenLink._components.components.forEach((component, property) => {
			this.addComponent(component, property);
		});

		this._token = this._token || sirenLink._token;
	}
}
